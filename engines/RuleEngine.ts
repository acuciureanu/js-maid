import { ProcessingContext } from "../contexts/ProcessingContext";
import type { Rule } from "../interfaces/Rule";
import type MatchingRule from "../rules/MatchingRule";

export default class RuleEngine {
  private rules: Rule[] = [];

  constructor(private ast: any) {}

  addRule(rule: Rule): RuleEngine {
    this.rules.push(rule);
    return this;
  }

  processNode(node: any, context: ProcessingContext, matchingRules: MatchingRule[]) {
    this.rules.forEach((rule) => rule.apply(node, context, matchingRules));
    Object.values(node).forEach((child) => {
      if (typeof child === "object" && child !== null) {
        this.processNode(child, context, matchingRules);
      }
    });
  }

  process(matchingRules: MatchingRule[]): ProcessingContext {
    const context = new ProcessingContext();
    this.processNode(this.ast, context, matchingRules);
    return context;
  }
}
