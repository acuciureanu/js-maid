// Assuming necessary imports
import type { Node } from "acorn";
import { ProcessingContext } from "../contexts/ProcessingContext";
import ReferenceResolverRule from "./ReferenceResolverRule";

interface IdentifierNode {
  type: "Identifier";
  name: string;
}

interface LiteralNode {
  type: "Literal";
  value: string | number | boolean | null;
}

interface VariableDeclarator {
  id: IdentifierNode;
  init: LiteralNode | null;
}

interface VariableDeclarationNode extends Node {
  type: "VariableDeclaration";
  declarations: VariableDeclarator[];
  kind: "var" | "let" | "const";
}

describe("ReferenceResolverRule", () => {
  let rule: ReferenceResolverRule;
  let context: ProcessingContext;

  beforeEach(() => {
    rule = new ReferenceResolverRule();
    context = new ProcessingContext();
  });

  function createVariableDeclarationNode(): VariableDeclarationNode {
    return {
      type: "VariableDeclaration",
      declarations: [
        {
          id: { type: "Identifier", name: "variable1" },
          init: { type: "Literal", value: "Hello World" },
        },
        {
          id: { type: "Identifier", name: "variable2" },
          init: { type: "Literal", value: 123 },
        },
        {
          id: { type: "Identifier", name: "variable3" },
          init: null,
        },
      ],
      kind: "let",
      start: 0,
      end: 0,
    };
  }

  it("should handle multiple variable declarations correctly", () => {
    const node = createVariableDeclarationNode();
    const updatedContext = rule.apply(node, context);
    expect(updatedContext.references).toEqual({
      variable1: "Hello World",
      variable2: 123,
    });
  });

  it("should not modify references if context is invalid", () => {
    const node = createVariableDeclarationNode();
    const updatedContext = rule.apply(node, context);
    expect(updatedContext.references).toEqual({
      variable1: "Hello World",
      variable2: 123,
    });
  });

  it("should throw an error if context is null", () => {
    const node = createVariableDeclarationNode();
    expect(() => rule.apply(node, null as any)).toThrow(
      "Context cannot be null"
    );
  });
});
