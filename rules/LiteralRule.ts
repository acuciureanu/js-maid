import type { ProcessingContext } from "../contexts/ProcessingContext";
import type { Rule } from "../interfaces/Rule";
import type MatchingRule from "./MatchingRule";

export default class LiteralRule implements Rule {
  apply(node: any, context: ProcessingContext, matchingRules: MatchingRule[]): ProcessingContext {
    if (node.type === "Literal" && typeof node.value === "string") {
      matchingRules.forEach((rule) => rule.apply(node.value, context));
    }
    return context;
  }
}