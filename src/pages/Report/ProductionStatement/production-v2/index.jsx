import React, { useCallback, useState } from 'react';
import { useAuth } from '@/context/auth';
import { useProductionStatementReport } from '@/state/Report';
import { format } from 'date-fns';
import { Download, FileText, LoaderCircle } from 'lucide-react';
import { usePdfGenerator } from '@/hooks/usePdfGenerator';
import { useAccess } from '@/hooks';

import Pdf from '@/components/Pdf/ProductionStatement';
import PdfGeneratorButton from '@/components/ui/generate-pdf-button';

import Excel from './Excel';
import Header from './Header';

export default function ProductionStatementReport() {
	const haveAccess = useAccess('report__production_statement');
	const { user } = useAuth();
	const [from, setFrom] = useState(new Date());
	const [to, setTo] = useState(new Date());
	const [marketing, setMarketing] = useState('');
	const [type, setType] = useState('');
	const [priceFor, setPriceFor] = useState('company');
	const [party, setParty] = useState('');
	const [order, setOrder] = useState('');
	const [reportFor, setReportFor] = useState('');

	const path =
		haveAccess.includes('show_own_orders') && user && user.uuid
			? `own_uuid=${user.uuid}`
			: '';

	const { data, isFetching, refetch } = useProductionStatementReport(
		format(from, 'yyyy-MM-dd'),
		format(to, 'yyyy-MM-dd'),
		party,
		marketing,
		type,
		order,
		reportFor,
		priceFor,
		path
	);

	const {
		isGenerating,
		progress,
		status,
		pdfUrl,
		error,
		generatePdf,
		reset,
	} = usePdfGenerator();

	const handleGenerateClick = useCallback(async () => {
		if (isFetching || isGenerating) return;
		reset();

		const result = await refetch();
		const { data } = result;
		const { data: value } = data;
		if (value) {
			generatePdf(Pdf(value, from, to));
		}
	}, [isFetching, isGenerating, refetch, generatePdf, reset, from, to]);

	const handleExcelClick = useCallback(() => {
		if (data) Excel(data);
	}, [data]);

	return (
		<div className='flex flex-col gap-8'>
			<Header
				from={from}
				setFrom={setFrom}
				to={to}
				setTo={setTo}
				party={party}
				setParty={setParty}
				marketing={marketing}
				setMarketing={setMarketing}
				type={type}
				setType={setType}
				order={order}
				setOrder={setOrder}
				reportFor={reportFor}
				setReportFor={setReportFor}
				priceFor={priceFor}
				setPriceFor={setPriceFor}
				isLoading={isFetching || isGenerating}
			/>

			<div className='grid grid-cols-1 gap-2 md:grid-cols-2'>
				<PdfGeneratorButton
					handleGenerateClick={handleGenerateClick}
					isFetching={isFetching}
					isGenerating={isGenerating}
					pdfUrl={pdfUrl}
					status={status}
					progress={progress}
					error={error}
				/>

				<button
					type='button'
					onClick={handleExcelClick}
					disabled={!data || isFetching}
					className='btn btn-secondary'
				>
					{isFetching && <LoaderCircle className='animate-spin' />}
					Excel
				</button>
			</div>
		</div>
	);
}
