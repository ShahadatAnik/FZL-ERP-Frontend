import { useCallback } from 'react';

export function useVoucherNestedEntries({ watch, setValue, setDeleteItem }) {
	// Payment handlers
	const handlePaymentAppend = useCallback(
		(voucherIndex, amount) => {
			const currentPayments =
				watch(`voucher_entry[${voucherIndex}].voucher_entry_payment`) ||
				[];
			setValue(`voucher_entry[${voucherIndex}].voucher_entry_payment`, [
				...currentPayments,
				{
					payment_type: '',
					trx_no: '',
					date: null,
					amount: amount || 0,
				},
			]);
		},
		[setValue, watch]
	);

	const handlePaymentRemove = useCallback(
		(voucherIndex, paymentIndex) => {
			const currentPayments =
				watch(`voucher_entry[${voucherIndex}].voucher_entry_payment`) ||
				[];

			if (currentPayments[paymentIndex].uuid !== undefined) {
				setDeleteItem({
					itemId: currentPayments[paymentIndex].uuid,
					itemName: currentPayments[paymentIndex].trx_no,
				});
				window['voucher_entry_payment_delete'].showModal();
			} else {
				setValue(
					`voucher_entry[${voucherIndex}].voucher_entry_payment`,
					currentPayments.filter((_, i) => i !== paymentIndex)
				);
			}
		},
		[setValue, watch, setDeleteItem]
	);

	// Cost Center handlers
	const handleCostCenterAppend = useCallback(
		(voucherIndex, amount) => {
			const currentCostCenters =
				watch(
					`voucher_entry[${voucherIndex}].voucher_entry_cost_center`
				) || [];
			setValue(
				`voucher_entry[${voucherIndex}].voucher_entry_cost_center`,
				[
					...currentCostCenters,
					{
						cost_center_uuid: '',
						amount: amount || 0,
					},
				]
			);
		},
		[setValue, watch]
	);

	const handleCostCenterRemove = useCallback(
		(voucherIndex, costCenterIndex) => {
			const currentCostCenters =
				watch(
					`voucher_entry[${voucherIndex}].voucher_entry_cost_center`
				) || [];

			if (currentCostCenters[costCenterIndex].uuid !== undefined) {
				setDeleteItem({
					itemId: currentCostCenters[costCenterIndex].uuid,
					itemName:
						currentCostCenters[costCenterIndex].cost_center_name,
				});
				window['cost_center_delete'].showModal();
			} else {
				setValue(
					`voucher_entry[${voucherIndex}].voucher_entry_cost_center`,
					currentCostCenters.filter((_, i) => i !== costCenterIndex)
				);
			}
		},
		[setValue, watch, setDeleteItem]
	);

	return {
		handlePaymentAppend,
		handlePaymentRemove,
		handleCostCenterAppend,
		handleCostCenterRemove,
	};
}
