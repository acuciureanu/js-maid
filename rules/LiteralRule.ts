import type { ProcessingContext } from "../contexts/ProcessingContext";
import type { IRule } from "../interfaces/IRule";
import type MatchingRule from "./MatchingRule";

export default class LiteralRule implements IRule {
  apply(node: any, context: ProcessingContext, matchingRules: MatchingRule[]): ProcessingContext {
    if (node.type === "Literal" && typeof node.value === "string") {
      matchingRules.forEach((rule) => rule.applyMatch(node.value, context));
    }
    return context;
  }
}