import * as fs from "fs/promises";
import path from "path";
import { Question } from "../types";

export class FileSystemManager {
  constructor(private outputDir: string) {}

  async ensureOutputDirectory(): Promise<void> {
    try {
      await fs.access(this.outputDir);
    } catch {
      await fs.mkdir(this.outputDir, { recursive: true });
    }
  }

  async saveToJson(
    questions: Question[],
    filename: string,
    model: string
  ): Promise<string> {
    await this.ensureOutputDirectory();

    const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
    const safeName = filename.replace(/[^a-z0-9]/gi, "-").toLowerCase();
    const fullFilename = `${safeName}-${timestamp}.json`;
    const filePath = path.join(this.outputDir, fullFilename);

    const data = {
      metadata: {
        generated: new Date().toISOString(),
        model: model,
        questionCount: questions.length,
      },
      questions,
    };

    await fs.writeFile(filePath, JSON.stringify(data, null, 2), "utf8");
    return filePath;
  }
}
