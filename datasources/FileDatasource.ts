import * as FileExtensions from "../constants/FileExtensions";
import fs from "fs";
import path from "path";
import type * as IDatasource from "../interfaces/Datasource";

export default class FileDatasource implements IDatasource.Datasource {
  loadFiles(input: string): {
    path: string; filePath: string; fileContent: string 
}[] {
    const files: { path: string; filePath: string; fileContent: string }[] = [];
    const stats = fs.statSync(input);
    if (stats.isFile()) {
      if (FileExtensions.allowedExtensions.includes(path.extname(input))) {
        const fileContent = fs.readFileSync(input, "utf-8");
        files.push({ path: input, filePath: input, fileContent });
      }
    } else if (stats.isDirectory()) {
      fs.readdirSync(input).forEach((file: string) => {
        files.push(...this.loadFiles(path.join(input, file)));
      });
    }
    return files;
  }
}
