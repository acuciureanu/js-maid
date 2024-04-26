export const parseArgs = (args: string[]) => {
  const targetPathIndex = args.findIndex((arg) => !arg.startsWith("--"));
  const outputDirIndex = args.findIndex((arg) =>
    arg.startsWith("--unpackOutputDir")
  );
  const rules: { [key: string]: boolean } = {}; // Add index signature to allow indexing with a string

  args.forEach((arg) => {
    if (arg.startsWith("--enable-")) {
      const ruleName = arg.substring("--enable-".length);
      rules[ruleName] = true;
    }
  });

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
    rules: rules,
  };
};

export const usage = () => {
  console.log("Usage: node [script.js] --targetPath [path] [options]");
  console.log("Options:");
  console.log(" --unpack             Unpack files");
  console.log(" --deobfuscate        Deobfuscate files");
  console.log(" --unminify           Unminify files");
  console.log(" --unpackOutputDir    Specify output directory for unpacking");
  console.log(
    " --enable-[ruleName]  Enable specific analysis rules, e.g., --enable-prototypePollution"
  );
};
