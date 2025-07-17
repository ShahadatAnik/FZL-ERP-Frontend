import { useEffect, useRef, useState } from 'react';
import { useAuth } from '@/context/auth';
import {
	useOtherOrderPropertiesByGarmentsWash,
	useOtherOrderPropertiesBySpecialRequirement,
} from '@/state/Other';
import { useOrderStatementReport } from '@/state/Report';
import { format } from 'date-fns';
import { LoaderCircle } from 'lucide-react';
import { useAccess } from '@/hooks';

import OrderSheetPdf from '@/components/Pdf/OrderStatement';
import PdfWorker from '@/components/Pdf/pdfWorker.js?worker'; // Vite example (or similar for Webpack)

import { api } from '@lib/api';

import Excel from './Excel';
import Header from './Header';

function removeFunctions(obj) {
	if (Array.isArray(obj)) {
		return obj.map(removeFunctions);
	} else if (obj && typeof obj === 'object') {
		const newObj = {};
		for (const key in obj) {
			if (typeof obj[key] !== 'function') {
				newObj[key] = removeFunctions(obj[key]);
			}
		}
		return newObj;
	}
	return obj;
}
const getPath = (haveAccess, userUUID) => {
	if (haveAccess.includes('show_own_orders') && userUUID) {
		return `own_uuid=${userUUID}`;
	}

	return ``;
};

export default function index() {
	const haveAccess = useAccess('report__production_statement');
	const { user } = useAuth();

	let worker = useRef(null);
	const [isGenerating, setIsGenerating] = useState(false);
	const [pdfUrl, setPdfUrl] = useState(null);
	const [error, setError] = useState(null);

	const [from, setFrom] = useState(format(new Date(), 'yyyy-MM-dd'));
	const [to, setTo] = useState(format(new Date(), 'yyyy-MM-dd'));
	const [marketing, setMarketing] = useState('');
	const [type, setType] = useState('');
	const [party, setParty] = useState('');
	const { data: garments } = useOtherOrderPropertiesByGarmentsWash();
	const { data: sr } = useOtherOrderPropertiesBySpecialRequirement();
	const { data, isLoading } = useOrderStatementReport(
		from,
		to,
		party,
		marketing,
		type,
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
	const pdfDocGenerator = OrderSheetPdf(data, garments, sr, from, to);

	const generate = (btnType) => {
		if (btnType == 'excel' && !isLoading) {
			Excel(data, from, to);
		} else {
			setIsGenerating(true);
			setPdfUrl(null); // Clear previous PDF
			setError(null);

			// Your pdfmake document definition (example)
			const docDefinition = removeFunctions(pdfDocGenerator);

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
					marketing,
					setMarketing,
					type,
					setType,
					party,
					setParty,
					isLoading,
				}}
			/>
			<div className='flex gap-2'>
				<div className='flex gap-2'>
					<button
						type='button'
						onClick={() => generate('pdf')}
						className='btn btn-primary flex-1'
						disabled={isGenerating || isLoading}
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
				{/* <button
					type='button'
					onClick={() => Excel(data, from, to)}
					className='btn btn-secondary flex-1'>
					Excel
				</button> */}
			</div>
		</div>
	);
}
