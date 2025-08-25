// components/TotalsRow.jsx
import React, { useMemo } from 'react';
import { useWatch } from 'react-hook-form';

import { Input } from '@/ui';

import { formatAmountSmart } from '../../utils';

export default function TotalsRow({
	control,
	register,
	errors,
	rowClass = 'border px-3 py-2 text-sm align-center',
	isVisible = true,
	showNarration = true,
	currencySymbol = '',
	precision = 2,
	className = '',
}) {
	const entries = useWatch({
		control,
		name: 'voucher_entry',
		defaultValue: [],
	});

	const { totalDr, totalCr, isBalanced } = useMemo(() => {
		const dr = (entries || [])
			.filter((entry) => entry.type === 'dr')
			.reduce((sum, entry) => sum + Number(entry.amount || 0), 0);

		const cr = (entries || [])
			.filter((entry) => entry.type === 'cr')
			.reduce((sum, entry) => sum + Number(entry.amount || 0), 0);

		const balanced = dr === cr && dr > 0 && cr > 0;
		const diff = Math.abs(dr - cr);

		return {
			totalDr: dr,
			totalCr: cr,
			isBalanced: balanced,
			difference: diff,
		};
	}, [entries]);

	if (!isVisible || (entries || []).length === 0) return null;

	return (
		<tr
			className={`border-t-2 border-gray-300 bg-gray-100 font-bold ${className}`}
		>
			{showNarration && (
				<td
					colSpan={5}
					className={`${rowClass} flex-1 font-bold text-gray-700`}
				>
					<div className='flex w-full gap-2'>
						<p className='align-center justify-center py-3'>
							Narration
						</p>
						<Input
							title='Narration'
							label='narration'
							is_title_needed='false'
							register={register}
							dynamicerror={errors.narration}
							placeholder='Enter transaction narration...'
						/>
					</div>
				</td>
			)}

			<td className={`${rowClass} text-right font-bold text-green-600`}>
				{formatAmountSmart(totalDr.toFixed(precision, currencySymbol))}
			</td>

			<td className={`${rowClass} text-right font-bold text-red-600`}>
				{formatAmountSmart(totalCr.toFixed(precision, currencySymbol))}
			</td>

			<td className={rowClass}>
				<div className='text-center text-xs'>
					{isBalanced ? (
						<div className='flex flex-col items-center'>
							<span className='font-medium text-success'>
								✓ Balanced
							</span>
						</div>
					) : (
						<div className='flex flex-col items-center'>
							<span className='font-medium text-error'>
								⚠ Unbalanced
							</span>
						</div>
					)}
				</div>
			</td>
		</tr>
	);
}
