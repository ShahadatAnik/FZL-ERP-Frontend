import threadPDF from '@components/Pdf/OrderStatement/thread';
import zipperPDF from '@components/Pdf/OrderStatement/zipper';

import pdfMake from '@/components/Pdf/pdfMake';
import {
	DEFAULT_FONT_SIZE,
	defaultStyle,
	styles,
	xMargin,
} from '@/components/Pdf/ui';

import {
	chunkArray,
	getGarmentInfo,
	getPageFooter,
	getPageHeader,
	getPdfHeader,
	getSpecialReqInfo,
	grandTotal,
	TableHeader,
} from './utils';

export default function OrderSheetPdf(data, garments, sr, from, to) {
	const headerHeight = 60;
	let footerHeight = 30;

	// * for page break
	let prevOrderZipper = null;
	let prevOrderThread = null;
	const total = { zipper: 0, tape: 0, slider: 0, thread: 0 };

	const pdfDocGenerator = {
		pageSize: 'A4',
		pageOrientation: 'portrait',
		pageMargins: [xMargin, headerHeight, xMargin, footerHeight],
		defaultStyle,
		styles,

		header: {
			table: {
				widths: [35, '*', 50, '*'],
				body: getPdfHeader(from, to),
			},
			layout: 'noBorders',
			margin: [xMargin, 10, xMargin, 0],
		},

		// footer: function (currentPage, pageCount) {
		// 	return {
		// 		table: getPageFooter({
		// 			currentPage,
		// 			pageCount,
		// 		}),
		// 		// * layout: "noBorders",
		// 		margin: [xMargin, 2],
		// 		fontSize: DEFAULT_FONT_SIZE - 2,
		// 	};
		// },

		content: [
			{
				text: 'ZIPPER ORDER SECTION',
				fontSize: 50,
				bold: true,
				alignment: 'center',
			},

			...(Array.isArray(data?.zipper)
				? data?.zipper?.flatMap((item) => {
						let pageBreak = false;

						if (
							item?.order_number !== prevOrderZipper &&
							prevOrderZipper !== null
						)
							pageBreak = true;

						const order_info = {
							id: item?.id,
							pi_numbers: item?.pi_numbers,
							is_bill: item?.is_bill,
							is_cash: item?.is_cash,
							is_sample: item?.is_sample,
							is_inch: item?.is_inch,
							order_status: item?.order_status,
							order_number: item?.order_number,
							party_name: item?.party_name,
							buyer_name: item?.buyer_name,
							marketing_name: item?.marketing_name,
							merchandiser_name: item?.merchandiser_name,
							factory_name: item?.factory_name,
							factory_address: item?.factory_address,
							user_name: item?.user_name,
							marketing_priority: item?.marketing_priority,
							factory_priority: item?.factory_priority,
							// date: format(new Date(item?.created_at), 'dd/MM/yyyy'),
							revisions: item.revision_no,
							updated_at: item?.updated_at,
							created_at: item?.created_at,
							pageBreak,
						};
						const order_sheet = {
							order_info,
							order_entry: [item],
							garments,
							sr,
						};
						if (item?.order_type === 'full') {
							total.zipper += item?.order_entry.reduce(
								(acc, item) => acc + item.quantity,
								0
							);
						}
						if (item?.order_type === 'tape') {
							total.tape += item?.order_entry?.reduce(
								(acc, item) => acc + item.size,
								0
							);
						}
						if (item?.order_type === 'slider') {
							total.slider += item?.order_entry.reduce(
								(acc, item) => acc + item.quantity,
								0
							);
						}

						prevOrderZipper = item?.order_number;

						return zipperPDF(order_sheet);
					})
				: []),

			{
				text: 'THREAD ORDER SECTION',
				pageBreak: 'before',
				fontSize: 50,
				bold: true,
				alignment: 'center',
			},
			...(Array.isArray(data?.thread)
				? data?.thread?.flatMap((item) => {
						let pageBreak = false;

						if (
							item?.order_number !== prevOrderThread &&
							prevOrderThread !== null
						)
							pageBreak = true;

						prevOrderThread = item?.order_number;

						total.thread +=
							item?.order_info_entry?.length > 0
								? item?.order_info_entry?.reduce(
										(acc, item) =>
											acc + (item.quantity || 0),
										0
									)
								: 0;

						return threadPDF({ ...item, pageBreak });
					})
				: []),
			{
				text: 'TOTAL ZIPPER ORDER QTY: ' + total.zipper + ' PCS',
				pageBreak: 'before',
				fontSize: 20,
				bold: true,
				alignment: 'center',
			},
			{
				text: 'TOTAL TAPE ORDER QTY: ' + total.tape + ' MTR',
				fontSize: 20,
				bold: true,
				alignment: 'center',
			},
			{
				text: 'TOTAL SLIDER ORDER QTY: ' + total.slider + ' PCS',
				fontSize: 20,
				bold: true,
				alignment: 'center',
			},
			{
				text: 'TOTAL THREAD ORDER QTY: ' + total.thread + ' CONES',
				fontSize: 20,
				bold: true,
				alignment: 'center',
			},
		],
	};

	return pdfDocGenerator;
}
