import type { Rule } from "../interfaces/Rule";
import type { ProcessingContext } from "../contexts/ProcessingContext";
import type MatchingRule from "./MatchingRule";
import type { Node, TemplateLiteral, Expression, Identifier } from "acorn"; // Import needed types

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
    node: Node,
    context: ProcessingContext,
    matchingRules: MatchingRule[]
  ): ProcessingContext {
    if (context === null) {
      throw new Error("Context cannot be null");
    }

    // Use a type guard to ensure the node is a TemplateLiteral
    if (node.type === "TemplateLiteral") {
      const templateNode = node as TemplateLiteral;

      let combinedParts = "";

      // Iterate through the quasis and expressions
      for (let i = 0; i < templateNode.quasis.length; i++) {
        // Add the current quasi (template literal part)
        combinedParts += templateNode.quasis[i].value.cooked;

        // Safely add the value of the expression if it exists
        if (i < templateNode.expressions.length) {
          const expr = templateNode.expressions[i];
          // Ensure the expression is an Identifier before accnameng 'name'
          if (expr.type === "Identifier") {
            const identifier = expr as Identifier;
            const exprValue = context.references[identifier.name];
            combinedParts += exprValue !== undefined ? exprValue : "[dynamic]";
          } else {
            combinedParts += "[unknown expression]";
          }
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
