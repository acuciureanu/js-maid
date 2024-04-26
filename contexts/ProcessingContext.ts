export class ProcessingContext {
  private data: { [key: string]: Set<string> } = {};
  public references: { [key: string]: any } = {};

  addData(key: string, item: any) {
    const serializedItem = this.serializeItem(item);
    if (!this.data[key]) {
      this.data[key] = new Set();
    }
    this.data[key].add(serializedItem);
  }

  getData(key: string): any[] {
    if (!this.data[key]) return [];
    return Array.from(this.data[key]).map((item) => JSON.parse(item));
  }

  serializeItem(item: any): string {
    if (
      item &&
      typeof item === "object" &&
      item.type &&
      item.message &&
      item.location
    ) {
      return JSON.stringify({
        type: item.type,
        message: item.message,
        location: item.location,
      });
    }
    return JSON.stringify(item);
  }
}
