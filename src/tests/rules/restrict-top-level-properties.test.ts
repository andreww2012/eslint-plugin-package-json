import { rule } from "../../rules/restrict-top-level-properties.ts";
import { ruleTester } from "./ruleTester.ts";

ruleTester.run("restrict-top-level-properties", rule, {
	invalid: [
		{
			code: `{
				"name": "my-package",
				"version": "1.0.0",
				"prettier": { "semi": false }
			}`,
			errors: [
				{
					data: { property: "prettier" },
					messageId: "restrictedProperty",
				},
			],
			options: [{ ban: ["prettier"] }],
		},
		{
			code: `{
				"name": "my-package",
				"version": "1.0.0",
				"lint-staged": {}
			}`,
			errors: [
				{
					data: { property: "lint-staged" },
					messageId: "restrictedProperty",
				},
			],
			options: [{ ban: [{ property: "lint-staged" }] }],
		},
		{
			code: `{
				"name": "my-package",
				"version": "1.0.0",
				"pnpm": { "overrides": {} }
			}`,
			errors: [
				{
					data: {
						message:
							"Use pnpm-workspace.yaml for pnpm configuration instead.",
						property: "pnpm",
					},
					messageId: "restrictedPropertyWithMessage",
				},
			],
			options: [
				{
					ban: [
						{
							message:
								"Use pnpm-workspace.yaml for pnpm configuration instead.",
							property: "pnpm",
						},
					],
				},
			],
		},
		{
			code: `{
				"name": "my-package",
				"version": "1.0.0",
				"prettier": {},
				"babel": {}
			}`,
			errors: [
				{
					data: { property: "prettier" },
					messageId: "restrictedProperty",
				},
				{
					data: { property: "babel" },
					messageId: "restrictedProperty",
				},
			],
			options: [{ ban: ["prettier", "babel"] }],
		},
		{
			code: `{
				"name": "my-package",
				"prettier": {}
			}`,
			errors: [
				{
					data: {
						message: "Use .prettierrc instead.",
						property: "prettier",
					},
					messageId: "restrictedPropertyWithMessage",
				},
			],
			options: [
				{
					ban: [
						"prettier",
						{
							message: "Use .prettierrc instead.",
							property: "prettier",
						},
					],
				},
			],
		},
		{
			code: `{
				"name": "my-package",
				"prettier": {}
			}`,
			errors: [
				{
					data: { property: "prettier" },
					messageId: "restrictedProperty",
				},
			],
			options: [
				{
					ban: [
						{
							message: "Use .prettierrc instead.",
							property: "prettier",
						},
						"prettier",
					],
				},
			],
		},
		{
			code: `{ "name": "my-package" }`,
			errors: [
				{
					data: { property: "name" },
					messageId: "restrictedProperty",
				},
			],
			options: [{ ban: ["name"] }],
		},
	],
	valid: [
		{
			code: `{
				"name": "my-package",
				"version": "1.0.0",
				"prettier": {}
			}`,
			options: [],
		},
		{
			code: `{
				"name": "my-package",
				"version": "1.0.0",
				"prettier": {}
			}`,
			options: [{ ban: ["babel"] }],
		},
		{
			code: `{
				"name": "my-package",
				"version": "1.0.0",
				"prettier": {}
			}`,
			options: [{ ban: [] }],
		},
		{
			code: `{
				"name": "my-package",
				"version": "1.0.0"
			}`,
			options: [{ ban: ["prettier"] }],
		},
	],
});
