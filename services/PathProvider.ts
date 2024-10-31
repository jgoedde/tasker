import { injectable } from "inversify";
import * as path from "jsr:@std/path";

@injectable()
export class PathProvider {
  public getAppDirectory(): string {
    return path.join(this.getPath(), "tasker");
  }

  public getTasksFile(): string {
    return path.join(this.getAppDirectory(), "tasks.json");
  }

  /**
   * Gets the XDG_DATA_HOME or default to ~/.local/share
   */
  private getPath(): string {
    const homeDir = Deno.env.get("HOME") || "~";
    return Deno.env.get("XDG_DATA_HOME") ||
      path.join(homeDir, ".local", "share");
  }
}
