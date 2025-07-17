import { useCallback, useEffect, useRef, useState } from 'react';

import PdfWorker from '@/components/Pdf/pdfWorker.js?worker';

export function usePdfGenerator() {
	const workerRef = useRef(null);
	const [isGenerating, setIsGenerating] = useState(false);
	const [progress, setProgress] = useState(0);
	const [status, setStatus] = useState('');
	const [pdfUrl, setPdfUrl] = useState(null);
	const [error, setError] = useState(null);

	useEffect(() => {
		workerRef.current = new PdfWorker();

		workerRef.current.onmessage = (e) => {
			const { type, blob, progress: p, status: s, error: err } = e.data;
			if (type === 'pdfProgress') {
				setProgress(p);
				setStatus(s);
			} else if (type === 'pdfStatus') {
				setStatus(s);
				if (p !== undefined) setProgress(p);
			} else if (type === 'pdfGenerated') {
				const url = URL.createObjectURL(blob);
				setPdfUrl(url);
				setProgress(100);
				setStatus(s);
				setIsGenerating(false);
				setError(null);
			} else if (type === 'pdfError') {
				setError(err);
				setStatus(s || 'Error during PDF generation');
				setProgress(0);
				setIsGenerating(false);
			}
		};

		workerRef.current.onerror = () => {
			setError('PDF worker error');
			setStatus('Worker error occurred');
			setProgress(0);
			setIsGenerating(false);
		};

		return () => {
			workerRef.current && workerRef.current.terminate();
			if (pdfUrl) URL.revokeObjectURL(pdfUrl);
		};
	}, [pdfUrl]);

	const generatePdf = useCallback((docDefinition) => {
		setIsGenerating(true);
		setProgress(0);
		setStatus('Starting PDF generation…');
		setPdfUrl(null);
		setError(null);

		workerRef.current &&
			workerRef.current.postMessage({
				type: 'generatePdf',
				data: { documentDefinition: docDefinition },
			});
	}, []);

	const reset = useCallback(() => {
		setIsGenerating(false);
		setProgress(0);
		setStatus('');
		setPdfUrl(null);
		setError(null);
	}, []);

	return {
		isGenerating,
		progress,
		status,
		pdfUrl,
		error,
		generatePdf,
		reset,
	};
}
