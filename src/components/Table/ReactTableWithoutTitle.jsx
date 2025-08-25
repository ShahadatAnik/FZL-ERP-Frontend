import ReactTable from '@/components/Table';

const ReactTableWithoutTitle = ({
	title,
	data,
	columns,
	showColumnsHeader,
	children,
}) => {
	return (
		<ReactTable
			title={title}
			containerClassName='mb-0 rounded-t-none'
			data={data}
			columns={columns}
			showColumnsHeader={showColumnsHeader}
			showWithoutTitle
		>
			{children}
		</ReactTable>
	);
};

export default ReactTableWithoutTitle;
