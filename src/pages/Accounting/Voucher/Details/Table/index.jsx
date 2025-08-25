import React from 'react';
import { format } from 'date-fns';

import { formatAmountSmart, paymentTypeOption } from '../../utils';

const VoucherDetailsTable = ({ data }) => {
	// Filter out UUID fields and unwanted fields
	const filterFields = (obj) => {
		if (typeof obj !== 'object' || obj === null) return obj;
		if (Array.isArray(obj)) {
			return obj.map((item) => filterFields(item));
		}
		const filtered = {};
		const excludeFields = [
			'uuid',
			'created_by',
			'updated_by',
			'created_by_name',
			'updated_by_name',
			'remarks',
			'created_at',
			'updated_at',
			'is_need_cost_center',
			'is_payment',
			'_uuid',
		];
		for (const [key, value] of Object.entries(obj)) {
			if (!excludeFields.includes(key) && !key.endsWith('_uuid')) {
				filtered[key] = filterFields(value);
			}
		}
		return filtered;
	};

	const filteredData = filterFields(data);
	const entries = filteredData.voucher_entry || [];

	// Compute totals
	const totals = entries.reduce(
		(acc, entry) => {
			const amount = Number(entry.amount) || 0;
			if (entry.type === 'dr') acc.debit += amount;
			else if (entry.type === 'cr') acc.credit += amount;
			return acc;
		},
		{ debit: 0, credit: 0 }
	);

	// Prepare flat structure with rowSpan calculations
	const prepareTableRows = () => {
		const rows = [];

		entries.forEach((entry, entryIndex) => {
			const {
				voucher_entry_cost_center = [],
				voucher_entry_payment = [],
				...fields
			} = entry;

			const costCenters = voucher_entry_cost_center || [];
			const payments = voucher_entry_payment || [];
			const totalSubRows = costCenters.length + payments.length;
			const totalRows = totalSubRows > 0 ? totalSubRows + 1 : 1;

			const isDebit = fields.type === 'dr';

			// Main entry row
			rows.push({
				type: 'main',
				entryIndex,
				rowSpan: totalRows,
				isFirst: true,
				data: {
					index: fields.index + 1,
					ledgerName: fields.ledger_name,
					transactionNo: '',
					date: '',
					debit: isDebit ? fields.amount : '',
					credit: !isDebit ? fields.amount : '',
				},
			});

			// Cost center rows
			costCenters.forEach((center, centerIndex) => {
				rows.push({
					type: 'cost_center',
					entryIndex,
					isFirst: false,
					data: {
						index: centerIndex + 1,
						label: centerIndex === 0 ? 'Cost Centers' : '',
						name: center.cost_center_name || 'N/A',
						transactionNo: '',
						date: '',
						debit: isDebit ? center.amount || 'N/A' : '',
						credit: !isDebit ? center.amount || 'N/A' : '',
					},
				});
			});

			// Payment rows - payment type now under ledger column
			payments.forEach((payment, paymentIndex) => {
				const paymentDate = payment.date
					? format(new Date(payment.date), 'dd MMM, yyyy')
					: '';

				rows.push({
					type: 'payment',
					entryIndex,
					isFirst: false,
					data: {
						index: paymentIndex + 1,
						label: paymentIndex === 0 ? 'Payments' : '',
						paymentType: payment.payment_type || 'N/A',
						transactionNo: payment.trx_no || '',
						date: paymentDate,
						debit: '',
						credit: payment.amount || '',
					},
				});
			});
		});

		return rows;
	};

	const tableRows = prepareTableRows();

	if (!entries.length) {
		return (
			<div className='mx-auto w-full rounded-lg border bg-transparent shadow-md'>
				<header className='w-full rounded-md bg-primary py-6 text-white'>
					<h1 className='mx-2 text-2xl font-semibold'>
						Voucher Entries
					</h1>
				</header>
				<p className='py-6 text-center text-red-500'>
					No voucher entries available
				</p>
			</div>
		);
	}

	return (
		<div className='min-h-screen w-full bg-gray-100'>
			<div className='mx-auto w-full overflow-hidden rounded-lg bg-white shadow-md'>
				<header className='bg-primary py-4 text-white'>
					<h1 className='mx-2 text-2xl font-semibold'>
						Voucher Entries
					</h1>
					<p className='mx-2 text-sm'>
						{entries.length} voucher entries
					</p>
				</header>

				<div className='overflow-x-auto'>
					<table className='min-w-full border border-gray-300'>
						<thead className='bg-gray-50'>
							<tr>
								<th className='w-12 border-r border-gray-300 px-3 py-3 text-left text-sm font-medium text-gray-700'>
									No.
								</th>
								<th className='border-r border-gray-300 px-4 py-3 text-left text-sm font-medium text-gray-700'>
									Ledger
								</th>
								<th className='w-28 border-r border-gray-300 px-4 py-3 text-right text-sm font-medium text-gray-700'>
									Debit ({data?.currency_symbol})
								</th>
								<th className='w-28 px-4 py-3 text-right text-sm font-medium text-gray-700'>
									Credit ({data?.currency_symbol})
								</th>
							</tr>
						</thead>
						<tbody>
							{tableRows.map((row, index) => {
								// Determine background color based on entryIndex (entry group)
								const isEvenEntry = row.entryIndex % 2 === 0;
								const rowBackgroundClass = isEvenEntry
									? 'bg-white hover:bg-gray-50'
									: 'bg-gray-50 hover:bg-gray-100';

								return (
									<tr
										key={`${row.entryIndex}-${index}`}
										className={`border-t border-gray-300 ${rowBackgroundClass} ${
											row.type !== 'main' ? 'italic' : ''
										}`}
									>
										{/* Index column with rowSpan for main entries */}
										{row.isFirst && (
											<td
												className='border-r border-gray-300 px-3 py-3 text-center align-top text-sm text-gray-800'
												rowSpan={row.rowSpan}
											>
												{row.data.index || 'N/A'}
											</td>
										)}

										{/* Ledger Name */}
										<td
											className={`border-r border-gray-300 px-4 py-3 text-sm ${
												row.type === 'main'
													? 'font-medium text-gray-800'
													: 'pl-8 text-gray-600'
											}`}
										>
											{row.type === 'main' ? (
												row.data.ledgerName || 'N/A'
											) : row.type === 'cost_center' ? (
												<div className='flex items-center gap-2'>
													{row.entryIndex + 1}.
													{row.data.index}
													<span className='flex-1'>
														{row.data.name}
													</span>
												</div>
											) : (
												<div className='flex items-center gap-2'>
													{row.entryIndex + 1}.
													{row.data.index}
													<span className='flex-1 font-medium'>
														{
															paymentTypeOption.find(
																(option) =>
																	option.value ===
																	row.data
																		.paymentType
															).label
														}
														:{' '}
														{row.data
															.transactionNo ||
															''}{' '}
														{(row.data.date &&
															'(' +
																row.data.date +
																')') ||
															''}
													</span>
												</div>
											)}
										</td>

										{/* Debit column */}
										<td
											className={`border-r border-gray-300 px-4 py-3 text-right text-sm ${
												row.type === 'main'
													? 'font-medium text-gray-800'
													: 'text-gray-600'
											}`}
										>
											{row.data.debit && (
												<span>
													{typeof row.data.debit ===
													'number'
														? formatAmountSmart(
																row.data.debit.toFixed(
																	2
																),
																data?.currency_symbol
															)
														: formatAmountSmart(
																row.data.debit,
																data?.currency_symbol
															)}
												</span>
											)}
										</td>

										{/* Credit column */}
										<td
											className={`px-4 py-3 text-right text-sm ${
												row.type === 'main'
													? 'font-medium text-gray-800'
													: 'text-gray-600'
											}`}
										>
											{row.data.credit && (
												<span>
													{typeof row.data.credit ===
													'number'
														? formatAmountSmart(
																row.data.credit.toFixed(
																	2
																),
																data?.currency_symbol
															)
														: formatAmountSmart(
																row.data.credit,
																data?.currency_symbol
															)}
												</span>
											)}
										</td>
									</tr>
								);
							})}
						</tbody>
						<tfoot>
							<tr className='border-t-2 border-gray-400 bg-gray-100'>
								<td
									className='px-4 py-3 font-bold text-gray-700'
									colSpan={2}
								>
									Narration :{' '}
									<span className='font-normal text-black'>
										{data?.narration}
									</span>
								</td>
								<td className='px-2 py-3 text-right font-bold text-gray-800'>
									<span>
										{formatAmountSmart(
											totals.debit.toFixed(2),
											data?.currency_symbol
										)}
									</span>
								</td>
								<td className='px-2 py-3 text-right font-bold text-gray-800'>
									<span>
										{formatAmountSmart(
											totals.credit.toFixed(2),
											data?.currency_symbol
										)}
									</span>
								</td>
							</tr>
						</tfoot>
					</table>
				</div>
			</div>
		</div>
	);
};

export default VoucherDetailsTable;
