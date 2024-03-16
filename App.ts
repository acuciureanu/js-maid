import fs from "fs";
import path from "path";
import { urlPattern } from "./patterns/UrlPatterns";
import { secretsPatterns } from "./patterns/SecretsPatterns";
import MatchingRule from "./rules/MatchingRule";
import AnalysisService from "./services/AnalysisService";
import UnpackingService from "./services/UnpackingService";
import type { AnalysisResult } from "./models/AnalysisResult";
import { parseArgs, usage } from "./utils/CliUtil";

const matchingRules: MatchingRule[] = [
  new MatchingRule("endpoints", urlPattern),
  new MatchingRule("secrets", secretsPatterns),
];

async function performAnalysis(
  targetPath: string,
  outputDirPath: string
): Promise<void> {
  const analysisService = new AnalysisService(targetPath);
  try {
    const results: AnalysisResult[] = await analysisService.run(matchingRules);
    console.log(results);

    if (!fs.existsSync(outputDirPath)) {
      fs.mkdirSync(outputDirPath, { recursive: true });
    }

    const outputPath = path.join(outputDirPath, "analysisResults.json");
    fs.writeFileSync(outputPath, JSON.stringify(results, null, 2), "utf8");
  } catch (error) {
    console.error("An error occurred during analysis:", error);
  }
}

async function main() {
  const { targetPath, unpack, deobfuscate, unminify, unpackOutputDirPath } =
    parseArgs(process.argv.slice(2));

  if (!targetPath) {
    usage();
    return;
  }

  try {
    if (unpack || deobfuscate || unminify) {
      const unpackingService = new UnpackingService(
        targetPath,
        unpackOutputDirPath
      );
      const unpackedPath = await unpackingService.unpack({
        unpack,
        deobfuscate,
        unminify,
      });
      await performAnalysis(unpackedPath, unpackOutputDirPath);
    } else {
      await performAnalysis(targetPath, "unpacked");
    }
  } catch (error) {
    console.error("An error occurred in main:", error);
  }
}

main();
