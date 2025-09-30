export const accQK = {
	all: () => ['accQK'],

	//Cost center
	accReport: (from, to, type) => [
		...accQK.all(),
		from,
		to,
		type,
		'accReport',
	],
	chartOfAccounts: () => [...accQK.all(), 'chartOfAccounts'],
	chartOfAccountsTable: () => [...accQK.all(), 'chartOfAccountsTable'],
};
