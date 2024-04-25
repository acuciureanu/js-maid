import type { Program } from "acorn";
import { ProcessingContext } from "../contexts/ProcessingContext";
import type { Rule } from "../interfaces/Rule";
import type MatchingRule from "../rules/MatchingRule";

export default class RuleEngine {
  private rules: Rule[] = [];

  constructor(private ast: Program) {}

  addRule(rule: Rule): RuleEngine {
    this.rules.push(rule);
    return this;
  }

  processNode(
    node: any,
    context: ProcessingContext,
    matchingRules: MatchingRule[]
  ): ProcessingContext {
    this.rules.forEach((rule) => rule.apply(node, context, matchingRules));
    Object.values(node).forEach((child) => {
      if (typeof child === "object" && child !== null) {
        this.processNode(child, context, matchingRules);
      }
    });
    return context;
  }

  process(matchingRules: MatchingRule[]): ProcessingContext {
    const context = new ProcessingContext();
    console.log("Starting rule processing...");
    Promise.all(this.rules.map((rule) => {
      console.log(`Applying rule ${rule.constructor.name}...`);
      return rule.apply(this.ast, context, matchingRules);
    })).then(() => {
      console.log("Rule processing completed.");
    });
    return this.processNode(this.ast, context, matchingRules);
  }
}
