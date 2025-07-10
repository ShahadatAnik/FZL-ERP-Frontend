import { useEffect, useRef, useState } from 'react';
import { useAuth } from '@/context/auth';
import { useProductionStatementReport } from '@/state/Report';
import { format } from 'date-fns';
import { LoaderCircle } from 'lucide-react';
import { useAccess } from '@/hooks';

import PdfWorker from '@/components/Pdf/pdfWorker.js?worker'; // Vite example (or similar for Webpack)
import Pdf from '@/components/Pdf/ProductionStatement';

import Excel from './Excel';
import Header from './Header';

const getPath = (haveAccess, userUUID) => {
	if (haveAccess.includes('show_own_orders') && userUUID) {
		return `own_uuid=${userUUID}`;
	}

	return ``;
};

export default function index() {
	const haveAccess = useAccess('report__production_statement');
	const { user } = useAuth();

	const [isGenerating, setIsGenerating] = useState(false);
	const [pdfUrl, setPdfUrl] = useState(null);
	const [error, setError] = useState(null);
	const [from, setFrom] = useState(new Date());
	const [to, setTo] = useState(new Date());
	const [marketing, setMarketing] = useState('');
	const [type, setType] = useState('');
	const [priceFor, setPriceFor] = useState('company');
	const [party, setParty] = useState('');
	const [order, setOrder] = useState('');
	const [reportFor, setReportFor] = useState('');

	let worker = useRef(null);
	const { data, isLoading } = useProductionStatementReport(
		format(from, 'yyyy-MM-dd'),
		format(to, 'yyyy-MM-dd'),
		party,
		marketing,
		type,
		order,
		reportFor,
		priceFor,
		getPath(haveAccess, user?.uuid),
		{
			isEnabled: !!user?.uuid,
		}
	);

	useEffect(() => {
		worker.current = new PdfWorker();

		// Listen for messages from the worker
		worker.current.onmessage = (event) => {
			const { type, blob, error: workerError } = event.data;

			if (type === 'pdfGenerated') {
				const url = URL.createObjectURL(blob);
				setPdfUrl(url);
				setIsGenerating(false);
				setError(null);
			} else if (type === 'pdfError') {
				console.error('PDF generation failed in worker:', workerError);
				setError(`PDF generation failed: ${workerError}`);
				setIsGenerating(false);
			}
		};

		// Handle errors that might occur in the worker itself (e.g., script loading errors)
		worker.current.onerror = (e) => {
			console.error('Web Worker error:', e);
			setError('An error occurred with the PDF generator.');
			setIsGenerating(false);
		};

		// Clean up the worker when the component unmounts
		return () => {
			if (worker.current) {
				worker.current.terminate();
				worker.current = null;
			}
			if (pdfUrl) {
				URL.revokeObjectURL(pdfUrl); // Clean up any lingering object URL
			}
		};
	}, []);
	const pdfDocGenerator = Pdf(data, from, to);

	const generate = (btnType) => {
		if (btnType == 'excel' && !isLoading) {
			Excel(data, from, to);
		} else {
			setIsGenerating(true);
			setPdfUrl(null); // Clear previous PDF
			setError(null);

			// Your pdfmake document definition (example)
			const docDefinition = pdfDocGenerator;

			// Send the document definition and any options to the worker
			if (worker.current) {
				worker.current.postMessage({
					type: 'generatePdf',
					data: {
						documentDefinition: docDefinition,
						options: {}, // Add any pdfmake options here
					},
				});
			} else {
				setError('PDF worker not initialized.');
				setIsGenerating(false);
			}
		}
	};
	return (
		<div className='flex flex-col gap-8'>
			<Header
				{...{
					from,
					setFrom,
					to,
					setTo,
					party,
					setParty,
					marketing,
					setMarketing,
					type,
					setType,
					order,
					setOrder,
					reportFor,
					setReportFor,
					priceFor,
					setPriceFor,
					isLoading,
				}}
			/>
			<div className='grid grid-cols-1 gap-2 md:grid-cols-2'>
				<div className='flex gap-2'>
					<button
						type='button'
						onClick={() => generate('pdf')}
						className='btn btn-primary flex-1'
						disabled={isGenerating}
					>
						{isGenerating && (
							<LoaderCircle className='animate-spin' />
						)}
						{pdfUrl ? 'Regenerate PDF' : 'Generate PDF'}
					</button>
					{error && <p style={{ color: 'red' }}>{error}</p>}
					{pdfUrl && (
						<>
							<a
								className='btn btn-primary flex-1'
								href={pdfUrl}
								download='erp_report.pdf'
							>
								Download Now
							</a>
						</>
					)}
				</div>
				<button
					type='button'
					onClick={() => generate('excel')}
					className='btn btn-secondary flex-1'
					disabled={isLoading}
				>
					{isLoading && <LoaderCircle className='animate-spin' />}
					Excel
				</button>
			</div>
		</div>
	);
}
