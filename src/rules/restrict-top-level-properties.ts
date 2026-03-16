import type { AST as JsonAST } from "jsonc-eslint-parser";

import { createRule } from "../createRule.ts";
import { isJSONStringLiteral } from "../utils/predicates.ts";

export const rule = createRule({
	create(context) {
		const banOption = context.options[0]?.ban ?? [];

		const bannedProperties = new Map<string, string | undefined>();
		for (const entry of banOption) {
			if (typeof entry === "string") {
				bannedProperties.set(entry, undefined);
			} else {
				bannedProperties.set(entry.property, entry.message);
			}
		}

		return {
			"Program > JSONExpressionStatement > JSONObjectExpression"(
				node: JsonAST.JSONObjectExpression,
			) {
				for (const property of node.properties) {
					if (!isJSONStringLiteral(property.key)) {
						continue;
					}

					const propertyName = property.key.value;

					if (!bannedProperties.has(propertyName)) {
						continue;
					}

					const customMessage = bannedProperties.get(propertyName);

					if (customMessage === undefined) {
						context.report({
							data: {
								property: propertyName,
							},
							messageId: "restrictedProperty",
							node: property,
						});
					} else {
						context.report({
							data: {
								message: customMessage,
								property: propertyName,
							},
							messageId: "restrictedPropertyWithMessage",
							node: property,
						});
					}
				}
			},
		};
	},
	meta: {
		defaultOptions: [{ ban: [] }],
		docs: {
			category: "Best Practices",
			description:
				"Restricts the use of specified top-level properties in package.json.",
			recommended: false,
		},
		messages: {
			restrictedProperty:
				"The '{{ property }}' property is restricted in package.json.",
			restrictedPropertyWithMessage:
				"The '{{ property }}' property is restricted in package.json. {{ message }}",
		},
		schema: [
			{
				additionalProperties: false,
				properties: {
					ban: {
						description:
							"List of top-level properties to ban, with an optional custom message.",
						items: {
							oneOf: [
								{
									type: "string",
								},
								{
									additionalProperties: false,
									properties: {
										message: {
											description:
												"Custom message to display when the property is used.",
											type: "string",
										},
										property: {
											description:
												"The name of the top-level property to ban.",
											type: "string",
										},
									},
									required: ["property"],
									type: "object",
								},
							],
						},
						type: "array",
					},
				},
				type: "object",
			},
		],
		type: "suggestion",
	},
	name: "restrict-top-level-properties",
});
