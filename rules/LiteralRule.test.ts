import { ProcessingContext } from "../contexts/ProcessingContext";
import { secretsPatterns } from "../patterns/SecretsPatterns";
import { urlPattern } from "../patterns/UrlPatterns";
import LiteralRule from "./LiteralRule";
import MatchingRule from "./MatchingRule";

describe('LiteralRule', () => {
  let rule: LiteralRule;
  let context: ProcessingContext;
  let matchingRules: MatchingRule[];

  beforeEach(() => {
    rule = new LiteralRule();
    context = new ProcessingContext();
    // Initialize the matching rules you want to use in the tests
    matchingRules = [
      new MatchingRule('endpoints', urlPattern),
      new MatchingRule('secrets', secretsPatterns),
    ];
  });

  it('should add URLs from string literals to the context', () => {
    const node = { type: 'Literal', value: 'Check out https://example.com for more info' };
    rule.apply(node, context, matchingRules);
    expect(context.getData('endpoints')).toContain('https://example.com');
  });

  it('should not add data when the literal does not contain URLs', () => {
    const node = { type: 'Literal', value: 'Hello, world!' };
    rule.apply(node, context, matchingRules);
    expect(context.getData('endpoints')).toEqual([]);
  });

  it('should not process non-string literals', () => {
    const node = { type: 'Literal', value: 42 };
    rule.apply(node, context, matchingRules);
    expect(context.getData('endpoints')).toEqual([]);
  });

  it('should not process non-literal nodes', () => {
    const node = { type: 'Identifier', name: 'x' };
    rule.apply(node, context, matchingRules);
    expect(context.getData('endpoints')).toEqual([]);
  });
});
