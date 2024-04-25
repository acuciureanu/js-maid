/**
 * Represents a rule that applies to literal nodes in the AST.
 */
import type { ProcessingContext } from "../contexts/ProcessingContext";
import type { Rule } from "../interfaces/Rule";
import type MatchingRule from "./MatchingRule";

export default class LiteralRule implements Rule {
  /**
   * Applies the rule to the given node.
   * @param node - The node to apply the rule to.
   * @param context - The processing context.
   * @param matchingRules - The matching rules to apply.
   * @returns The updated processing context.
   */
  apply(node: any, context: ProcessingContext, matchingRules: MatchingRule[]): ProcessingContext {
    if (node.type === "Literal" && typeof node.value === "string") {
      matchingRules.forEach((rule) => rule.apply(node.value, context));
    }
    return context;
  }
}