import { ProcessingContext } from "../contexts/ProcessingContext";
import type { Rule } from "../interfaces/Rule";

export default class ReferenceResolverRule implements Rule {
  /**
   * Applies the ReferenceResolverRule to a given node in the processing context.
   * This rule resolves variable declarations and adds them to the references in the context.
   * Safe checks ensure that the context and its references property are properly initialized.
   *
   * @param node - The node to apply the rule to.
   * @param context - The processing context.
   * @returns The updated processing context.
   */
  apply(node: any, context: ProcessingContext): ProcessingContext {
    if (!context || typeof context.references !== "object") {
      console.error(
        "Invalid context or context.references is not initialized."
      );
      return context;
    }

    // Process only if node is a VariableDeclaration
    if (node.type === "VariableDeclaration") {
      node.declarations.forEach((declaration: any) => {
        if (
          declaration.id &&
          declaration.id.type === "Identifier" &&
          declaration.init &&
          declaration.init.type === "Literal"
        ) {
          context.references[declaration.id.name] = declaration.init.value;
        }
      });
    }

    return context;
  }
}
