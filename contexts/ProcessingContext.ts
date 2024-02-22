/**
 * Represents a processing context that stores data and references.
 */
export class ProcessingContext {
  private data: { [key: string]: any[] } = {};

  /**
   * Adds an item to the data associated with the specified key.
   * If the key does not exist, a new array is created.
   * @param key - The key to associate the item with.
   * @param item - The item to add to the data.
   */
  addData(key: string, item: any) {
    if (!this.data[key]) {
      this.data[key] = [];
    }
    this.data[key].push(item);
  }

  /**
   * Retrieves the data associated with the specified key.
   * If the key does not exist, an empty array is returned.
   * @param key - The key to retrieve the data for.
   * @returns An array containing the data associated with the key.
   */
  getData(key: string): any[] {
    return this.data[key] || [];
  }

  /**
   * Stores references to other objects.
   */
  public references: { [key: string]: any } = {};

  /**
   * Compiles results into a simplified format.
   * @param filename - The current file being processed.
   * @returns Compiled results for the file.
   */
  compileResults(filename: string): { filename: string, matches: any[] } {
    const matches: any[] = [];

    for (const key in this.data) {
      if (this.data.hasOwnProperty(key)) {
        matches.push(...this.data[key]);
      }
    }

    return { filename, matches };
  }
}
