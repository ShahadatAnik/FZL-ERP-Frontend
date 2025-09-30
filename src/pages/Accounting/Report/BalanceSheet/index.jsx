import { useState } from 'react';
import { format } from 'date-fns';
import { usePdfGenerator } from '@/hooks/usePdfGenerator';

import { generateDetailedBalanceSheetPDF } from '@/components/Pdf/BalanceSheet';
import PdfGeneratorButton from '@/components/ui/generate-pdf-button';

import { useAccReport } from '../config/query';
import Header from './Header';

export default function index() {
	const [from, setFrom] = useState(() => new Date());
	const [to, setTo] = useState(() => new Date());
	const { data, isFetching } = useAccReport(
		format(from, 'yyyy-MM-dd'),
		format(to, 'yyyy-MM-dd'),
		'balance_sheet'
	);

	const handleGeneratePDF = async () => {
		try {
			await data;

			// Generate PDF when button is clicked, not during render
			const balanceSheetPDF = await generateDetailedBalanceSheetPDF(
				data,
				'Fortune Zipper Limited',
				from,
				to,
				format(from, 'yyyy'),
				'balance_sheet'
			);
			balanceSheetPDF.open();
			// Open the PDF
		} catch (error) {
			console.error('Error generating PDF:', error);
		}
	};

	const {
		isGenerating,
		progress,
		status,
		pdfUrl,
		error,
		generatePdf,
		reset,
	} = usePdfGenerator();
	return (
		<div>
			<Header from={from} setFrom={setFrom} to={to} setTo={setTo} />
			<PdfGeneratorButton
				handleGenerateClick={handleGeneratePDF}
				isFetching={isFetching}
				isGenerating={isGenerating}
				pdfUrl={pdfUrl}
				status={status}
				download={false}
				viewPdf={true}
				progress={progress}
				pdf_name={`Balance Sheet(${format(from, 'yyyy-MM-dd')}-${format(to, 'yyyy-MM-dd')})`}
				error={error}
			/>
		</div>
	);
}
