import PrototypePollutionRule from "./PrototypePollutionRule";
import { ProcessingContext } from "../contexts/ProcessingContext";
import * as acorn from "acorn";

describe("PrototypePollutionRule - Prototype Pollution Vulnerabilities", () => {
  let rule: PrototypePollutionRule;
  let context: ProcessingContext;
  let mockAddData: jest.Mock<any, any, any>;

  beforeEach(() => {
    rule = new PrototypePollutionRule();
    context = new ProcessingContext();
    mockAddData = jest.fn();
    context.addData = mockAddData;

    // Mock console.error to check error handling
    global.console.error = jest.fn();
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  function parseCodeToAST(code: string) {
    return acorn.parse(code, {
      ecmaVersion: 2020,
      sourceType: "script",
    });
  }

  const testCases = [
    {
      name: "Direct __proto__ assignment",
      code: `var obj = {}; obj["__proto__"] = { polluted: 'Yes' };`,
      expectedDetection: true,
    },
    {
      name: "Object.prototype manipulation",
      code: `Object.prototype.polluted = 'Yes';`,
      expectedDetection: true,
    },
    {
      name: "Dangerous Object.assign",
      code: `var target = {}; var malicious = JSON.parse('{ "__proto__": { "polluted": "Yes" } }'); Object.assign(target, malicious);`,
      expectedDetection: true,
    },
    {
      name: "Non-vulnerable code",
      code: `var obj = {}; obj.safe = 'Yes';`,
      expectedDetection: false,
    },
  ];

  testCases.forEach(({ name, code, expectedDetection }) => {
    test(name, () => {
      const ast = parseCodeToAST(code);
      console.log(JSON.stringify(ast, null, 2));
      rule.apply(ast, context);

      if (expectedDetection) {
        expect(mockAddData).toHaveBeenCalled();
      } else {
        expect(mockAddData).not.toHaveBeenCalled();
      }
    });
  });
});
