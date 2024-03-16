import type { ProcessingContext } from "../contexts/ProcessingContext";

export default class MatchingRule {
    constructor(public type: string, public pattern: RegExp) {}
  
    applyMatch(nodeValue: string, context: ProcessingContext) {
      const matches = nodeValue.match(this.pattern);
      if (matches) {
        matches.forEach((match: any) => context.addData(this.type, match));
      }
    }
  }