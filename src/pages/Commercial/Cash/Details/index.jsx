import { useEffect, useState } from 'react';
import { useCommercialPIDetailsByPiId } from '@/state/Commercial';
import { useParams } from 'react-router';

import PiPdfSheet from '@/components/Pdf/CashInvoice';

import Information from './Information';
import CashReceivesTable from './Table/CashReceives';
import ThreadTable from './Table/ThreadTable';
import ZipperTable from './Table/ZipperTable';

export default function Index() {
	const { pi_id } = useParams();
	const { data, isLoading, invalidateQuery } =
		useCommercialPIDetailsByPiId(pi_id);

	useEffect(() => {
		invalidateQuery();
		document.title = `PI: ${pi_id}`;
	}, [pi_id]);
	// ! FOR TESTING
	const [data2, setData] = useState('');

	useEffect(() => {
		if (data && data?.pi_cash_entry) {
			PiPdfSheet(data)?.getDataUrl((dataUrl) => {
				setData(dataUrl);
			});
		}
	}, [data]);
	// ! FOR TESTING
	if (isLoading)
		return <span className='loading loading-dots loading-lg z-50' />;

	return (
		<div className='space-y-8 py-4'>
			<iframe
				src={data2}
				className='h-[40rem] w-full rounded-md border-none'
			/>
			<Information pi={data} />
			{data?.pi_cash_entry.length > 0 && (
				<ZipperTable
					pi={data?.pi_cash_entry}
					conventionRate={data?.conversion_rate}
				/>
			)}
			{data?.pi_cash_entry_thread.length > 0 && (
				<ThreadTable
					pi_cash_entry_thread={data?.pi_cash_entry_thread}
					conventionRate={data?.conversion_rate}
				/>
			)}
			{/* {data?.cash_receives.length > 0 && (
				<CashReceivesTable cash_receives={data?.cash_receives} />
			)} */}
		</div>
	);
}
