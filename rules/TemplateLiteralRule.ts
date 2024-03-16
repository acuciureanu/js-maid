import type { Rule } from "../interfaces/Rule";
import type { ProcessingContext } from "../contexts/ProcessingContext";
import type MatchingRule from "./MatchingRule";

/**
 * Represents a rule that applies to template literals.
 */
export default class TemplateLiteralRule implements Rule {
  apply(node: any, context: ProcessingContext, matchingRules: MatchingRule[]): ProcessingContext {
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
      matchingRules.forEach(rule => {
        rule.applyMatch(combinedParts, context);
      });
    }

    return context;
  }
}