import {
	DEFAULT_FONT_SIZE,
	tableLayoutStyle,
	xMargin,
} from '@/components/Pdf/ui';
import {
	DEFAULT_LETTER_PAGE,
	getTable,
	TableHeader,
} from '@/components/Pdf/utils';

import { NumToWord } from '@/lib/NumToWord';

import pdfMake from '..';
import { getPageFooter, getPageHeader } from './utils';

export default function Index(data) {
	const isThreadChallan =
		data?.item_for === 'thread' || data?.item_for === 'sample_thread';
	const isTapeChallan = data?.item_for === 'tape';
	const isSliderChallan = data?.item_for === 'slider';
	const { packing_list_numbers } = data;

	const createNode = (fields) => fields.map((field) => getTable(...field));

	const threadNode = createNode([
		['item_description', 'Count'],
		['style', 'Style'],
		['color', 'Color'],
		['size', 'Length', 'right'],
		['quantity', 'Qty(cone)', 'right'],
		['poli_quantity', 'Poly', 'right'],
	]);

	const zipperNode = createNode([
		['item_description', 'Item Description'],
		['style', 'Style'],
		['color', 'Color'],
		['size', 'Size', 'right'],
		['quantity', 'Qty(pcs)', 'right'],
		['poli_quantity', 'Poly', 'right'],
	]);

	const tapeNode = createNode([
		['item_description', 'Item Description'],
		['style', 'Style'],
		['color', 'Color'],
		['size', 'Size', 'right'],
		['quantity', 'Qty(cm)', 'right'],
		['poli_quantity', 'Poly', 'right'],
	]);

	const sliderNode = createNode([
		['item_description', 'Item Description'],
		['style', 'Style'],
		['quantity', 'Qty(cm)', 'right'],
		['poli_quantity', 'Poly', 'right'],
	]);

	const node = isThreadChallan
		? threadNode
		: isTapeChallan
			? tapeNode
			: isSliderChallan
				? sliderNode
				: zipperNode;

	const headerHeight = 220;
	const footerHeight = 50;
	const { challan_entry } = data;

	const uniqueCounts = (challan_entry) =>
		challan_entry?.reduce(
			(acc, item) => {
				acc.itemDescriptions.add(item.item_description);
				acc.styles.add(item.style);
				acc.colors.add(item.color);
				acc.sizes.add(item.size);
				acc.quantity += parseInt(item.quantity, 10) || 0;
				acc.poly_quantity += parseInt(item.poli_quantity, 10) || 0;
				return acc;
			},
			{
				itemDescriptions: new Set(),
				styles: new Set(),
				colors: new Set(),
				sizes: new Set(),
				quantity: 0,
				poly_quantity: 0,
			}
		) || {};

	const grandTotalQuantity = uniqueCounts(challan_entry).quantity;

	const pdfDocGenerator = pdfMake.createPdf({
		...DEFAULT_LETTER_PAGE({
			xMargin,
			headerHeight,
			footerHeight,
		}),

		// * Page Header
		header: {
			table: getPageHeader(data),
			layout: 'noBorders',
			margin: [xMargin, 30, xMargin, 0],
		},
		// * Page Footer
		footer: (currentPage, pageCount) => ({
			table: getPageFooter({
				currentPage,
				pageCount,
			}),
			margin: [xMargin, 2],
			fontSize: DEFAULT_FONT_SIZE - 2,
		}),

		// * Main Table
		content: packing_list_numbers.map((pl, index) => [
			{
				text: `PL NO: ${pl.packing_number}`,
				fontSize: DEFAULT_FONT_SIZE + 2,
				bold: true,
				alignment: 'left',
			},
			{
				table: {
					headerRows: 1,
					widths: isSliderChallan
						? [150, 150, 80, 80]
						: [150, 130, 70, 60, 60, 40],
					body: [
						// * Header
						TableHeader(node),

						// * Body
						...challan_entry
							?.filter(
								(item) =>
									item.packing_number === pl.packing_number
							)
							.map((item) =>
								node.map((nodeItem) => {
									const text =
										nodeItem.field === 'size'
											? `${item[nodeItem.field]} ${
													isThreadChallan ||
													isTapeChallan
														? 'mtr'
														: item.is_inch === 1
															? 'inch'
															: 'cm' || ''
												}`
											: item[nodeItem.field];
									return {
										text,
										style: nodeItem.cellStyle,
										alignment: nodeItem.alignment,
										colSpan: nodeItem.colSpan,
									};
								})
							),

						isSliderChallan
							? [
									{
										text: `Total ${
											uniqueCounts(
												challan_entry?.filter(
													(item) =>
														item.packing_number ===
														pl.packing_number
												)
											).itemDescriptions?.size
										} Desc`,
										bold: true,
										fontSize: DEFAULT_FONT_SIZE + 2,
									},
									{
										text: `${
											uniqueCounts(
												challan_entry?.filter(
													(item) =>
														item.packing_number ===
														pl.packing_number
												)
											)?.styles.size
										} Style`,
										bold: true,
										fontSize: DEFAULT_FONT_SIZE + 2,
									},
									{
										text: uniqueCounts(
											challan_entry?.filter(
												(item) =>
													item.packing_number ===
													pl.packing_number
											)
										)?.quantity,
										bold: true,
										alignment: 'right',
										fontSize: DEFAULT_FONT_SIZE + 2,
									},
									{
										text: uniqueCounts(
											challan_entry?.filter(
												(item) =>
													item.packing_number ===
													pl.packing_number
											)
										).poly_quantity,
										bold: true,
										alignment: 'right',
										fontSize: DEFAULT_FONT_SIZE + 2,
									},
								]
							: [
									{
										text: `Total ${
											uniqueCounts(
												challan_entry?.filter(
													(item) =>
														item.packing_number ===
														pl.packing_number
												)
											).itemDescriptions?.size
										} Desc`,
										bold: true,
										fontSize: DEFAULT_FONT_SIZE + 2,
									},

									{
										text: `${uniqueCounts(challan_entry?.filter((item) => item.packing_number === pl.packing_number)).styles?.size} Style`,
										bold: true,
										fontSize: DEFAULT_FONT_SIZE + 2,
									},
									{
										text: `${uniqueCounts(challan_entry?.filter((item) => item.packing_number === pl.packing_number)).colors?.size} Color`,
										bold: true,
										fontSize: DEFAULT_FONT_SIZE + 2,
									},
									{
										text: `${uniqueCounts(challan_entry?.filter((item) => item.packing_number === pl.packing_number)).sizes?.size} Size`,
										bold: true,
										alignment: 'right',
										fontSize: DEFAULT_FONT_SIZE + 2,
									},
									{
										text: uniqueCounts(
											challan_entry?.filter(
												(item) =>
													item.packing_number ===
													pl.packing_number
											)
										).quantity,
										bold: true,
										alignment: 'right',
										fontSize: DEFAULT_FONT_SIZE + 2,
									},
									{
										text: uniqueCounts(
											challan_entry?.filter(
												(item) =>
													item.packing_number ===
													pl.packing_number
											)
										).poly_quantity,
										bold: true,
										alignment: 'right',
										fontSize: DEFAULT_FONT_SIZE + 2,
									},
								],
					],
				},
			},
			{ text: '\n\n' },
			index === packing_list_numbers.length - 1
				? {
						text: `Grand Total Quantity : ${grandTotalQuantity} ${
							isThreadChallan
								? 'cone'
								: isTapeChallan
									? 'cm'
									: 'pcs'
						}`,
						bold: true,
						fontSize: DEFAULT_FONT_SIZE + 2,
					}
				: null,
			index === packing_list_numbers.length - 1
				? {
						text: `Grand Total Quantity (In Words): ${NumToWord(grandTotalQuantity)} ${
							isThreadChallan
								? 'cone'
								: isTapeChallan
									? 'cm'
									: 'pcs'
						} only`,
						bold: true,
						fontSize: DEFAULT_FONT_SIZE + 2,
					}
				: null,
		]),
	});

	return pdfDocGenerator;
}
