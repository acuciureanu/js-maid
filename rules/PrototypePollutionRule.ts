import type {
  Node,
  MemberExpression,
  AssignmentExpression,
  CallExpression,
} from "acorn";
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
    if (context === null) {
      throw new Error("Context cannot be null");
    }

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

    const processNode = (node: Node, visitedNodes = new Set()) => {
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
        const childNode = (node as any)[key];
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

  private isMemberExpression = (node: Node): node is MemberExpression =>
    node.type === "MemberExpression";

  private isAssignmentExpression = (node: Node): node is AssignmentExpression =>
    node.type === "AssignmentExpression";

  private isCallExpression = (node: Node): node is CallExpression =>
    node.type === "CallExpression";

  private checkForDangerousPropertyAccess(
    node: Node,
    handleDetection: (message: string, category: string, node: Node) => void
  ) {
    if (this.isMemberExpression(node) && node.computed) {
      if (
        node.property.type === "Literal" &&
        typeof node.property.value === "string"
      ) {
        const dangerousProperties = ["__proto__", "prototype", "constructor"];
        if (dangerousProperties.includes(node.property.value)) {
          handleDetection(
            `Dangerous property access: ${node.property.value}`,
            "Critical Vulnerability",
            node
          );
        }
      }
    }
  }

  private checkForDirectPrototypeAssignments(
    node: Node,
    handleDetection: (message: string, category: string, node: Node) => void
  ) {
    if (this.isAssignmentExpression(node)) {
      if (
        this.isMemberExpression(node.left) &&
        node.left.computed &&
        node.left.property.type === "Literal" &&
        node.left.property.value === "__proto__"
      ) {
        handleDetection(
          "Direct __proto__ assignment detected!",
          "Critical Vulnerability",
          node
        );
      }
      if (
        this.isMemberExpression(node.left) &&
        this.isMemberExpression(node.left.object) &&
        node.left.object.property.type === "Identifier" &&
        node.left.object.property.name === "prototype" &&
        node.left.object.object.type === "Identifier" &&
        node.left.object.object.name === "Object"
      ) {
        handleDetection(
          "Direct Object.prototype modification detected!",
          "Critical Vulnerability",
          node
        );
      }
    }
  }

  private checkForDangerousMethodCalls(
    node: Node,
    handleDetection: (message: string, category: string, node: Node) => void
  ) {
    if (this.isCallExpression(node)) {
      if (
        this.isMemberExpression(node.callee) &&
        node.callee.property.type === "Identifier" &&
        node.callee.property.name === "assign"
      ) {
        handleDetection(
          "Dangerous Object.assign call detected!",
          "Critical Vulnerability",
          node
        );
      }
    }
  }

  private checkForURLParameterGadgets(
    node: Node,
    handleDetection: (message: string, category: string, node: Node) => void
  ) {
    if (this.isCallExpression(node)) {
      if (
        this.isMemberExpression(node.callee) &&
        node.callee.property.type === "Identifier" &&
        node.callee.property.name === "parse"
      ) {
        const arg = node.arguments[0];
        if (arg && arg.type === "Literal" && typeof arg.value === "string") {
          const parsed = JSON.parse(arg.value);
          if (parsed.__proto__) {
            handleDetection(
              "Dangerous JSON.parse call detected!",
              "Critical Vulnerability",
              node
            );
          }
        }
      }
    }
  }

  private recursiveNodeProcessing(
    node: Node,
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
      if ((node as any)[key]) {
        if (Array.isArray((node as any)[key])) {
          (node as any)[key].forEach((child: any) =>
            processNode(child, processNode, visitedNodes)
          );
        } else {
          processNode((node as any)[key], processNode, visitedNodes);
        }
      }
    });
  }
}
