import { injectable } from "inversify";

@injectable()
export class DateProvider {
  public now(): Date {
    return new Date();
  }
}
