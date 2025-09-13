import { useMemo } from 'react';

import ReactTableTitleOnly from '@/components/Table/ReactTableTitleOnly';
import { CustomLink, DateTime } from '@/ui';

export default function Index({ entries, manualPI = false }) {
	const columns = useMemo(
		() => [
			{
				accessorFn: (row) => row.id || row.pi_number,
				header: 'PI ID',
				enableColumnFilter: true,
				width: 'w-36',
				cell: (info) => {
					if (manualPI) {
						return (
							<CustomLink
								label={info.getValue()}
								url={`/commercial/manual-pi/${info.row.original.uuid}`}
								openInNewTab={true}
							/>
						);
					} else {
						return (
							<CustomLink
								label={info.getValue()}
								url={`/commercial/pi/${info.getValue()}`}
								openInNewTab={true}
							/>
						);
					}
				},
			},
			{
				accessorKey: 'bank_name',
				header: 'PI Bank',
				enableColumnFilter: false,
				cell: (info) => info.getValue(),
			},
			{
				accessorKey: 'total_amount',
				header: 'PI Value',
				enableColumnFilter: false,
				cell: (info) => info.getValue(),
			},
			{
				accessorKey: 'marketing_name',
				header: 'Marketing',
				enableColumnFilter: false,
				cell: (info) => info.getValue(),
			},
			{
				accessorFn: (row) => {
					const { order_numbers, thread_order_numbers } = row;
					const zipper =
						order_numbers
							.map((order) => order.order_number)
							.join(', ') || '';
					const thread =
						thread_order_numbers
							.map((order) => order.thread_order_number)
							.join(', ') || '';

					if (zipper.length > 0 && thread.length > 0)
						return `${zipper}, ${thread}`;

					if (zipper.length > 0) return zipper;

					if (thread.length > 0) return thread;

					return '--';
				},
				id: 'order_numbers',
				header: 'O/N',
				enableColumnFilter: false,
				cell: ({ row }) => {
					const { order_numbers, thread_order_numbers } =
						row.original;

					let links = [];

					order_numbers
						?.filter((order) => order.order_info_uuid)
						.forEach((order) => {
							links.push({
								label: order.order_number,
								url: `/order/details/${order.order_number}`,
							});
						});

					thread_order_numbers
						?.filter((order) => order.thread_order_info_uuid)
						.forEach((order) => {
							links.push({
								label: order.thread_order_number,
								url: `/thread/order-info/${order.thread_order_info_uuid}`,
							});
						});

					return links.map((link, index) => (
						<CustomLink
							key={index}
							label={link.label}
							url={link.url}
						/>
					));
				},
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

	return <ReactTableTitleOnly title='PI' data={entries} columns={columns} />;
}
