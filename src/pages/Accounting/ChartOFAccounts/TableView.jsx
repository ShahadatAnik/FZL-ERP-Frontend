import { useMemo } from 'react';
import { matchSorter } from 'match-sorter';

import { useChartOfAccountsTable } from '../Report/config/query';

// Table Row Component
const TableRow = ({ item }) => {
	return (
		<tr className='border border-base-300 transition-colors'>
			<td className='px-4 py-3 capitalize'>{item.type}</td>
			<td className='px-4 py-3 capitalize'>{item.head_name}</td>
			<td className='px-4 py-3 capitalize'>{item.group_name}</td>
			<td className='px-4 py-3 capitalize'>{item.ledger_name}</td>
		</tr>
	);
};

// Main Table Component with matchSorter
const TableView = ({ searchTerm = '' }) => {
	const { data: accountData, isLoading } = useChartOfAccountsTable();

	// Filter data using matchSorter
	const filteredData = useMemo(() => {
		if (!searchTerm.trim() || !accountData) return accountData || [];

		return matchSorter(accountData, searchTerm, {
			keys: ['type', 'head_name', 'group_name', 'ledger_name'],
		});
	}, [accountData, searchTerm]);

	if (isLoading) {
		return (
			<div className='flex w-full justify-center p-4'>
				<span className='loading loading-spinner loading-lg'></span>
			</div>
		);
	}

	return (
		<div className='w-full'>
			{/* Search Results Info */}
			{searchTerm && (
				<div className='mb-4 text-sm text-gray-600'>
					{filteredData.length === 0
						? `No results found for "${searchTerm}"`
						: `Found ${filteredData.length} account${filteredData.length !== 1 ? 's' : ''} matching "${searchTerm}"`}
				</div>
			)}

			<div className='overflow-x-auto'>
				<table className='table w-full'>
					<thead>
						<tr className='border-2 border-base-300'>
							<th className='px-4 py-3 text-left text-sm font-semibold text-base-content'>
								Type
							</th>
							<th className='px-4 py-3 text-left text-sm font-semibold text-base-content'>
								Head
							</th>
							<th className='px-4 py-3 text-left text-sm font-semibold text-base-content'>
								Group
							</th>
							<th className='px-4 py-3 text-left text-sm font-semibold text-base-content'>
								Ledger
							</th>
						</tr>
					</thead>
					<tbody>
						{filteredData.map((item, index) => (
							<TableRow key={item.id || index} item={item} />
						))}
					</tbody>
				</table>
			</div>

			{filteredData.length === 0 && !searchTerm && (
				<div className='py-8 text-center text-gray-500'>
					No accounts available.
				</div>
			)}

			{filteredData.length === 0 && searchTerm && (
				<div className='py-8 text-center text-gray-500'>
					No accounts found matching your search criteria.
				</div>
			)}
		</div>
	);
};

export default TableView;
