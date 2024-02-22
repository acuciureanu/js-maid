import type { ProcessingContext } from "../contexts/ProcessingContext";
import type { IRule } from "../interfaces/IRule";
import type MatchingRule from "./MatchingRule";

/**
 * Implements the ReferenceResolverRule class that applies a rule to resolve references in a given node.
 */
export default class ReferenceResolverRule implements IRule {
  /**
   * Applies the ReferenceResolverRule to a given node in the processing context.
   * This rule resolves variable declarations and adds them to the references in the context.
   *
   * @param node - The node to apply the rule to.
   * @param context - The processing context.
   * @returns The updated processing context.
   */
  apply(node: any, context: ProcessingContext, matchingRules: MatchingRule[] = []): ProcessingContext {
    if (node.type === "VariableDeclaration") {
      node.declarations.forEach((declaration: any) => {
        if (declaration.id.type === "Identifier" &&
            declaration.init &&
            declaration.init.type === "Literal") {
          context.references[declaration.id.name] = declaration.init.value;
        }
      });
    }
    return context;
  }
}
