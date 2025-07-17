// pdfWorker.js
import pdfMake from 'pdfmake/build/pdfmake';

import { vfs } from './vfs_fonts';

pdfMake.vfs = vfs;

pdfMake.fonts = {
	Roboto: {
		normal: 'Roboto-Regular.ttf',
		bold: 'Roboto-Bold.ttf',
		italics: 'Roboto-Italic.ttf',
		bolditalics: 'Roboto-BoldItalic.ttf',
	},
};

// Status messages for different phases
const STATUS_MESSAGES = {
	INITIALIZING: 'Initializing PDF generation...',
	PROCESSING_DOCUMENT: 'Processing document definition...',
	CREATING_PAGES: 'Creating pages...',
	RENDERING_CONTENT: 'Rendering content...',
	APPLYING_STYLES: 'Applying styles and formatting...',
	GENERATING_FINAL: 'Generating final PDF...',
	FINALIZING: 'Finalizing document...',
	COMPLETED: 'PDF generation completed!',
};

// Listen for messages from the main thread
self.onmessage = async (event) => {
	const { type, data } = event.data;
	console.log('Received message:', event.data);

	if (type === 'generatePdf') {
		const { documentDefinition, options } = data;
		console.log('Generating PDF with options:', options);
		console.log('Document Definition:', documentDefinition);

		// Record start time using performance.now() for high precision
		const startTime = performance.now();

		try {
			// Send initialization status with timer start
			self.postMessage({
				type: 'pdfStatus',
				status: STATUS_MESSAGES.INITIALIZING,
				progress: 0,
				startTime: startTime,
				elapsedTime: 0,
			});

			// Simulate processing phases with status updates
			await new Promise((resolve) => setTimeout(resolve, 100));
			self.postMessage({
				type: 'pdfStatus',
				status: STATUS_MESSAGES.PROCESSING_DOCUMENT,
				progress: 10,
				startTime: startTime,
				elapsedTime: performance.now() - startTime,
			});

			await new Promise((resolve) => setTimeout(resolve, 100));
			self.postMessage({
				type: 'pdfStatus',
				status: STATUS_MESSAGES.CREATING_PAGES,
				progress: 20,
				startTime: startTime,
				elapsedTime: performance.now() - startTime,
			});

			// Create the PDF document
			const pdfDocGenerator = pdfMake.createPdf(documentDefinition);
			console.log('PDF Document Generator:', pdfDocGenerator);

			// Enhanced progress callback with status messages and timing
			const progressCallback = (progress) => {
				console.log('PDF Generation Progress:', progress);
				const percentage = Math.round(progress * 100);
				const currentTime = performance.now();
				const elapsedTime = currentTime - startTime;

				let statusMessage = STATUS_MESSAGES.RENDERING_CONTENT;

				// Update status based on progress
				if (percentage < 30) {
					statusMessage = STATUS_MESSAGES.CREATING_PAGES;
				} else if (percentage < 60) {
					statusMessage = STATUS_MESSAGES.RENDERING_CONTENT;
				} else if (percentage < 90) {
					statusMessage = STATUS_MESSAGES.APPLYING_STYLES;
				} else {
					statusMessage = STATUS_MESSAGES.GENERATING_FINAL;
				}

				// Send progress update with status and timing to main thread
				self.postMessage({
					type: 'pdfProgress',
					progress: percentage,
					status: statusMessage,
					startTime: startTime,
					elapsedTime: elapsedTime,
				});
			};

			// Get the PDF as a blob with progress tracking
			pdfDocGenerator.getBlob(
				(blob) => {
					console.log('PDF Generation completed:', blob);

					const finalTime = performance.now();
					const totalElapsedTime = finalTime - startTime;

					// Send finalizing status
					self.postMessage({
						type: 'pdfStatus',
						status: STATUS_MESSAGES.FINALIZING,
						progress: 95,
						startTime: startTime,
						elapsedTime: totalElapsedTime,
					});

					// Send the final blob back to the main thread
					setTimeout(() => {
						self.postMessage({
							type: 'pdfGenerated',
							blob: blob,
							progress: 100,
							status: STATUS_MESSAGES.COMPLETED,
							startTime: startTime,
							elapsedTime: totalElapsedTime,
							totalTime: totalElapsedTime,
						});
					}, 200);
				},
				{ progressCallback: progressCallback }
			);
		} catch (error) {
			console.error('Error generating PDF in worker:', error);
			const errorTime = performance.now();
			self.postMessage({
				type: 'pdfError',
				error: error.message,
				status: 'Error occurred during PDF generation',
				startTime: startTime,
				elapsedTime: errorTime - startTime,
			});
		}
	}
};

console.log('PDF Web Worker initialized.');
