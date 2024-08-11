import createGlobalState from '.';
import { purchaseQK } from './QueryKeys';

// * Vendor * //
export const usePurchaseVendor = () =>
	createGlobalState({
		queryKey: purchaseQK.vendors(),
		url: '/purchase/vendor',
	});

export const usePurchaseVendorByUUID = (uuid) =>
	createGlobalState({
		queryKey: purchaseQK.vendor(uuid),
		url: `/purchase/vendor/${uuid}`,
	});
