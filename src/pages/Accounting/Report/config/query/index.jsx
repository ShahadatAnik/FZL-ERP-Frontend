import createGlobalState from '@/state';

import { accQK } from './QueryKeys';

//* Accounting cost center
export const useAccReport = (from, to, type) =>
	createGlobalState({
		queryKey: accQK.accReport(from, to, type),
		url: `/report/acc-balance-report?from=${from}&to=${to}&type=${type}`,
		enabled: !!from && !!to,
	});
//* Charts of Accounts
export const useChartOfAccounts = () =>
	createGlobalState({
		queryKey: accQK.chartOfAccounts(),
		url: '/report/chart-of-accounts',
		enabled: true,
	});
//* Charts of Accounts Table View
export const useChartOfAccountsTable = () =>
	createGlobalState({
		queryKey: accQK.chartOfAccountsTable(),
		url: '/report/chart-of-accounts-table-view',
		enabled: true,
	});
