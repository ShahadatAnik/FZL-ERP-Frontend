import { useEffect } from 'react';

import { useOtherAccLedger } from '../../../CostCenter/config/query';
import { useOtherCurrency } from '../../../Currency/config/query';
import { useVoucher, useVoucherByUUID } from '../../config/query';

export function useVoucherData(uuid) {
	const { url: voucherURL, deleteData } = useVoucher();
	const {
		data: voucherData,
		postData,
		invalidateQuery: invalidateVoucher,
		isLoading: isVoucherLoading,
	} = useVoucherByUUID(uuid);

	const { data: ledgerOptions = [], invalidateQuery: invalidateLedger } =
		useOtherAccLedger();
	const { data: currencyOptions, isLoading: isCurrencyLoading } =
		useOtherCurrency();

	// Set document title
	useEffect(() => {
		if (uuid !== undefined) {
			document.title = 'Update Voucher: ' + uuid;
		} else {
			document.title = 'New Voucher Entry';
		}
	}, [uuid]);

	return {
		voucherURL,
		deleteData,
		voucherData,
		postData,
		invalidateVoucher,
		isVoucherLoading,
		ledgerOptions,
		currencyOptions,
		isCurrencyLoading,
		invalidateLedger,
		isUpdate: uuid !== undefined,
	};
}
