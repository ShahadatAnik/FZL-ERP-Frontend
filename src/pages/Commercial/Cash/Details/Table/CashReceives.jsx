import { useMemo } from 'react';

import ReactTableTitleOnly from '@/components/Table/ReactTableTitleOnly';
import ReactTableWithoutTitle from '@/components/Table/ReactTableWithoutTitle';
import { DateTime } from '@/ui';

export default function CashReceivesTable({ cash_receives }) {
	const columns = useMemo(
		() => [
			{
				accessorKey: 'created_at',
				header: 'Date',
				filterFn: 'isWithinRange',
				enableColumnFilter: false,
				width: 'w-24',
				cell: (info) => {
					return <DateTime date={info.getValue()} isTime={false} />;
				},
			},
			{
				accessorKey: 'amount',
				header: 'Amount',
				enableColumnFilter: false,
				cell: (info) => info.getValue(),
			},
		],
		[cash_receives]
	);

	const totalQty = cash_receives.reduce((a, b) => a + Number(b.amount), 0);

	return (
		<ReactTableWithoutTitle
			title='Cash Receives'
			data={cash_receives}
			columns={columns}
		>
			<tr className='text-sm'>
				<td className='pl-3 text-right font-semibold'>Total Amount:</td>
				<td className='pl-3 font-semibold'>{totalQty}</td>
			</tr>
		</ReactTableWithoutTitle>
	);
}
