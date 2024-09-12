/** @type {import('prettier').Config} */
module.exports = {
	endOfLine: 'lf',
	htmlWhitespaceSensitivity: 'css',
	insertPragma: false,
	singleAttributePerLine: false,
	bracketSameLine: false,
	jsxBracketSameLine: true,
	jsxSingleQuote: true,
	printWidth: 80,
	proseWrap: 'preserve',
	quoteProps: 'as-needed',
	requirePragma: false,
	semi: true,
	singleQuote: true,
	tabWidth: 4,
	trailingComma: 'es5',
	useTabs: true,
	embeddedLanguageFormatting: 'auto',
	vueIndentScriptAndStyle: true,
	tailwindAttributes: ['clsx', 'className', 'cx', 'tw', 'twc', 'cn'],
	tailwindFunctions: ['clsx', 'className', 'cx', 'tw', 'twc', 'cn'],
	importOrder: [
		'^(react/(.*)$)|^(react$)',
		'^(next/(.*)$)|^(next$)',
		'<THIRD_PARTY_MODULES>',
		'',
		'^@/components/ui/(.*)$',
		'^@/ui/(.*)$',
		'',
		'^@/components/(.*)$',
		'',
		'^types$',
		'^@/types/(.*)$',
		'^@/config/(.*)$',
		'^@/lib/(.*)$',
		'^@lib/(.*)$',
		'^@/util/(.*)$',
		'^@/hooks/(.*)$',
		'^@/registry/(.*)$',
		'^@/styles/(.*)$',
		'^@/app/(.*)$',
		'',
		'^[./]',
	],
	importOrderSeparation: false,
	importOrderSortSpecifiers: true,
	importOrderBuiltinModulesToTop: true,
	importOrderParserPlugins: ['typescript', 'jsx', 'decorators-legacy'],
	importOrderMergeDuplicateImports: true,
	importOrderCombineTypeAndValueImports: true,
	plugins: [
		'@ianvs/prettier-plugin-sort-imports',
		'prettier-plugin-tailwindcss',
	],
	arrowParens: 'always',
	bracketSpacing: true,
};
