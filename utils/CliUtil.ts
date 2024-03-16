import chalk from "chalk";
import os from "os";
import path from "path";

export function usage() {
  const scriptName = path.basename(process.argv[1]);
  const toolName = scriptName.endsWith(".ts") ? `bun run ${scriptName}` : scriptName;
  const formattedToolName = os.platform() === "win32" ? `${toolName}.exe` : `./${toolName}`;
  console.log(chalk.green(`Usage: ${formattedToolName} <target-folder-or-file> [--unpack] [--deobfuscate] [--unminify] [--unpackOutputDir <path>]`));
  console.log(chalk.yellow("\nOptions:"));
  console.log("  --unpack             Unpack the code before analysis");
  console.log("  --deobfuscate        Deobfuscate the code before analysis");
  console.log("  --unminify           Unminify the code before analysis");
  console.log('  --unpackOutputDir    Specify the output directory for unpacked files (default: "unpacked")');
  console.log(chalk.red("\nNote: Use the flags to enable specific features as needed.\n"));
}

export function parseArgs(args: string[]) {
  const targetPathIndex = args.findIndex((arg) => !arg.startsWith("--"));
  const outputDirIndex = args.findIndex((arg) => arg.startsWith("--unpackOutputDir"));

  let unpackOutputDirPath: string | undefined;
  if (outputDirIndex !== -1 && outputDirIndex + 1 < args.length) {
    unpackOutputDirPath = args[outputDirIndex + 1];
  }

  return {
    targetPath: targetPathIndex !== -1 ? args[targetPathIndex] : null,
    unpack: args.includes("--unpack"),
    deobfuscate: args.includes("--deobfuscate"),
    unminify: args.includes("--unminify"),
    unpackOutputDirPath: unpackOutputDirPath || "unpacked",
  };
}
