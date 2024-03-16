/**
 * Represents the result of an analysis.
 */
export interface AnalysisResult {
  /**
   * The filename of the analyzed file.
   */
  filename: string;

  /**
   * The matches found during the analysis.
   * Each rule type is mapped to an array of matching strings.
   */
  matches: {
    [ruleType: string]: string[];
  };
}
  