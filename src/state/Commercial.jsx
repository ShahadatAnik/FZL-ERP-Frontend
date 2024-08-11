import createGlobalState from '.';
import { commercialQK } from './QueryKeys';

// * Buyer * //
export const useCommercialBank = () =>
	createGlobalState({
		queryKey: commercialQK.banks(),
		url: '/commercial/bank',
	});

export const useCommercialBankByUUID = (uuid) =>
	createGlobalState({
		queryKey: commercialQK.bank(uuid),
		url: `/commercial/bank/${uuid}`,
	});
