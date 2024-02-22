import { ProcessingContext } from "../contexts/ProcessingContext";
import ReferenceResolverRule from "./ReferenceResolverRule";

describe("ReferenceResolverRule", () => {
  let rule: ReferenceResolverRule;
  let context: ProcessingContext;

  beforeEach(() => {
    rule = new ReferenceResolverRule();
    context = new ProcessingContext();
  });

  it("should add variable names and their values to the references in the processing context when a variable declaration with an identifier and literal initialization value is found", () => {
    // Arrange
    const node = {
      type: "VariableDeclaration",
      declarations: [
        {
          id: {
            type: "Identifier",
            name: "variable1",
          },
          init: {
            type: "Literal",
            value: "value1",
          },
        },
        {
          id: {
            type: "Identifier",
            name: "variable2",
          },
          init: {
            type: "Literal",
            value: "value2",
          },
        },
      ],
    };

    // Act
    const updatedContext = rule.apply(node, context, []);

    // Assert
    expect(updatedContext.references).toEqual({
      variable1: "value1",
      variable2: "value2",
    });
  });

  it("should not add any references to the processing context when a variable declaration does not have an identifier or literal initialization value", () => {
    // Arrange
    const node = {
      type: "VariableDeclaration",
      declarations: [
        {
          id: {
            type: "Identifier",
            name: "variable1",
          },
          init: null,
        },
        {
          id: {
            type: "Literal",
            value: "variable2",
          },
          init: {
            type: "Identifier",
            name: "value2",
          },
        },
      ],
    };

    // Act
    const updatedContext = rule.apply(node, context, []);

    // Assert
    expect(updatedContext.references).toEqual({});
  });

  it("should not add any references to the processing context when the node type is not 'VariableDeclaration'", () => {
    // Arrange
    const node = {
      type: "Identifier",
      name: "variable",
    };

    // Act
    const updatedContext = rule.apply(node, context, []);

    // Assert
    expect(updatedContext.references).toEqual({});
  });
});
