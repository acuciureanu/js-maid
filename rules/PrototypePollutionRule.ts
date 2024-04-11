import { ProcessingContext } from "../contexts/ProcessingContext";
import type { Rule } from "../interfaces/Rule";

/**
 * Represents a rule for detecting and handling prototype pollution.
 */
export class PrototypePollutionRule implements Rule {
    /**
     * Applies the prototype pollution rule to the given node and processing context.
     * @param node - The node to apply the rule to.
     * @param context - The processing context.
     * @returns The updated processing context.
     */
    apply(node: any, context: ProcessingContext): ProcessingContext {
        if (node.type === "AssignmentExpression" && node.left.type === "MemberExpression") {
            const { object, property } = node.left;

            const isObjectPrototype = object.type === "Identifier" && object.name === "Object" && property.name === "prototype";
            const isPrototypeProperty = object.type === "MemberExpression" && object.property.name === "prototype";
            const isProtoProperty = property.type === "Identifier" && property.name === "__proto__";

            const isPrototypePollution = isObjectPrototype || isPrototypeProperty || isProtoProperty;

            if (isPrototypePollution) {
                const finding = {
                    type: "Prototype Pollution",
                    message: "Potential prototype pollution detected through direct assignment to prototype.",
                    node: { ...node }
                };
                context.addData("prototypePollutionFindings", finding);
            }
        }

        return context;
    }
}
