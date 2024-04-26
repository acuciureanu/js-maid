import fs from "fs/promises";
import path from "path";
import { secretsPatterns } from "./patterns/SecretsPatterns";
import { urlPattern } from "./patterns/UrlPatterns";
import MatchingRule from "./rules/MatchingRule";
import UnpackingService from "./services/UnpackingService";
import type { AnalysisResult } from "./models/AnalysisResult";
import { parseArgs, usage } from "./utils/CliUtil";
import AnalysisService from "./services/AnalysisService";
import { allowedExtensions } from "./constants/FileExtensions";

async function performAnalysis(
  filePaths: string[],
  outputDirPath: string,
  rulesConfig: { [ruleName: string]: boolean }
): Promise<void> {
  const matchingRules: MatchingRule[] = [
    new MatchingRule("endpoints", urlPattern),
    new MatchingRule("secrets", secretsPatterns),
  ];

  const fileData = [];

  for (const filePath of filePaths) {
    try {
      const content = await fs.readFile(filePath, "utf8");
      fileData.push({ filePath, fileContent: content });
    } catch (error) {
      console.error(`Failed to read file ${filePath}:`, error);
      continue; // Skip files that cannot be read
    }
  }

  const analysisService = new AnalysisService();
  let results = [];
  try {
    results = await analysisService.run(fileData, matchingRules, rulesConfig);
    console.log(JSON.stringify(results, null, 2));
  } catch (error) {
    console.error('Error during analysis:', error);
    return; // Optionally, handle more gracefully depending on requirements
  }

  try {
    await fs.mkdir(outputDirPath, { recursive: true });
    const outputPath = path.join(outputDirPath, "analysisResults.json");
    await fs.writeFile(outputPath, JSON.stringify(results, null, 2), "utf8");
  } catch (error) {
    console.error('Failed to write analysis results:', error);
  }
}

async function getAllFiles(
  dirPath: string,
  arrayOfFiles: string[] = []
): Promise<string[]> {
  const entries = await fs.readdir(dirPath, { withFileTypes: true });

  for (const entry of entries) {
    const fullPath = path.join(dirPath, entry.name);
    if (entry.isDirectory()) {
      await getAllFiles(fullPath, arrayOfFiles);
    } else if (
      entry.isFile() &&
      allowedExtensions.some((ext) => entry.name.endsWith(ext))
    ) {
      arrayOfFiles.push(fullPath);
    }
  }

  return arrayOfFiles;
}

async function main() {
  const options = parseArgs(process.argv.slice(2));

  if (!options.targetPath) {
    usage();
    return;
  }

  try {
    const stat = await fs.stat(options.targetPath);
    let filePaths = stat.isDirectory() ? await getAllFiles(options.targetPath) : [options.targetPath];

    const processedFiles = await Promise.all(filePaths.map(async (filePath) => {
      console.log(`Processing ${path.basename(filePath)}...`);
      const unpackingService = new UnpackingService(filePath, options.unpackOutputDirPath);

      if (options.unpack || options.deobfuscate || options.unminify) {
        const unpackedPath = await unpackingService.unpack(options);
        if (unpackedPath && (await fs.stat(unpackedPath)).isFile()) {
          return unpackedPath; // Use the unpacked file path if valid
        } else {
          console.warn(`Skipping non-file path post-processing: ${unpackedPath}`);
          return null; // Skip this path
        }
      }
      return filePath; // Use the original path if no processing needed
    }));

    await performAnalysis(filePaths, options.unpackOutputDirPath, options.rules);
  } catch (error) {
    console.error("An error occurred in main:", error);
  }
}

main();
