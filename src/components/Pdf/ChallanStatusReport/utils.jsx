import { FZL_LOGO } from '@/assets/img/base64';
import { format } from 'date-fns';
import { useAccess } from '@/hooks';

import { DEFAULT_FONT_SIZE } from '../ui';
import { company } from '../utils';

const renderCashOrLC = (is_cash, is_sample, is_bill, is_only_value) => {
	let value = is_cash == 1 ? 'Cash' : 'LC';
	let sample_bill = [];

	if (is_sample === 1) sample_bill.push('Sample');
	if (is_bill === 1) sample_bill.push('Bill');

	if (sample_bill.length > 0) value += ` (${sample_bill.join(', ')})`;

	if (is_only_value) return value;

	return value;
};

export const getPdfHeader = (data) => {
	return [
		[
			{
				image: FZL_LOGO.src,
				width: 70,
				height: 40,
				alignment: 'left',
			},
			{
				text: [
					`${company.address}\n`,
					`${company.email}\n`,
					`${company.phone}\n`,
					`${company.bin}, ${company.tax}\n`,
				],
				alignment: 'left',
				margin: [40, 0, 0, 0],
			},
			{
				colSpan: 2,
				text: [
					{
						text: 'Challan Status Report\n',
						fontSize: DEFAULT_FONT_SIZE + 4,
						bold: true,
					},

					`Order No.: ${data[0].order_number} \n`,
					`Challan Date: ${format(new Date(data[0].created_at), 'dd-MM-yyyy')} \n`,
				],
				alignment: 'right',
			},
			'',
		],
	];
};

export const getPageHeader = (order_info) => {
	const haveAccess = useAccess('order__details');

	const order_number =
		order_info.is_sample === 1
			? order_info.order_number + ' (S)'
			: order_info.order_number;

	// const lc_or_cash =
	// 	order_info.is_cash === 1
	// 		? `Cash${order_info?.is_bill === 1 && ' (Bill)'}`
	// 		: 'LC';

	const lc_or_cash = renderCashOrLC(
		order_info.is_cash,
		order_info.is_sample,
		order_info.is_bill,
		true
	);
	return [
		// CompanyAndORDER
		[
			{
				image: FZL_LOGO.src,
				width: 70,
				height: 40,
				alignment: 'left',
			},
			{
				text: [
					`${company.address}\n`,
					`${company.email}\n`,
					`${company.phone}\n`,
					`${company.bin}, ${company.tax}\n`,
				],
				alignment: 'left',
				margin: [40, 0, 0, 0],
			},
			{
				colSpan: 2,
				text: [
					{
						text: 'Order Sheet\n',
						fontSize: DEFAULT_FONT_SIZE + 4,
						bold: true,
					},
					`O/N: ${order_number} ${order_info.revisions > 0 ? `Rev ${order_info.revisions}` : ''} \n`,
					`Date: ${order_info?.created_at ? format(new Date(order_info?.created_at), 'dd-MM-yyyy') : ''}\n`,
					`PI No.: ${order_info?.pi_numbers ? order_info?.pi_numbers.join(', ') : '---'}\n`,
				],
				alignment: 'right',
			},
			'',
		],
		[
			// { text: 'LC/Cash', bold: true },
			// ...(haveAccess.includes('show_cash_bill_lc')
			// 	? [lc_or_cash]
			// 	: ['- / -']),
			{ text: 'Buyer', bold: true },
			order_info.buyer_name,
			{ text: 'Marketing', bold: true },
			order_info.marketing_name,
		],
		[
			{ text: 'Party', bold: true },
			order_info.party_name,
			{ text: 'Priority', bold: true },
			(order_info.marketing_priority || '-') +
				' / ' +
				(order_info.factory_priority || '-'),
		],

		[{ text: 'Factory', bold: true }, order_info.factory_name, '', ''],
		[
			{ text: 'Address', bold: true },
			{ colSpan: 3, text: order_info.factory_address },
			'',
			'',
		],
	];
};

export const getPageFooter = ({ currentPage, pageCount }) => {
	return {
		widths: ['*', '*', '*'],
		body: [
			[
				{
					text: 'SNO',
					alignment: 'center',
					border: [false, true, false, false],
				},
				{
					text: '',
					alignment: 'center',
					border: [false, false, false, false],
				},
				{
					text: 'Managing Director',
					alignment: 'center',
					border: [false, true, false, false],
				},
			],
			[
				{
					colSpan: 3,
					text: `Page ${currentPage} of ${pageCount}`,
					alignment: 'center',
					border: [false, false, false, false],
				},
				'',
				'',
			],
		],
	};
};

const getItem = ({
	zipper_number_name,
	item_name,
	nylon_stopper_name,
	is_multi_color = 0,
}) => {
	let name = '#' + zipper_number_name + ' ';

	if (item_name === 'Nylon') {
		name += item_name + ' - ' + nylon_stopper_name;
	} else {
		name += item_name;
	}

	if (is_multi_color === 1) {
		name += ' (Multi Color)';
	}

	return name;
};

const getLogo = ({ logo_type_name, is_logo_body = 0, is_logo_puller = 0 }) => {
	let logo = `Logo: ${logo_type_name}`;

	if (is_logo_body === 1 && is_logo_puller === 1) {
		logo += ' (Body, Puller)';
	} else if (is_logo_body === 1) {
		logo += ' (Body)';
	} else if (is_logo_puller === 1) {
		logo += ' (Puller)';
	}

	return logo;
};

export const TableHeader = ({ entry, uniqueSizes, special_req_info, i }) => {
	const {
		item_name,
		nylon_stopper_name,
		end_type_name,
		hand_name,
		zipper_number_name,
		lock_type_name,
		teeth_color_name,
		teeth_type_name,
		puller_type_name,
		puller_color_name: slider_color_name,
		logo_type_name,
		top_stopper_name,
		bottom_stopper_name,
		is_waterproof,

		// new
		coloring_type_name,
		slider_name: slider_material,
		slider_body_shape_name,
		slider_link_name,

		// is logo
		is_logo_body,
		is_logo_puller,

		// unit size
		is_cm,
		is_meter,
		is_inch,
		is_multi_color,

		order_type,
		slider_provided,

		description,
	} = entry;

	let tape = [
		item_name
			? getItem({
					zipper_number_name,
					item_name,
					nylon_stopper_name,
					is_multi_color,
				})
			: '',
		order_type === 'tape' ? 'Long Chain' : '',
		end_type_name
			? end_type_name === 'Open End' ||
				end_type_name === '2 Way - Open End'
				? end_type_name + ' - ' + hand_name
				: end_type_name
			: '',
		teeth_color_name
			? `Teeth: ${teeth_type_name ? teeth_type_name + ' - ' : ''} ${teeth_color_name} Color`
			: '',
		is_waterproof ? 'Waterproof' : '',
	];

	let slider = [
		puller_type_name ? `${puller_type_name} Puller` : '',
		lock_type_name,
		coloring_type_name,
		slider_color_name ? `Slider: ${slider_color_name}` : '',
		slider_material,
		slider_body_shape_name,
		slider_link_name,
		logo_type_name
			? getLogo({ logo_type_name, is_logo_body, is_logo_puller })
			: '',
		top_stopper_name ? `Top Stopper: ${top_stopper_name}` : '',
		bottom_stopper_name ? `Bottom Stopper: ${bottom_stopper_name}` : '',
		slider_provided
			.split('_')
			.map((word) => word.charAt(0).toUpperCase() + word.slice(1))
			.join(' '),
	];

	return [
		[
			{
				text: `Tape #${i + 1}`,
				// style: 'tableHeader',
				alignment: 'Center',
			},
			{
				colSpan: uniqueSizes.length + 2,
				text: [tape.filter(Boolean).join(' / ')],
				// style: 'tableHeader',
			},
			...Array.from({ length: uniqueSizes.length + 1 }, () => ''),
		],
		...(order_type === 'tape'
			? []
			: [
					[
						{
							text: `Slider #${i + 1}`,
							// style: 'tableHeader',
							alignment: 'Center',
						},
						{
							colSpan: uniqueSizes.length + 2,
							text: [slider.filter(Boolean).join(' / ')],
							// style: 'tableHeader',
						},
						...Array.from(
							{ length: uniqueSizes.length + 1 },
							() => ''
						),
					],
				]),
		...(special_req_info?.length > 0 || description
			? [
					[
						{
							text: `Others #${i + 1}`,
							// style: 'tableHeader',
							alignment: 'Center',
						},
						{
							colSpan: uniqueSizes.length + 2,
							text: [
								special_req_info?.length > 0
									? `${special_req_info?.join(', ')}`
									: '',
								special_req_info?.length > 0 && description
									? ' / '
									: '',

								description ? `(${description})` : '',
							],
							// style: 'tableHeader',
						},
						...Array.from(
							{ length: uniqueSizes.length + 1 },
							() => ''
						),
					],
				]
			: []),
		[
			{
				text: 'Style',
				style: 'tableFooter',
			},

			// * depending on order_type show quantity or color/size //
			{
				text:
					order_type === 'slider'
						? 'Quantity'
						: order_type === 'tape'
							? 'Color / Size(M)'
							: is_inch
								? 'Color / Size(IN)'
								: 'Color / Size(CM)',
				style: 'tableFooter',
			},

			...uniqueSizes.map((size) => ({
				text: size ? size : '-',
				style: 'tableFooter',
				alignment: 'right',
			})),

			{
				text: 'Total',
				style: 'tableFooter',
				alignment: 'right',
			},
		],
	];
};

export const TableFooter = ({ total_quantity, total_value }) => [
	{
		colSpan: 3,
		text: `Total QTY: ${total_quantity}`,
		style: 'tableFooter',
		alignment: 'right',
	},
	'',
	'',
	{
		colSpan: 2,
		text: `US $${total_value}`,
		style: 'tableFooter',
		alignment: 'right',
	},
	'',
];

// * function to get similar garment_wash
export const getGarmentInfo = (order_description, garments) => {
	if (order_description?.garments_wash) {
		const parsedObject =
			typeof order_description?.garments_wash === 'string'
				? JSON.parse(order_description?.garments_wash)
				: order_description?.garments_wash;

		const matchingLabels = garments
			?.filter((item) => parsedObject.values.includes(item.value)) // Filter by matching value
			.map((item) => item.label);
		return matchingLabels;
	} else {
		return [];
	}
};

// * function to get similar Special Requirement
export const getSpecialReqInfo = (order_description, sr) => {
	if (order_description?.special_requirement) {
		const parsedObject =
			typeof order_description?.special_requirement === 'string'
				? JSON.parse(order_description?.special_requirement)
				: order_description?.special_requirement;

		const matchingLabels = sr
			?.filter((item) => parsedObject.values.includes(item.value)) // Filter by matching value
			.map((item) => item.label);
		return matchingLabels;
	} else {
		return [];
	}
};

// * function to calculate grand total
export const grandTotal = (total_entries) => {
	let total = 0;
	total_entries?.map((item) => {
		total += item.order_entry.reduce((acc, item) => {
			acc += item?.quantity;

			return acc;
		}, 0);
	});

	return total;
};

// * function to chunk array
export const chunkArray = (array, chunkSize) => {
	let chunks = [];
	for (let i = 0; i < array.length; i += chunkSize) {
		let chunk = array.slice(i, i + chunkSize);

		// * here we are checking if the length of the chunk is less than the chunk size
		if (
			// i > 0 && // * 1st chunk length might be less than the chunk size so this condition is not required
			chunk.length < chunkSize
		)
			chunk = [...chunk, ...Array(chunkSize - chunk.length).fill(0)];

		chunks.push(chunk);
	}
	return chunks;
};
