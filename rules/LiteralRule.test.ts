import type { Identifier, Literal, Node } from "acorn";
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
    const literal: Literal = {
      type: 'Literal', value: 'Check out https://example.com for more info',
      start: 0,
      end: 0
    };
    rule.apply(literal, context, matchingRules);
    expect(context.getData('endpoints')).toContain('https://example.com');
  });

  it('should not add data when the literal does not contain URLs', () => {
    const literal: Literal = {
      type: 'Literal', value: 'Hello, world!',
      start: 0,
      end: 0
    };
    rule.apply(literal, context, matchingRules);
    expect(context.getData('endpoints')).toEqual([]);
  });

  it('should not process non-string literals', () => {
    const literal: Literal = {
      type: 'Literal', value: 42,
      start: 0,
      end: 0
    };
    rule.apply(literal, context, matchingRules);
    expect(context.getData('endpoints')).toEqual([]);
  });

  it('should not process non-literal nodes', () => {
    const identifier: Identifier = {
      type: 'Identifier', name: 'x',
      start: 0,
      end: 0
    };
    rule.apply(identifier, context, matchingRules);
    expect(context.getData('endpoints')).toEqual([]);
  });
});
