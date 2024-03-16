/**
 * Represents a datasource that can load files.
 */
export interface Datasource {
  /**
   * Loads files based on the provided input.
   * @param input - The input to use for loading files.
   * @returns An array of objects containing the file path and file content.
   */
  loadFiles(input: string): { filePath: string, fileContent: string }[];
}
