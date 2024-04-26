/**
 * Represents a rule that applies to literal nodes in the AST.
 */
import type { Node } from "acorn";
import type { ProcessingContext } from "../contexts/ProcessingContext";
import type { Rule } from "../interfaces/Rule";
import type MatchingRule from "./MatchingRule";
import { isLiteral } from "../utils/NodeUtil";

export default class LiteralRule implements Rule {
  /**
   * Applies the rule to the given node.
   * @param node - The node to apply the rule to.
   * @param context - The processing context.
   * @param matchingRules - The matching rules to apply.
   * @returns The updated processing context.
   */
  apply(
    node: Node,
    context: ProcessingContext,
    matchingRules: MatchingRule[]
  ): ProcessingContext {
    if (context === null) {
      throw new Error("Context cannot be null");
    }
    
    if (isLiteral(node)) {
      matchingRules.forEach((rule) => {
        if (typeof node.value === "string") {
          rule.apply(node.value, context);
        } else {
          console.log(
            `Skipped applying rule because the value it's not a string: ${node.value}`
          );
        }
      });
    }

    return context;
  }
}
