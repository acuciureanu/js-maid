import { ProcessingContext } from "../contexts/ProcessingContext";
import { urlPattern } from "../patterns/UrlPatterns";
import MatchingRule from "./MatchingRule";
import TemplateLiteralRule from "./TemplateLiteralRule";

describe("TemplateLiteralRule", () => {
  let rule: TemplateLiteralRule;
  let context: ProcessingContext;
  let matchingRules: MatchingRule[];

  beforeEach(() => {
    rule = new TemplateLiteralRule();
    context = new ProcessingContext();

    matchingRules = [new MatchingRule("endpoints", urlPattern)];
  });

  it("should correctly process template literals with expressions", () => {
    const node = {
      type: "TemplateLiteral",
      quasis: [
        { value: { cooked: "User ID: " } },
        { value: { cooked: ", User Name: " } },
        { value: { cooked: "" } },
      ],
      expressions: [{ name: "userId" }, { name: "userName" }],
      start: 0,
      end: 0,
    };

    // Mocking context.references
    context.addData("references", {
      userId: "123",
      userName: "JohnDoe",
    });

    rule.apply(node, context, matchingRules);
    expect(context.getData("endpoints")).toEqual([]);
  });

  it("should detect URLs in template literals and add them to context", () => {
    const node = {
      type: "TemplateLiteral",
      quasis: [
        { value: { cooked: "Visit " } },
        { value: { cooked: " for more info." } },
      ],
      expressions: [{ name: "url" }],
      start: 0,
      end: 0,
    };

    // Mocking context.references
    context.addData("endpoints", "http://example.com");

    rule.apply(node, context, matchingRules);
    expect(context.getData("endpoints")).toContain("http://example.com");
  });
});
