import { lazy, useState } from 'react';
import {
	getCoreRowModel,
	getFacetedMinMaxValues,
	getFacetedRowModel,
	getFacetedUniqueValues,
	getFilteredRowModel,
	getPaginationRowModel,
	getSortedRowModel,
	useReactTable,
} from '@tanstack/react-table';

import cn from '@/lib/cn';

import { Suspense } from '../Feedback';
import TableNoData from './_components/TableNoData';
import TableSkeletons from './_components/TableSkeletons';
import TableTitleOnly from './_components/TableTitleOnly';
import { FuzzyFilter, isWithinRange } from './utils';

const TableHeader = lazy(() => import('./_components/TableHeader'));
const TableHead = lazy(() => import('./_components/TableHead'));
const TableBody = lazy(() => import('./_components/TableBody'));
const TablePagination = lazy(() => import('./_components/table-pagination'));

function Table({
	title = '',
	subtitle = '',
	info = '',
	handelAdd = () => {},
	handleReload = null,
	isLoading = false,
	accessor,
	data = [],
	columns,
	searchData = '',
	extraClass = '',
	showSearchBox = true,
	showPagination = true,
	showColumns = true,
	showColumnsHeader = true,
	showTitleOnly = false,
	showWithoutTitle = false,
	showPdf = false,
	pdfData = null,
	//filterTableHeader = [],
	//pdf = null,
	onClickPdfDownload,
	//extraData = [],
	extraButton,
	children,
	select,
	error = null,
	indicatorValue,
	showDateRange = true,
	containerClassName = '',
	...props
}) {
	//* Define state variables
	const [columnFilters, setColumnFilters] = useState([]);
	const [globalFilter, setGlobalFilter] = useState(searchData);
	const [columnVisibility, setColumnVisibility] = useState(
		columns?.reduce((acc, { accessorKey, hidden }) => {
			if (!accessorKey) return acc;
			acc[accessorKey] = !hidden;
			return acc;
		}, {})
	);

	//* Initialize React Table
	const table = useReactTable({
		data,
		columns,
		filterFns: {
			fuzzy: FuzzyFilter,
			isWithinRange,
		},
		state: {
			globalFilter,
			columnFilters,
			columnVisibility,
			rowSelection: props.rowSelection || {},
		},
		onColumnFiltersChange: setColumnFilters,
		onGlobalFilterChange: setGlobalFilter,
		globalFilterFn: FuzzyFilter,
		getCoreRowModel: getCoreRowModel(),
		getFilteredRowModel: getFilteredRowModel(),
		getSortedRowModel: getSortedRowModel(),
		getPaginationRowModel: getPaginationRowModel(),
		getFacetedRowModel: getFacetedRowModel(),
		getFacetedUniqueValues: getFacetedUniqueValues(),
		getFacetedMinMaxValues: getFacetedMinMaxValues(),
		onColumnVisibilityChange: setColumnVisibility,
		onRowSelectionChange: props.setRowSelection,
	});

	//* Extract React Table functions
	const {
		getAllLeafColumns,
		getRowModel,
		getHeaderGroups,
		getPreFilteredRowModel,
	} = table;

	//* Extract rows from React Table
	const { rows } = getRowModel();
	const hasAnyRow = rows?.length > 0 && !error;
	const filteredRows = table._getFilteredRowModel()?.rows || [];

	//* Render functions
	const renderHeader = (showTitleOnly) => {
		if (showWithoutTitle) {
			return;
		}
		if (showTitleOnly)
			return (
				<Suspense>
					<TableTitleOnly
						title={title}
						subtitle={subtitle}
						info={info}
						handelAdd={handelAdd}
					/>
				</Suspense>
			);

		return (
			<Suspense>
				<TableHeader
					title={title}
					subtitle={subtitle}
					info={info}
					handelAdd={handelAdd}
					handleReload={handleReload}
					accessor={accessor}
					indicatorValue={indicatorValue}
					getHeaderGroups={getHeaderGroups}
					getAllLeafColumns={getAllLeafColumns}
					getPreFilteredRowModel={getPreFilteredRowModel}
					filteredRows={filteredRows}
					onClickPdfDownload={onClickPdfDownload}
					globalFilter={globalFilter}
					setGlobalFilter={setGlobalFilter}
					showSearchBox={showSearchBox}
					showColumns={showColumns}
					extraButton={extraButton}
					select={select}
					showDateRange={showDateRange}
					//filterTableHeader={filterTableHeader}
					showPdf={showPdf}
					pdfData={pdfData}
					extraExcelData={props.extraExcelData}
					//pdf={pdf}
					//extraData={extraData}
				/>
			</Suspense>
		);
	};

	const renderRow = (hasAnyRow) => {
		if (!hasAnyRow) return <TableNoData colSpan={columns.length} />;

		return <TableBody rows={rows} extraClass={extraClass} />;
	};

	return (
		<div className='flex flex-col'>
			{renderHeader(showTitleOnly)}
			<Suspense>
				<div
					className={cn(
						'overflow-x-auto rounded-t-md border-[1px] border-secondary/20',
						showTitleOnly && 'mb-6',
						containerClassName,
						table.getPageCount() <= 1 && 'rounded-b-md'
					)}
				>
					<table className='w-full'>
						{showColumnsHeader && (
							<TableHead
								{...{ getHeaderGroups, getPreFilteredRowModel }}
							/>
						)}

						<tbody className='divide-y-[1px] divide-secondary/20'>
							{!isLoading && renderRow(hasAnyRow)}
							{isLoading && <TableSkeletons columns={columns} />}
							{children}
						</tbody>
					</table>
				</div>
			</Suspense>
			{showPagination && table.getPageCount() > 1 && (
				<Suspense>
					<TablePagination {...table} />
				</Suspense>
			)}
		</div>
	);
}

export default Table;
