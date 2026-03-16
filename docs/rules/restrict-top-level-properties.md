# restrict-top-level-properties

<!-- end auto-generated rule header -->

This rule restricts the use of specified top-level properties in `package.json`.

`package.json` allows arbitrary top-level properties which are often used by tools such as `prettier`, `lint-staged`, or `pnpm`.
Some teams prefer to keep `package.json` minimal and use dedicated configuration files for each tool, while others prefer consolidating settings.
This rule allows you to enforce whichever approach your team prefers by banning specific properties.

## Rule Details

Use the `ban` option to specify which top-level properties are not allowed.
Each entry can be a plain string or an object with a `property` name and an optional `message` for a more descriptive error.

Examples of **incorrect** code for this rule:

```json
// options: [{ "ban": ["prettier"] }]
{
	"name": "my-package",
	"version": "1.0.0",
	"prettier": {
		"semi": false
	}
}
```

```json
// options: [{ "ban": [{ "property": "pnpm", "message": "Use pnpm-workspace.yaml instead." }] }]
{
	"name": "my-package",
	"version": "1.0.0",
	"pnpm": {
		"overrides": {}
	}
}
```

Examples of **correct** code for this rule:

```json
// options: [{ "ban": ["prettier"] }]
{
	"name": "my-package",
	"version": "1.0.0"
}
```

## Options

<!-- begin auto-generated rule options list -->

| Name  | Description                                                           | Type                   |
| :---- | :-------------------------------------------------------------------- | :--------------------- |
| `ban` | List of top-level properties to ban, with an optional custom message. | (string \| BanEntry)[] |

<!-- end auto-generated rule options list -->

Where `BanEntry` is:

```ts
type BanEntry = {
	property: string;
	message?: string;
};
```

### `ban`

An array of top-level property names to disallow.
Each entry can be a plain string or an object with a required `property` field and an optional `message` field.

If the same property appears more than once in the `ban` array, the **last declaration takes precedence** (including its custom message, if any).
This allows you to define a base set of banned properties and then override specific entries with custom messages.

#### String form

```ts
export default [
	{
		"package-json/restrict-top-level-properties": [
			"error",
			{
				ban: ["prettier", "babel", "lint-staged"],
			},
		],
	},
];
```

#### Object form (with optional custom message)

```ts
export default [
	{
		"package-json/restrict-top-level-properties": [
			"error",
			{
				ban: [
					{
						property: "pnpm",
						message:
							"Use pnpm-workspace.yaml for pnpm configuration instead.",
					},
					{
						property: "prettier",
						message: "Use a .prettierrc file instead.",
					},
				],
			},
		],
	},
];
```

#### Mixed form

```ts
export default [
	{
		"package-json/restrict-top-level-properties": [
			"error",
			{
				ban: [
					"babel",
					{
						property: "prettier",
						message: "Use a .prettierrc file instead.",
					},
				],
			},
		],
	},
];
```
