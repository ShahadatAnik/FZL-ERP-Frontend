import React, { useEffect, useMemo, useState } from 'react';
import { Plus } from 'lucide-react';
import { useWatch } from 'react-hook-form';

import { DateInput } from '@/ui/Core';
import { FormField, Input, ReactSelect, RemoveButton } from '@/ui';

import { useOtherCostCenter } from '../../config/query';
import { paymentTypeOption, typeOptions } from '../../utils';
import CostCenter from './CostCenter';

function VoucherEntryRow({
	control,
	register,
	errors,
	Controller,
	watch,
	currencyOptions,
	setValue,
	ledgerOptions,
	voucherFields,
	appendDrEntry,
	appendCrEntry,
	handleVoucherRemove,
	handleTypeChange,
	handlePaymentAppend,
	handlePaymentRemove,
	handleCostCenterAppend,
	handleCostCenterRemove,
	invalidateLedger,
	setUpdateItem,
	children,
}) {
	// Force re-render state
	const [renderKey, setRenderKey] = useState(0);

	// Watch all form data
	const allFormData = watch();
	const voucherEntries = useWatch({
		control,
		name: 'voucher_entry',
		defaultValue: [],
	});
	const category = watch('category');

	// Force re-render when data changes
	useEffect(() => {
		setRenderKey((prev) => prev + 1);
	}, [
		voucherEntries.length,
		JSON.stringify(
			voucherEntries.map((entry) => ({
				type: entry?.type,
				ledger: entry?.ledger_uuid,
				paymentCount: entry?.voucher_entry_payment?.length || 0,
				costCenterCount: entry?.voucher_entry_cost_center?.length || 0,
			}))
		),
	]);
	const [index, setIndex] = useState(0);

	const { invalidateQuery: invalidQueryCostCenter } = useOtherCostCenter(
		`ledger_uuid=${watch(`voucher_entry.${index}.ledger_uuid`)}`
	);
	const selectedLedgers =
		watch('voucher_entry')?.map((e) => e?.ledger_uuid) || [];
	const filteredLedgerOptions = React.useMemo(() => {
		return ledgerOptions?.filter(
			(opt) =>
				!selectedLedgers.includes(opt.value) ||
				opt.value === selectedLedgers
		);
	}, [ledgerOptions, selectedLedgers, selectedLedgers]);
	const allRows = useMemo(() => {
		const rows = [];

		voucherFields.forEach((fieldEntry, idx) => {
			const voucherEntry = voucherEntries[idx];
			if (!voucherEntry) return;

			const type = voucherEntry.type;
			const payments = voucherEntry.voucher_entry_payment || [];
			const costCenters = voucherEntry.voucher_entry_cost_center || [];
			const ledgerUuid = voucherEntry.ledger_uuid;
			const selectedLedger = ledgerOptions.find(
				(l) => l.value === ledgerUuid
			);

			// Calculate sub-rows
			let subRows = [];
			if (type === 'cr' && category === 'payment') {
				subRows = payments.map((_, j) => ({
					type: 'payment',
					parent: idx,
					subIdx: j,
					id: `payment-${idx}-${j}-${renderKey}`,
				}));
			} else if (type === 'dr' && selectedLedger?.cost_center_count > 0) {
				subRows = costCenters.map((_, j) => ({
					type: 'costCenter',
					parent: idx,
					subIdx: j,
					id: `costCenter-${idx}-${j}-${renderKey}`,
				}));
			}

			const mainRow = {
				type: 'main',
				parent: idx,
				rowSpan: Math.max(1, subRows.length + 1),
				fieldId: fieldEntry.id,
				id: `main-${idx}-${renderKey}`,
			};

			rows.push(mainRow);
			rows.push(...subRows);
		});

		return rows;
	}, [
		voucherFields,
		voucherEntries,
		category,
		ledgerOptions,
		renderKey,
		watch(''),
		allFormData,
	]);

	const rowClass = 'border px-3 py-2 text-sm align-top';
	const handelUpdate = async (idx, amount) => {
		setIndex(idx);
		const currentCostCenters =
			watch(`voucher_entry[${idx}].voucher_entry_cost_center`) || [];

		await setUpdateItem((prev) => ({
			...prev,
			leader_uuid: watch(`voucher_entry.${idx}.ledger_uuid`),
			voucher_entry_set_value: setValue,
			currentCostCenters: currentCostCenters,
			amount: amount,
			index: idx,
			invalidQueryCostCenter: invalidQueryCostCenter,
			invalidateLedger: invalidateLedger,
		}));
		window['voucher_entry_cost_center_add'].showModal();
	};

	return (
		<div className=''>
			{/* Header */}
			<div className='flex items-center justify-between rounded-lg border bg-primary p-4 text-white shadow-sm'>
				<div>
					<h2 className='text-lg font-semibold text-white'>
						Voucher Entry
					</h2>
					<p className='mt-1 text-sm text-white'>
						Add debit and credit entries for your voucher
					</p>
				</div>
				<div className='flex items-center gap-3'>
					<button
						type='button'
						onClick={appendDrEntry}
						className='btn btn-accent btn-sm flex items-center gap-2 rounded-lg px-4 py-2'
					>
						<Plus className='h-4 w-4' /> DR
					</button>
					<button
						type='button'
						onClick={appendCrEntry}
						className='btn btn-error btn-sm flex items-center gap-2 rounded-lg px-4 py-2'
					>
						<Plus className='h-4 w-4' /> CR
					</button>
				</div>
			</div>

			{/* Table */}
			<div className='overflow-scroll rounded-lg border bg-white shadow-sm'>
				<div className='overflow-x-auto'>
					<table className='w-full border-collapse'>
						<thead>
							<tr className='bg-secondary text-secondary-content'>
								<th
									className={`${rowClass} text-left font-semibold`}
								>
									No.
								</th>
								<th
									className={`${rowClass} text-left font-semibold`}
								>
									Type
								</th>
								<th
									className={`${rowClass} text-left font-semibold`}
								>
									Ledger
								</th>
								<th
									className={`${rowClass} text-left font-semibold`}
								>
									Txn No.
								</th>
								<th
									className={`${rowClass} text-left font-semibold`}
								>
									Date
								</th>
								<th
									className={`${rowClass} text-right font-semibold`}
								>
									Debit (
									{
										currencyOptions.find(
											(c) =>
												c.value ===
												watch('currency_uuid')
										)?.symbol
									}
									)
								</th>
								<th
									className={`${rowClass} text-right font-semibold`}
								>
									Credit (
									{
										currencyOptions.find(
											(c) =>
												c.value ===
												watch('currency_uuid')
										)?.symbol
									}
									)
								</th>
								<th
									className={`${rowClass} text-center font-semibold`}
								>
									Action
								</th>
							</tr>
						</thead>
						<tbody>
							{allRows.map((row) => {
								const p = row.parent;
								const entryPath = `voucher_entry[${p}]`;
								const voucherEntry = voucherEntries[p];

								if (!voucherEntry) return null;

								const type = voucherEntry.type;
								const ledgerUuid = voucherEntry.ledger_uuid;
								const selectedLedger = ledgerOptions.find(
									(l) => l.value === ledgerUuid
								);

								const showPaymentButton =
									type === 'cr' &&
									category === 'payment' &&
									selectedLedger?.is_cash_ledger === false;
								const showCostCenterButton =
									type === 'dr' &&
									selectedLedger?.cost_center_count > 0;

								const remainingCostAmount =
									voucherEntry.amount -
									voucherEntry.voucher_entry_cost_center.reduce(
										(sum, entry) =>
											sum + Number(entry.amount),
										0
									);
								const remainingPaymentAmount =
									voucherEntry.amount -
									voucherEntry.voucher_entry_payment.reduce(
										(sum, entry) =>
											sum + Number(entry.amount),
										0
									);

								return (
									<tr
										key={row.id}
										className={` ${rowClass} hover:bg-gray-50 ${
											p % 2 === 0
												? 'bg-gray-50'
												: 'bg-white'
										} `}
									>
										{/* Main entry fields with rowSpan */}
										{row.type === 'main' && (
											<>
												<td
													rowSpan={row.rowSpan}
													className={`${rowClass} w-10 align-top`}
												>
													{p + 1}
												</td>
												<td
													rowSpan={row.rowSpan}
													className={`${rowClass} w-32 align-top`}
												>
													<FormField
														label={`${entryPath}.type`}
														is_title_needed='false'
														dynamicerror={
															errors
																.voucher_entry?.[
																p
															]?.type
														}
													>
														<Controller
															name={`${entryPath}.type`}
															control={control}
															render={({
																field: {
																	onChange,
																	value,
																},
															}) => (
																<ReactSelect
																	placeholder='Select Type'
																	options={
																		typeOptions
																	}
																	value={
																		typeOptions.find(
																			(
																				o
																			) =>
																				o.value ===
																				value
																		) ??
																		null
																	}
																	onChange={(
																		e
																	) =>
																		handleTypeChange(
																			p,
																			e?.value,
																			onChange
																		)
																	}
																	menuPortalTarget={
																		document.body
																	}
																/>
															)}
														/>
													</FormField>

													<div className='flex w-full flex-col justify-items-end gap-2 py-2'>
														{showCostCenterButton && (
															<button
																type='button'
																onClick={() => {
																	handleCostCenterAppend(
																		p,
																		remainingCostAmount
																	);
																}}
																disabled={
																	watch(
																		`voucher_entry.${p}.voucher_entry_cost_center`
																	)?.length >=
																	ledgerOptions.find(
																		(l) =>
																			l.value ===
																			ledgerUuid
																	)
																		?.cost_center_count
																}
																className='btn btn-outline btn-sm flex items-center justify-center gap-1 rounded'
																title='Add Cost Center Entry'
															>
																CC
																<Plus className='h-3 w-3' />
															</button>
														)}
														{!showPaymentButton &&
															type === 'dr' && (
																<button
																	type='button'
																	onClick={() => {
																		handelUpdate(
																			p,
																			remainingCostAmount
																		);

																		setIndex(
																			p
																		);

																		setValue(
																			`voucher_entry[${p}].voucher_entry_cost_center`,

																			watch(
																				`voucher_entry[${p}].voucher_entry_cost_center`
																			).filter(
																				(
																					item
																				) =>
																					item.cost_center_uuid !==
																						null &&
																					item.cost_center_uuid !==
																						undefined &&
																					item.cost_center_uuid !==
																						''
																			) ||
																				[]
																		);
																	}}
																	className='btn btn-outline btn-sm flex items-center justify-center gap-1 rounded bg-accent text-white'
																	title='Add Cost Center Entry'
																>
																	New CC
																	<Plus className='h-3 w-3' />
																</button>
															)}
													</div>

													{showPaymentButton && (
														<div className='w-full justify-items-end py-2'>
															<button
																type='button'
																onClick={() => {
																	handlePaymentAppend(
																		p,
																		remainingPaymentAmount
																	);
																}}
																className='btn btn-outline btn-sm flex flex-shrink-0 items-center gap-1 rounded'
																title='Add Payment Entry'
															>
																<Plus className='h-3 w-3' />
																Payment
															</button>
														</div>
													)}
												</td>
											</>
										)}
										<td
											// rowSpan={row.rowSpan}
											className={`${rowClass}`}
										>
											{row.type === 'main' && (
												<FormField
													label={`${entryPath}.ledger_uuid`}
													is_title_needed='false'
													dynamicerror={
														errors.voucher_entry?.[
															p
														]?.ledger_uuid
													}
												>
													<Controller
														name={`${entryPath}.ledger_uuid`}
														control={control}
														render={({
															field: {
																onChange,
																value,
															},
														}) => (
															<ReactSelect
																placeholder='Select Ledger'
																options={
																	filteredLedgerOptions
																}
																value={
																	ledgerOptions.find(
																		(o) =>
																			o.value ===
																			value
																	) ?? null
																}
																onChange={(e) =>
																	onChange(
																		e?.value
																	)
																}
																menuPortalTarget={
																	document.body
																}
															/>
														)}
													/>
												</FormField>
											)}

											{row.type === 'payment' && (
												<div className='flex gap-2'>
													<p className='justify-center py-4 align-baseline text-sm font-medium text-gray-900'>
														{p + 1}.{row.subIdx + 1}
													</p>
													<FormField
														label={`${entryPath}.voucher_entry_payment[${row.subIdx}].payment_type`}
														is_title_needed='false'
														dynamicerror={
															errors
																.voucher_entry?.[
																p
															]
																?.voucher_entry_payment?.[
																row.subIdx
															]?.payment_type
														}
													>
														<Controller
															name={`${entryPath}.voucher_entry_payment[${row.subIdx}].payment_type`}
															control={control}
															render={({
																field: {
																	onChange,
																	value,
																},
															}) => (
																<ReactSelect
																	placeholder='Select Payment Method'
																	options={
																		paymentTypeOption
																	}
																	value={
																		paymentTypeOption.find(
																			(
																				o
																			) =>
																				o.value ===
																				value
																		) ??
																		null
																	}
																	onChange={(
																		e
																	) =>
																		onChange(
																			e?.value
																		)
																	}
																	menuPortalTarget={
																		document.body
																	}
																/>
															)}
														/>
													</FormField>
												</div>
											)}
											{row.type === 'costCenter' && (
												<CostCenter
													entryPath={entryPath}
													control={control}
													errors={errors}
													p={p}
													Controller={Controller}
													subIdx={row.subIdx}
													watch={watch}
												></CostCenter>
											)}
										</td>

										{/* Transaction No */}
										<td className={`${rowClass} w-48`}>
											{row.type === 'payment' && (
												<Input
													title='Transaction No.'
													label={`${entryPath}.voucher_entry_payment[${row.subIdx}].trx_no`}
													is_title_needed='false'
													register={register}
													dynamicerror={
														errors.voucher_entry?.[
															p
														]
															?.voucher_entry_payment?.[
															row.subIdx
														]?.trx_no
													}
												/>
											)}
										</td>

										{/* Date */}
										<td className={`${rowClass} w-48`}>
											{row.type === 'payment' && (
												<DateInput
													label={`${entryPath}.voucher_entry_payment[${row.subIdx}].date`}
													control={control}
													Controller={Controller}
													is_title_needed='false'
													register={register}
													errors={errors}
													selected={watch(
														`${entryPath}.voucher_entry_payment[${row.subIdx}].date`
													)}
												/>
											)}
										</td>

										{/* Debit Amount */}
										<td
											className={`${rowClass} w-32 text-right`}
										>
											{row.type === 'main' &&
												type === 'dr' && (
													<Input
														title='Debit'
														type='number'
														label={`${entryPath}.amount`}
														is_title_needed='false'
														register={register}
														dynamicerror={
															errors
																.voucher_entry?.[
																p
															]?.amount
														}
													/>
												)}
											{row.type === 'costCenter' && (
												<Input
													title='Debit'
													label={`${entryPath}.voucher_entry_cost_center[${row.subIdx}].amount`}
													type='number'
													is_title_needed='false'
													register={register}
													dynamicerror={
														errors.voucher_entry?.[
															p
														]
															?.voucher_entry_cost_center?.[
															row.subIdx
														]?.amount
													}
												/>
											)}
										</td>

										{/* Credit Amount */}
										<td
											className={`${rowClass} w-32 text-right`}
										>
											{row.type === 'main' &&
												type === 'cr' && (
													<Input
														title='Credit'
														label={`${entryPath}.amount`}
														is_title_needed='false'
														type='number'
														register={register}
														dynamicerror={
															errors
																.voucher_entry?.[
																p
															]?.amount
														}
													/>
												)}
											{row.type === 'payment' && (
												<Input
													title='Credit'
													label={`${entryPath}.voucher_entry_payment[${row.subIdx}].amount`}
													type='number'
													is_title_needed='false'
													register={register}
													dynamicerror={
														errors.voucher_entry?.[
															p
														]
															?.voucher_entry_payment?.[
															row.subIdx
														]?.amount
													}
												/>
											)}
										</td>

										{/* Action Column */}
										<td
											className={`${rowClass} w-4 text-center`}
										>
											{row.type === 'main' ? (
												<div className='flex flex-wrap items-center justify-center gap-1'>
													<RemoveButton
														onClick={() =>
															handleVoucherRemove(
																p
															)
														}
														showButton
														className='flex-shrink-0'
													/>
												</div>
											) : (
												<RemoveButton
													onClick={() => {
														if (
															row.type ===
															'payment'
														) {
															handlePaymentRemove(
																p,
																row.subIdx
															);
														} else {
															handleCostCenterRemove(
																p,
																row.subIdx
															);
														}
														setTimeout(
															() =>
																setRenderKey(
																	(prev) =>
																		prev + 1
																),
															50
														);
													}}
													showButton
													className='flex-shrink-0'
												/>
											)}
										</td>
									</tr>
								);
							})}
							{children}
						</tbody>
					</table>
				</div>
			</div>

			{/* Empty State */}
			{voucherFields.length === 0 && (
				<div className='rounded-lg border-2 border-dashed border-gray-200 bg-gray-50 py-12 text-center'>
					<h3 className='mb-2 text-lg font-medium text-gray-700'>
						No voucher entries yet
					</h3>
					<p className='mb-4 text-gray-500'>
						Start by adding your first debit or credit entry
					</p>
					<div className='flex items-center justify-center gap-3'>
						<button
							type='button'
							onClick={appendDrEntry}
							className='btn btn-accent btn-sm flex items-center gap-2 rounded-lg'
						>
							<Plus className='h-4 w-4' /> Add Debit Entry
						</button>
						<button
							type='button'
							onClick={appendCrEntry}
							className='btn btn-error btn-sm flex items-center gap-2 rounded-lg'
						>
							<Plus className='h-4 w-4' /> Add Credit Entry
						</button>
					</div>
				</div>
			)}
		</div>
	);
}

export default React.memo(VoucherEntryRow);
