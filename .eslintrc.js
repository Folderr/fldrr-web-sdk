module.exports = {
	extends: ["xo", "xo-typescript", "plugin:prettier/recommended"],
	parser: "@typescript-eslint/parser",
	parserOptions: {
		project: ["./tsconfig.json", ".eslintrc.js"],
	},
	plugins: ["optimize-regex", "unicorn", "import"],
	rules: {
		indent: "off",
		"@typescript-eslint/indent": "off",
		"max-len": [
			"error",
			{
				code: 100,
				comments: 100,
				ignoreUrls: true,
			},
		],
		"no-underscore-dangle": "error",
		"unicorn/prefer-node-protocol": "off",
		"import/extensions": "off",
		"prettier/prettier": [
			"error",
			{},
			{
				useTabs: true,
				tabWidth: 4,
			},
		],
	},
};
