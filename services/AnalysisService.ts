import PrototypePollutionRule from "../rules/PrototypePollutionRule";
import LiteralRule from "../rules/LiteralRule";
import TemplateLiteralRule from "../rules/TemplateLiteralRule";
import ReferenceResolverRule from "../rules/ReferenceResolverRule";
import MatchingRule from "../rules/MatchingRule";
import RuleEngine from "../engines/RuleEngine";
import type { AnalysisResult } from "../models/AnalysisResult";
import * as acorn from "acorn";

export default class AnalysisService {
  public async run(
    fileData: { filePath: string; fileContent: string }[],
    matchingRules: MatchingRule[],
    rulesConfig: { [ruleName: string]: boolean }
  ): Promise<AnalysisResult[]> {
    console.log("Starting analysis of files");

    const results = await Promise.all(
      fileData.map(async ({ filePath, fileContent }) => {
        console.log(`Processing file: ${filePath}`);
        try {
          const ast = acorn.parse(fileContent, {
            ecmaVersion: "latest",
            sourceType: "module",
          });

          const engine = new RuleEngine(ast)
            .addRule(new LiteralRule())
            .addRule(new TemplateLiteralRule())
            .addRule(new ReferenceResolverRule());

          if (rulesConfig["prototypePollution"]) {
            console.log("Adding Prototype Pollution rule");
            engine.addRule(new PrototypePollutionRule());
          }

          const context = engine.process(matchingRules);
          const fileMatches: { [ruleType: string]: Set<string> } = {};
          let hasRuleMatches = false;

          matchingRules.forEach((rule) => {
            const ruleData = context.getData(rule.type);
            if (ruleData && ruleData.length > 0) {
              fileMatches[rule.type] = new Set(ruleData);
              hasRuleMatches = true;
            }
          });

          const finalMatches: { [ruleType: string]: string[] } = {};
          Object.entries(fileMatches).forEach(([ruleType, matches]) => {
            if (matches.size > 0) {
              finalMatches[ruleType] = Array.from(matches);
            }
          });

          const prototypePollutionFindings = context.getData(
            "prototypePollutionFindings"
          );
          const hasPrototypePollutionFindings =
            prototypePollutionFindings && prototypePollutionFindings.length > 0;

          if (hasRuleMatches || hasPrototypePollutionFindings) {
            return {
              filename: filePath,
              matches: finalMatches,
              prototypePollutionFindings: hasPrototypePollutionFindings
                ? prototypePollutionFindings
                : [],
            };
          }
        } catch (error) {
          console.error(
            `An error occurred while analyzing file ${filePath}:`,
            error
          );
        }
        return null;
      })
    );

    return results.filter(
      (result): result is AnalysisResult => result !== null
    );
  }
}
