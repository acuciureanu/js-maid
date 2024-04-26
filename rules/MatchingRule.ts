import type { ProcessingContext } from "../contexts/ProcessingContext";
import type { Rule } from "../interfaces/Rule";

/**
 * Represents a matching rule that applies a regular expression pattern to a string value.
 */
export default class MatchingRule implements Rule {
    /**
     * Creates a new instance of the MatchingRule class.
     * @param type - The type of the rule.
     * @param pattern - The regular expression pattern to match.
     */
    constructor(public type: string, public pattern: RegExp) {}
  
    /**
     * Applies the matching rule to the given node value and processing context.
     * @param nodeValue - The value of the node to apply the rule to.
     * @param context - The processing context.
     * @returns The updated processing context.
     */
    apply(nodeValue: string, context: ProcessingContext): ProcessingContext {
      const matches = nodeValue.match(this.pattern);
      if (matches) {
        matches.forEach((match: any) => context.addData(this.type, match));
      }
      return context;
    }
}
