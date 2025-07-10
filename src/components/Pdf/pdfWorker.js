// pdfWorker.js

// Import pdfmake. You'll need to adjust the path based on your project setup
// For CommonJS/Node-like environments (e.g., if using a build tool like Webpack/Rollup):
// import * as pdfmake from 'pdfmake/build/pdfmake';
// import * as pdfFonts from 'pdfmake/build/vfs_fonts';

// For direct browser use (UMD build - usually not used with bundlers for workers):
// You might need to directly include the scripts if your bundler doesn't handle this well.
// A common approach is to make pdfmake a global in the worker context
// by either importing it directly or making sure it's bundled in.

// The most reliable way for bundlers (Webpack, Rollup, Vite) is usually:
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

// Listen for messages from the main thread
self.onmessage = async (event) => {
	const { type, data } = event.data;

	if (type === 'generatePdf') {
		const { documentDefinition, options } = data; // Receive doc definition and optional options

		try {
			// Create the PDF document
			const pdfDocGenerator = pdfMake.createPdf(documentDefinition);

			// Get the PDF as a blob or data URL
			// Using getBlob() is generally preferred for performance and memory
			pdfDocGenerator.getBlob((blob) => {
				// Send the Blob back to the main thread
				self.postMessage({ type: 'pdfGenerated', blob: blob });
			});

			// Alternatively, for dataURL (less efficient for large PDFs):
			// pdfDocGenerator.getDataUrl((dataUrl) => {
			//     self.postMessage({ type: 'pdfGenerated', dataUrl: dataUrl });
			// });
		} catch (error) {
			console.error('Error generating PDF in worker:', error);
			self.postMessage({ type: 'pdfError', error: error.message });
		}
	}
};

console.log('PDF Web Worker initialized.');
