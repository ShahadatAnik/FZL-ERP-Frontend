import { useMemo } from 'react';

import ReactTableTitleOnly from '@/components/Table/ReactTableTitleOnly';
import { DateTime } from '@/ui';

import { dateType } from '../utils';

export default function Index({ entries }) {
	const columns = useMemo(
		() => [
			{
				accessorKey: 'amount',
				header: 'Amount',
				enableColumnFilter: false,
				cell: (info) => info.getValue(),
			},
			{
				accessorKey: 'receive_date',
				header: 'Receive',
				enableColumnFilter: false,
				cell: (info) => (
					<DateTime
						date={info.getValue()}
						customizedDateFormate={dateType}
						isTime={false}
					/>
				),
			},
			{
				accessorKey: 'handover_date',
				header: 'Hand Over',
				enableColumnFilter: false,
				cell: (info) => (
					<DateTime
						date={info.getValue()}
						customizedDateFormate={dateType}
						isTime={false}
					/>
				),
			},
			{
				accessorKey: 'document_submission_date',
				header: 'Doc Submit',
				enableColumnFilter: false,
				cell: (info) => (
					<DateTime
						date={info.getValue()}
						customizedDateFormate={dateType}
						isTime={false}
					/>
				),
			},
			{
				accessorKey: 'document_receive_date',
				header: 'Doc Receive',
				enableColumnFilter: false,
				cell: (info) => (
					<DateTime
						date={info.getValue()}
						customizedDateFormate={dateType}
						isTime={false}
					/>
				),
			},
			{
				accessorKey: 'bank_forward_date',
				header: 'Bank Forward',
				enableColumnFilter: false,
				cell: (info) => (
					<DateTime
						date={info.getValue()}
						customizedDateFormate={dateType}
						isTime={false}
					/>
				),
			},
			{
				accessorKey: 'acceptance_date',
				header: 'Acceptance',
				enableColumnFilter: false,
				cell: (info) => (
					<DateTime
						date={info.getValue()}
						customizedDateFormate={dateType}
						isTime={false}
					/>
				),
			},
			{
				accessorKey: 'maturity_date',
				header: 'Maturity',
				enableColumnFilter: false,
				cell: (info) => (
					<DateTime
						date={info.getValue()}
						customizedDateFormate={dateType}
						isTime={false}
					/>
				),
			},
			{
				accessorKey: 'payment_date',
				header: 'Payment',
				enableColumnFilter: false,
				cell: (info) => (
					<DateTime
						date={info.getValue()}
						customizedDateFormate={dateType}
						isTime={false}
					/>
				),
			},
			{
				accessorKey: 'payment_value',
				header: 'Payment Value',
				enableColumnFilter: false,
				cell: (info) => info.getValue(),
			},
			{
				accessorKey: 'created_at',
				header: 'Created',
				filterFn: 'isWithinRange',
				enableColumnFilter: false,
				width: 'w-24',
				cell: (info) => {
					return <DateTime date={info.getValue()} />;
				},
			},
			{
				accessorKey: 'updated_at',
				header: 'Updated',
				enableColumnFilter: false,
				width: 'w-24',
				cell: (info) => {
					return <DateTime date={info.getValue()} />;
				},
			},
		],
		[entries]
	);

	return (
		<ReactTableTitleOnly
			title='Progression'
			data={entries}
			columns={columns}
		/>
	);
}
