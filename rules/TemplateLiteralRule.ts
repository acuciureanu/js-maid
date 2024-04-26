import type { Rule } from "../interfaces/Rule";
import type { ProcessingContext } from "../contexts/ProcessingContext";
import type MatchingRule from "./MatchingRule";

/**
 * Represents a rule that applies to template literals.
 */
export default class TemplateLiteralRule implements Rule {
  /**
   * Applies the template literal rule to the given node.
   * @param node - The node to apply the rule to.
   * @param context - The processing context.
   * @param matchingRules - The matching rules to apply.
   * @returns The updated processing context.
   */
  apply(
    node: any,
    context: ProcessingContext,
    matchingRules: MatchingRule[]
  ): ProcessingContext {
    if (context === null) {
      throw new Error("Context cannot be null");
    }

    if (node.type === "TemplateLiteral") {
      let combinedParts = "";

      // Iterate through the quasis and expressions
      for (let i = 0; i < node.quasis.length; i++) {
        // Add the current quasi (template literal part)
        combinedParts += node.quasis[i].value.cooked;

        // Safely add the value of the expression if it exists
        if (i < node.expressions.length) {
          const exprValue = context.references[node.expressions[i].name];
          combinedParts += exprValue !== undefined ? exprValue : "[dynamic]";
        }
      }

      // Apply each matching rule to the combined template literal content
      matchingRules.forEach((rule) => {
        rule.apply(combinedParts, context);
      });
    }

    return context;
  }
}
