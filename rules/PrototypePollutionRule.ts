import type { Node } from "acorn";
import { ProcessingContext } from "../contexts/ProcessingContext";
import type { Rule } from "../interfaces/Rule";
import escodegen from "escodegen";

/**
 * Rule for detecting and handling prototype pollution vulnerabilities.
 */
export default class PrototypePollutionRule implements Rule {
  /**
   * Applies the rule to a node in the AST and updates the processing context with findings.
   * @param node - The AST node to analyze.
   * @param context - The context for accumulating findings and data.
   * @returns Updated processing context with new findings.
   */
  apply(node: Node, context: ProcessingContext): ProcessingContext {
    const handleDetection = (message: string, category: string, node: Node) => {
      const finding = {
        type: "Prototype Pollution",
        category,
        message,
        node: escodegen.generate(node),
        location: {
          start: node.start,
          end: node.end,
        },
      };
      context.addData("prototypePollutionFindings", finding);
    };

    const processNode = (node: any, visitedNodes = new Set()) => {
      if (!node || typeof node !== "object" || visitedNodes.has(node)) return;
      visitedNodes.add(node);

      this.checkForDangerousPropertyAccess(node, handleDetection);
      this.checkForDirectPrototypeAssignments(node, handleDetection);
      this.checkForDangerousMethodCalls(node, handleDetection);
      this.checkForURLParameterGadgets(node, handleDetection);

      [
        "body",
        "consequent",
        "alternate",
        "expression",
        "declarations",
        "init",
        "test",
        "update",
      ].forEach((key) => {
        const childNode = node[key];
        if (Array.isArray(childNode)) {
          childNode.forEach((subNode) => processNode(subNode, visitedNodes));
        } else if (childNode && typeof childNode === "object") {
          processNode(childNode, visitedNodes);
        }
      });
    };

    processNode(node);
    return context;
  }

  private checkForDangerousPropertyAccess(node: Node, handleDetection: (message: string, category: string, node: Node) => void) {
    if (
      node.type === MemberExpression &&
      node.computed === true &&  // Ensure the property access is computed
      node.property.type === "Literal" && // The property being accessed is a literal
      typeof node.property.value === 'string' && // The literal is a string
      ["__proto__", "prototype", "constructor"].includes(node.property.value) // Dangerous properties
    ) {
      handleDetection(
        `Dangerous property access: ${node.property.value}`,
        "Critical Vulnerability",
        node
      );
    }
  }
  

  private checkForDirectPrototypeAssignments(
    node: any,
    handleDetection: Function
  ) {
    if (
      node.type === "AssignmentExpression" &&
      node.left.type === "MemberExpression" &&
      node.left.object.type === "MemberExpression" &&
      node.left.object.object.type === "Identifier" &&
      node.left.object.object.name === "Object" &&
      node.left.object.property.type === "Identifier" &&
      node.left.object.property.name === "prototype"
    ) {
      handleDetection(
        "Direct Object.prototype modification detected!",
        "Critical Vulnerability",
        node
      );
    }

    if (
      node.type === "AssignmentExpression" &&
      node.left.type === "MemberExpression" &&
      node.left.computed === true &&
      node.left.property.type === "Literal" &&
      node.left.property.value === "__proto__"
    ) {
      handleDetection(
        "Direct __proto__ assignment detected!",
        "Critical Vulnerability",
        node
      );
    }
  }

  private checkForDangerousMethodCalls(node: any, handleDetection: Function) {
    if (
      node.type === "CallExpression" &&
      node.callee.type === "MemberExpression"
    ) {
      const { object, property } = node.callee;
      if (
        object.type === "Identifier" &&
        object.name === "Object" &&
        (property.name === "assign" || property.name === "setPrototypeOf")
      ) {
        handleDetection(
          `Object.${property.name} can manipulate prototypes. Analyze arguments carefully for untrusted input.`,
          "Potential Exploit",
          node
        );
      }
    }
  }

  private checkForURLParameterGadgets(node: any, handleDetection: Function) {
    if (
      node.type === "CallExpression" &&
      node.callee.type === "MemberExpression" &&
      node.callee.property.name === "getParameter" &&
      node.arguments.length > 0 &&
      node.arguments[0].type === "Literal"
    ) {
      handleDetection(
        "Prototype pollution possible if URL parameter is user-controlled.",
        "Potential Exploit",
        node
      );
    }
  }

  private recursiveNodeProcessing(
    node: any,
    processNode: Function,
    visitedNodes = new Set()
  ) {
    if (visitedNodes.has(node)) {
      return;
    }
    visitedNodes.add(node);

    [
      "body",
      "consequent",
      "alternate",
      "expression",
      "declarations",
      "init",
      "test",
      "update",
    ].forEach((key) => {
      if (node[key]) {
        if (Array.isArray(node[key])) {
          node[key].forEach((child: any) =>
            processNode(child, processNode, visitedNodes)
          );
        } else {
          processNode(node[key], processNode, visitedNodes);
        }
      }
    });
  }
}
