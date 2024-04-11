import { ProcessingContext } from "../contexts/ProcessingContext";
import { PrototypePollutionRule } from "./PrototypePollutionRule";

describe("PrototypePollutionRule", () => {
  let rule: PrototypePollutionRule;
  let context: ProcessingContext;

  beforeEach(() => {
    rule = new PrototypePollutionRule();
    context = new ProcessingContext();
  });

  it("should add a prototype pollution finding to the processing context when a direct assignment to Object.prototype is found", () => {
    const node = {
      type: "AssignmentExpression",
      left: {
        type: "MemberExpression",
        object: {
          type: "Identifier",
          name: "Object",
        },
        property: {
          type: "Identifier",
          name: "prototype",
        },
      },
    };

    const updatedContext = rule.apply(node, context);

    expect(updatedContext.getData("prototypePollutionFindings")).toEqual([
      {
        type: "Prototype Pollution",
        message:
          "Potential prototype pollution detected through direct assignment to prototype.",
        node: { ...node },
      },
    ]);
  });

  it("should add a prototype pollution finding to the processing context when a direct assignment to a member expression with 'prototype' property is found", () => {
    const node = {
      type: "AssignmentExpression",
      left: {
        type: "MemberExpression",
        object: {
          type: "MemberExpression",
          property: {
            type: "Identifier",
            name: "prototype",
          },
        },
        property: {
          type: "Identifier",
          name: "property",
        },
      },
    };

    const updatedContext = rule.apply(node, context);

    expect(updatedContext.getData("prototypePollutionFindings")).toEqual([
      {
        type: "Prototype Pollution",
        message:
          "Potential prototype pollution detected through direct assignment to prototype.",
        node: { ...node },
      },
    ]);
  });

  it("should add a prototype pollution finding to the processing context when a direct assignment to '__proto__' property is found", () => {
    const node = {
      type: "AssignmentExpression",
      left: {
        type: "MemberExpression",
        object: {
          type: "Identifier",
          name: "object",
        },
        property: {
          type: "Identifier",
          name: "__proto__",
        },
      },
    };

    const updatedContext = rule.apply(node, context);

    expect(updatedContext.getData("prototypePollutionFindings")).toEqual([
      {
        type: "Prototype Pollution",
        message:
          "Potential prototype pollution detected through direct assignment to prototype.",
        node: { ...node },
      },
    ]);
  });

  it("should not add any prototype pollution findings to the processing context when the node does not match the prototype pollution patterns", () => {
    const node = {
      type: "AssignmentExpression",
      left: {
        type: "Identifier",
        name: "variable",
      },
    };

    const updatedContext = rule.apply(node, context);

    expect(updatedContext.getData("prototypePollutionFindings")).toEqual([]);
  });

  it("should add a prototype pollution finding to the processing context when a direct assignment to a nested member expression with 'prototype' property is found", () => {
    const node = {
      type: "AssignmentExpression",
      left: {
        type: "MemberExpression",
        object: {
          type: "MemberExpression",
          object: {
            type: "Identifier",
            name: "Object",
          },
          property: {
            type: "Identifier",
            name: "prototype",
          },
        },
        property: {
          type: "Identifier",
          name: "property",
        },
      },
    };

    const updatedContext = rule.apply(node, context);

    expect(updatedContext.getData("prototypePollutionFindings")).toEqual([
      {
        type: "Prototype Pollution",
        message:
          "Potential prototype pollution detected through direct assignment to prototype.",
        node: { ...node },
      },
    ]);
  });
});
