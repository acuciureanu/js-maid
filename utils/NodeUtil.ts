import type {
  Literal,
  AssignmentExpression,
  CallExpression,
  MemberExpression,
  Node,
  VariableDeclaration,
} from "acorn";

export const isMemberExpression = (node: Node): node is MemberExpression =>
  node.type === "MemberExpression";

export const isAssignmentExpression = (
  node: Node
): node is AssignmentExpression => node.type === "AssignmentExpression";

export const isCallExpression = (node: Node): node is CallExpression =>
  node.type === "CallExpression";

export const isLiteral = (node: Node): node is Literal =>
  node.type === "Literal";

export const isVariableDeclaration = (
  node: Node
): node is VariableDeclaration => node.type === "VariableDeclaration";
