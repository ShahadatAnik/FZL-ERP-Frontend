import threadPDF from '@components/Pdf/ChallanStatusReport/thread';
import zipperPDF from '@components/Pdf/ChallanStatusReport/zipper';

import pdfMake from '@/components/Pdf/pdfMake';
import {
	DEFAULT_FONT_SIZE,
	defaultStyle,
	styles,
	xMargin,
} from '@/components/Pdf/ui';

import { getPageFooter, getPdfHeader } from './utils';

export default function ChallanStatusSheetPdf(data) {
	const headerHeight = 100;
	let footerHeight = 30;

	// * for page break
	let prevChallanNo = null;
	let prevOrderThread = null;

	const isThread =
		data[0]?.item_for === 'thread' || data[0]?.item_for === 'sample_thread';

	const pdfDocGenerator = pdfMake.createPdf({
		pageSize: 'A4',
		pageOrientation: 'portrait',
		pageMargins: [xMargin, headerHeight, xMargin, footerHeight],
		defaultStyle,
		styles,

		header: {
			table: {
				widths: [35, '*', 50, '*'],
				body: getPdfHeader(data),
			},
			layout: 'noBorders',
			margin: [xMargin, 10, xMargin, 0],
		},

		footer: function (currentPage, pageCount) {
			return {
				table: getPageFooter({
					currentPage,
					pageCount,
				}),
				// * layout: "noBorders",
				margin: [xMargin, 2],
				fontSize: DEFAULT_FONT_SIZE - 2,
			};
		},

		content: [
			...(isThread
				? (Array.isArray(data) ? data : []).flatMap((item) => {
						let isPageBrake = false;

						if (
							item?.challan_number !== prevChallanNo &&
							prevChallanNo !== null
						)
							isPageBrake = true;

						prevChallanNo = item?.challan_number;
						return threadPDF(item, isPageBrake);
					})
				: (Array.isArray(data) ? data : []).flatMap((item) => {
						let isPageBrake = false;

						if (
							item?.challan_number !== prevChallanNo &&
							prevChallanNo !== null
						)
							isPageBrake = true;

						prevChallanNo = item?.challan_number;
						return zipperPDF(item, isPageBrake);
					})),

			// ...data?.zipper?.flatMap((item) => {
			// 	let pageBreak = false;

			// 	if (
			// 		item?.order_number !== prevChallanNo &&
			// 		prevChallanNo !== null
			// 	)
			// 		pageBreak = true;

			// 	const order_info = {
			// 		id: item?.id,
			// 		pi_numbers: item?.pi_numbers,
			// 		is_bill: item?.is_bill,
			// 		is_cash: item?.is_cash,
			// 		is_sample: item?.is_sample,
			// 		is_inch: item?.is_inch,
			// 		order_status: item?.order_status,
			// 		order_number: item?.order_number,
			// 		party_name: item?.party_name,
			// 		buyer_name: item?.buyer_name,
			// 		marketing_name: item?.marketing_name,
			// 		merchandiser_name: item?.merchandiser_name,
			// 		factory_name: item?.factory_name,
			// 		factory_address: item?.factory_address,
			// 		user_name: item?.user_name,
			// 		marketing_priority: item?.marketing_priority,
			// 		factory_priority: item?.factory_priority,
			// 		// date: format(new Date(item?.created_at), 'dd/MM/yyyy'),
			// 		revisions: item.revision_no,
			// 		updated_at: item?.updated_at,
			// 		created_at: item?.created_at,
			// 		pageBreak,
			// 	};
			// 	const order_sheet = {
			// 		order_info,
			// 		order_entry: [item],
			// 		garments,
			// 		sr,
			// 	};

			// 	prevChallanNo = item?.order_number;

			// 	return zipperPDF(order_sheet);
			// }),

			// {
			// 	text: 'THREAD ORDER SECTION',
			// 	pageBreak: 'before',
			// 	fontSize: 50,
			// 	bold: true,
			// 	alignment: 'center',
			// },
			// ...data?.thread?.flatMap((item) => {
			// 	let pageBreak = false;

			// 	if (
			// 		item?.order_number !== prevOrderThread &&
			// 		prevOrderThread !== null
			// 	)
			// 		pageBreak = true;

			// 	prevOrderThread = item?.order_number;
			// 	return threadPDF({ ...item, pageBreak });
			// }),
		],
	});

	return pdfDocGenerator;
}
