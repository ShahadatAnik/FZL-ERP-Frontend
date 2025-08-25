import { useCallback } from 'react';
import { useAuth } from '@/context/auth';
import { useNavigate } from 'react-router';

import { ShowLocalToast } from '@/components/Toast';

import nanoid from '@/lib/nanoid';
import GetDateTime from '@/util/GetDateTime';

import { useVoucher } from '../../config/query';

export const useVoucherSubmission = ({
	isUpdate,
	uuid,
	reset,
	VOUCHER_NULLABLE,
	voucherURL,
	setError,
}) => {
	const { postData, updateData } = useVoucher();
	const { user } = useAuth();
	const navigate = useNavigate();

	// Helper: create or update cost centers for an existing entry
	async function handleCostCentersForExistingEntry(costCenters, entryUuid) {
		if (!costCenters?.length) return;

		const newCCs = costCenters.filter((cc) => !cc?.uuid);
		const existingCCs = costCenters.filter((cc) => cc?.uuid);

		// Create new cost centers with correct index
		for (let i = 0; i < newCCs.length; i++) {
			const cc = newCCs[i];
			await postData.mutateAsync({
				url: `/acc/voucher-entry-cost-center`,
				newData: {
					...cc,
					index: costCenters.findIndex((item) => item === cc),
					voucher_entry_uuid: entryUuid,
					created_by: user.uuid,
					created_at: GetDateTime(),
					uuid: nanoid(),
				},
				isOnCloseNeeded: false,
			});
		}

		// Update existing cost centers with correct index
		for (let i = 0; i < existingCCs.length; i++) {
			const cc = existingCCs[i];
			await updateData.mutateAsync({
				url: `/acc/voucher-entry-cost-center/${cc?.uuid}`,
				updatedData: {
					...cc,
					index: costCenters.findIndex((item) => item === cc),
					updated_by: user?.uuid,
					updated_at: GetDateTime(),
				},
				isOnCloseNeeded: false,
			});
		}
	}

	// Helper: create or update payments for an existing entry
	async function handlePaymentsForExistingEntry(payments, entryUuid) {
		if (!payments?.length) return;

		const newPs = payments.filter((p) => !p?.uuid);
		const existingPs = payments.filter((p) => p?.uuid);

		// Create new payments
		for (let i = 0; i < newPs.length; i++) {
			const p = newPs[i];
			await postData.mutateAsync({
				url: `/acc/voucher-entry-payment`,
				newData: {
					...p,
					index: payments.findIndex((item) => item === p),
					voucher_entry_uuid: entryUuid,
					created_by: user.uuid,
					created_at: GetDateTime(),
					uuid: nanoid(),
				},
				isOnCloseNeeded: false,
			});
		}

		// Update existing payments
		for (let i = 0; i < existingPs.length; i++) {
			const p = existingPs[i];
			await updateData.mutateAsync({
				url: `/acc/voucher-entry-payment/${p?.uuid}`,
				updatedData: {
					...p,
					index: payments.findIndex((item) => item === p),
					updated_by: user?.uuid,
					updated_at: GetDateTime(),
				},
				isOnCloseNeeded: false,
			});
		}
	}

	// Helper: create brand-new entries (and nested cost centers/payments)
	async function createNewEntries(entries) {
		for (let entryIndex = 0; entryIndex < entries.length; entryIndex++) {
			const entry = entries[entryIndex];
			const {
				voucher_entry_cost_center: costCenters = [],
				voucher_entry_payment: payments = [],
				...entryData
			} = entry;

			// Create the entry itself
			await postData.mutateAsync({
				url: `/acc/voucher-entry`,
				newData: {
					...entryData,
					index: entryData?.index ?? entryIndex,
					created_by: user?.uuid,
					created_at: GetDateTime(),
				},
				isOnCloseNeeded: false,
			});

			// Create nested cost centers
			for (let ccIndex = 0; ccIndex < costCenters.length; ccIndex++) {
				const cc = costCenters[ccIndex];
				await postData.mutateAsync({
					url: `/acc/voucher-entry-cost-center`,
					newData: {
						...cc,
						index: ccIndex,
						uuid: nanoid(),
						voucher_entry_uuid: entry.uuid,
						created_by: user?.uuid,
						created_at: GetDateTime(),
					},
					isOnCloseNeeded: false,
				});
			}

			// Create nested payments
			for (let pIndex = 0; pIndex < payments.length; pIndex++) {
				const p = payments[pIndex];
				await postData.mutateAsync({
					url: `/acc/voucher-entry-payment`,
					newData: {
						...p,
						index: pIndex,
						voucher_entry_uuid: entry.uuid,
						created_by: user?.uuid,
						created_at: GetDateTime(),
						uuid: nanoid(),
					},
					isOnCloseNeeded: false,
				});
			}
		}
	}

	// Helper: update existing voucher and its entries
	async function handleUpdate(data) {
		// 1) Update voucher record
		const voucherData = { ...data };
		delete voucherData.voucher_entry;
		await updateData.mutateAsync({
			url: `${voucherURL}/${data?.uuid}`,
			updatedData: {
				...voucherData,
				updated_by: user?.uuid,
				updated_at: GetDateTime(),
			},
			uuid: data?.uuid,
			isOnCloseNeeded: false,
		});

		// 2) Split entries into existing vs new
		const allEntries = data.voucher_entry || [];
		const existingEntries = allEntries.filter((e) => e?.uuid);
		const newEntries = allEntries
			.filter((e) => !e?.uuid)
			.map((item) => {
				const entryUuid = nanoid();
				return {
					...item,
					index: allEntries.findIndex((entry) => entry === item),
					uuid: entryUuid,
					voucher_uuid: data?.uuid,
					voucher_entry_cost_center: (
						item.voucher_entry_cost_center || []
					).map((cc) => ({
						...cc,
						uuid: nanoid(),
						voucher_entry_uuid: entryUuid,
					})),
					voucher_entry_payment: (
						item.voucher_entry_payment || []
					).map((p) => ({
						...p,
						uuid: nanoid(),
						voucher_entry_uuid: entryUuid,
					})),
				};
			});

		// 3) Process existing entries
		for (let i = 0; i < existingEntries.length; i++) {
			const entry = existingEntries[i];
			const costCenters = entry.voucher_entry_cost_center || [];
			const payments = entry.voucher_entry_payment || [];

			// Update the entry itself
			await updateData.mutateAsync({
				url: `/acc/voucher-entry/${entry?.uuid}`,
				updatedData: {
					...entry,
					index: allEntries.findIndex((e) => e?.uuid === entry?.uuid),
					voucher_uuid: data?.uuid,
					updated_by: user?.uuid,
					updated_at: GetDateTime(),
				},
				isOnCloseNeeded: false,
			});

			// Update nested cost centers & payments
			await handleCostCentersForExistingEntry(costCenters, entry?.uuid);
			await handlePaymentsForExistingEntry(payments, entry?.uuid);
		}

		// 4) Create any new entries
		await createNewEntries(newEntries);

		// 5) Reset form and navigate
		reset(VOUCHER_NULLABLE);
		if (uuid) navigate(`/accounting/voucher/${uuid}/details`);
	}

	// Helper: create a brand-new voucher + nested entries
	async function handleCreate(data) {
		const voucherUuid = nanoid();
		const voucherData = { ...data, uuid: voucherUuid };
		delete voucherData.voucher_entry;

		// Create voucher
		await postData.mutateAsync({
			url: voucherURL,
			newData: {
				...voucherData,
				created_by: user?.uuid,
				created_at: GetDateTime(),
			},
			isOnCloseNeeded: false,
		});

		// Create voucher entries
		const entries = data.voucher_entry || [];
		const enriched = entries.map((entry, idx) => ({
			...entry,
			index: idx,
			voucher_uuid: voucherUuid,
			uuid: nanoid(),
		}));
		await createNewEntries(enriched);

		// Reset form and navigate
		reset(VOUCHER_NULLABLE);
		navigate(`/accounting/voucher/${voucherUuid}/details`);
	}

	// Main hook return
	return useCallback(
		async function submitVoucher(data) {
			// Validate debit/credit totals
			const totals = data.voucher_entry.reduce(
				(acc, e) => {
					const amt = parseFloat(e.amount) || 0;
					if (e.type === 'dr') acc.debit += amt;
					else acc.credit += amt;
					return acc;
				},
				{ debit: 0, credit: 0 }
			);

			if (totals.debit !== totals.credit) {
				ShowLocalToast({
					type: 'error',
					message: 'Debit and Credit must be equal',
				});
				return;
			}

			if (totals.debit === 0) {
				ShowLocalToast({
					type: 'error',
					message: 'Amounts must be greater than zero',
				});
				return;
			}

			// Validate nested cost centers/payments sums
			let hasError = false;
			data.voucher_entry.forEach((entry, i) => {
				const sumCC = (entry.voucher_entry_cost_center || []).reduce(
					(s, cc) => s + Number(cc.amount || 0),
					0
				);
				const sumP = (entry.voucher_entry_payment || []).reduce(
					(s, p) => s + Number(p.amount || 0),
					0
				);

				if (
					entry.type === 'dr' &&
					entry.voucher_entry_cost_center.length &&
					sumCC !== Number(entry.amount)
				) {
					setError(`voucher_entry.${i}.amount`, {
						type: 'validation',
						message: `Entry ${i} debit ${entry.amount} ≠ total cost centers ${sumCC}.`,
					});
					hasError = true;
				}

				if (
					entry.type === 'cr' &&
					entry.voucher_entry_payment.length &&
					sumP !== Number(entry.amount)
				) {
					setError(`voucher_entry.${i}.amount`, {
						type: 'validation',
						message: `Entry ${i} credit ${entry.amount} ≠ total payments ${sumP}.`,
					});
					hasError = true;
				}
			});

			if (hasError) return;

			// Execute create or update flow
			// try {
			if (isUpdate) {
				await handleUpdate(data);
			} else {
				await handleCreate(data);
			}
			// } catch (err) {
			// 	console.error(`Voucher submission error: ${err}`);
			// 	ShowLocalToast({
			// 		type: 'error',
			// 		message: 'An error occurred while processing the voucher',
			// 	});
			// }
		},
		[isUpdate, uuid, reset, VOUCHER_NULLABLE, voucherURL, setError]
	);
};
