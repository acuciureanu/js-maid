import * as acorn from "acorn";
import FileDatasource from "../datasources/FileDatasource";
import RuleEngine from "../engines/RuleEngine";
import LiteralRule from "../rules/LiteralRule";
import ReferenceResolverRule from "../rules/ReferenceResolverRule";
import TemplateLiteralRule from "../rules/TemplateLiteralRule";
import MatchingRule from "../rules/MatchingRule";
import type { AnalysisResult } from "../models/AnalysisResult";

class AnalysisService {
  private targetPath: string;

  constructor(targetPath: string) {
    this.targetPath = targetPath;
  }

  /**
   * Runs the analysis on the target files using the provided matching rules.
   * @param matchingRules - An array of matching rules to apply during the analysis.
   * @returns A promise that resolves to an array of analysis results.
   */
  public async run(matchingRules: MatchingRule[]): Promise<AnalysisResult[]> {
    const files = new FileDatasource().loadFiles(this.targetPath);
    const results: AnalysisResult[] = [];

    files.forEach((file) => {
      try {
        const ast = acorn.parse(file.fileContent, {
          ecmaVersion: "latest",
          sourceType: "module",
        });

        // Create a new rule engine and add the rules to it
        // If you add a new rule, you need to add it here too
        const engine = new RuleEngine(ast)
          .addRule(new LiteralRule())
          .addRule(new TemplateLiteralRule())
          .addRule(new ReferenceResolverRule());

        const context = engine.process(matchingRules);

        const fileMatches: { [ruleType: string]: Set<string> | string[] } = {};
        matchingRules.forEach((rule) => {
          const ruleData = context.getData(rule.type);
          fileMatches[rule.type] =
            rule.type === "endpoints" ? new Set(ruleData) : ruleData;
        });

        const hasMatches = Object.values(fileMatches).some((matches) =>
          matches instanceof Set ? matches.size > 0 : matches.length > 0
        );
        if (hasMatches) {
          const finalMatches: { [ruleType: string]: string[] } = {};
          Object.entries(fileMatches).forEach(([ruleType, matches]) => {
            finalMatches[ruleType] = Array.from(matches);
          });
          results.push({ filename: file.filePath, matches: finalMatches });
        }
      } catch (error) {
        console.error(
          `An error occurred while analyzing file ${file.filePath}:`,
          error
        );
      }
    });

    return results;
  }
}

export default AnalysisService;
