import fs from "fs";
import { webcrack, type Options } from "webcrack";

/**
 * Service for unpacking bundles.
 */
class UnpackingService {
  private inputBundlePath: string;
  private outputDirPath: string;

  /**
   * Creates an instance of UnpackingService.
   * @param inputBundlePath - The path to the input bundle file.
   * @param outputDirPath - The path to the output directory.
   */
  constructor(inputBundlePath: string, outputDirPath: string) {
    if (!fs.statSync(inputBundlePath).isFile()) {
      throw new Error("inputBundlePath should be a path to a file, not a directory.");
    }
    this.inputBundlePath = inputBundlePath;
    this.outputDirPath = outputDirPath;
  }

  /**
   * Unpacks the bundle.
   * @param options - Optional options for unpacking.
   * @returns The path to the output directory.
   */
  public async unpack(options?: Options): Promise<string> {
    const input = fs.readFileSync(this.inputBundlePath, "utf8");
    const result = await webcrack(input, options);

    if (!fs.existsSync(this.outputDirPath)) {
      fs.mkdirSync(this.outputDirPath, { recursive: true });
    }

    await result.save(this.outputDirPath);

    return this.outputDirPath;
  }
}

export default UnpackingService;
