import AnalysisService from "./services/AnalysisService";
import chalk from "chalk";
import os from "os";
import path from "path";
import MatchingRule from "./rules/MatchingRule";
import { urlPattern } from "./patterns/UrlPatterns";
import { secretsPatterns } from "./patterns/SecretsPatterns";

function usage() {
  let toolName = path.basename(process.argv[1]);

  if (toolName.endsWith('.ts')) {
    toolName = `bun run ${toolName}`;
  } else {
    if (os.platform() === 'win32' && !toolName.endsWith('.exe')) {
      toolName += '.exe';
    }
    if (os.platform() !== 'win32') {
      toolName = `./${toolName}`;
    }
  }

  console.log(chalk.green(`Usage: ${toolName} <target-folder-or-file>`));
  console.log();
  console.log(`\nExamples:`);
  console.log(`  1. Analyze a single JS file: ${chalk.yellow('📄')}`);
  console.log(chalk.blue(`     ${toolName} ./path/to/file.js`));
  console.log(`     This will analyze the file 'file.js' and output the report.`);
  console.log();
  console.log(
    `  2. Analyze all TypeScript files in a directory (including subdirectories): ${chalk.yellow('📁')}`
  );
  console.log(chalk.blue(`     ${toolName} ./path/to/directory`));
  console.log(`     This will analyze all JS files in the 'directory' and its subdirectories, and output a combined report.`);
  console.log();
  console.log(chalk.red(`Note: Make sure the path is correct. If the file or directory does not exist, the tool will not be able to analyze it.`));
}

if (
  !process.argv[2] ||
  process.argv.includes("-h") ||
  process.argv.includes("--help")
) {
  usage();
  process.exit(0);
}

const targetPath = process.argv[2];

const analysisService = new AnalysisService(targetPath);

const urlMatchingRule = new MatchingRule("endpoints", urlPattern);
const secretsMatchingRule = new MatchingRule("secrets", secretsPatterns);

const results = analysisService.run([urlMatchingRule, secretsMatchingRule]);

console.log(results);