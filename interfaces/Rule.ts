import type { ProcessingContext } from "../contexts/ProcessingContext";
import type MatchingRule from "../rules/MatchingRule";

/**
 * Represents a rule that can be applied to a node.
 */
export interface Rule {
  /**
   * Applies the rule to the given node.
   * @param node The node to apply the rule to.
   * @param context The processing context.
   * @returns The updated processing context.
   */
  apply(node: any, context: ProcessingContext, matchingRules: MatchingRule[]): ProcessingContext;
}
