import * as acorn from "acorn";
import FileDatasource from "../datasources/FileDatasource";
import RuleEngine from "../engines/RuleEngine";
import LiteralRule from "../rules/LiteralRule";
import ReferenceResolverRule from "../rules/ReferenceResolverRule";
import TemplateLiteralRule from "../rules/TemplateLiteralRule";
import MatchingRule from "../rules/MatchingRule";

class AnalysisService {
  private targetPath: string;

  constructor(targetPath: string) {
    this.targetPath = targetPath;
  }

  public run(matchingRules: MatchingRule[]): { filename: string, matches: { [ruleType: string]: string[] } }[] {
    const files = new FileDatasource().loadFiles(this.targetPath);
    const results: { filename: string, matches: { [ruleType: string]: string[] } }[] = [];
    files.forEach(file => {
      try {
        const ast = acorn.parse(file.fileContent, {
          ecmaVersion: "latest",
          sourceType: "module",
        });

        const engine = new RuleEngine(ast)
          .addRule(new LiteralRule())
          .addRule(new TemplateLiteralRule())
          .addRule(new ReferenceResolverRule());

        const context = engine.process(matchingRules);

        const fileMatches: { [ruleType: string]: string[] } = {};
        matchingRules.forEach(rule => {
          fileMatches[rule.type] = context.getData(rule.type);
        });

        if (Object.values(fileMatches).some(matches => matches.length > 0)) {
          results.push({ filename: file.filePath, matches: fileMatches });
        }

      } catch (error) {
        // Nothing to catch here
      }
    });

    return results;
  }

}

export default AnalysisService;