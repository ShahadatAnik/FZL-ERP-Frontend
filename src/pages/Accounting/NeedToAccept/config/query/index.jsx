import createGlobalState from '@/state';

import { accQK } from './QueryKeys';

//* Accounting Ledger
export const useAccNeedToAccept = () =>
	createGlobalState({
		queryKey: accQK.needToAccept(),
		url: '/purchase/purchase-with-entry-price',
	});
