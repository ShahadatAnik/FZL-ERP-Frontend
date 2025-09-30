import { lazy, useEffect, useState } from 'react';
import { useOrderDetailsByStyleForPDF } from '@/state/Order';
import {
	useOtherOrderPropertiesByGarmentsWash,
	useOtherOrderPropertiesBySpecialRequirement,
} from '@/state/Other';
import { Navigate, useParams } from 'react-router';
import { useFetchFunc } from '@/hooks';

import { Suspense } from '@/components/Feedback';
import OrderSheetPdf from '@/components/Pdf/OrderSheet';
import OrderSheetByStyle from '@/components/Pdf/OrderSheetByStyle';
import OrderSheetByStyleV3 from '@/components/Pdf/OrderSheetByStyleV3';

import InformationSkeleton from '../_components/Information/skeleton';

const SingleInformation = lazy(() => import('../_components/Information'));
const Table = lazy(() => import('../_components/Table'));
const Timeline = lazy(() => import('../_components/Timeline'));

const createPDF = (pdfdata, setGetPdfData, PdfGenerator) => {
	const res = PdfGenerator(pdfdata);

	res.getDataUrl((dataUrl) => {
		setGetPdfData(dataUrl);
	});
};

export default function Index({ initial_order, idx }) {
	const { order_number, order_description_uuid } = useParams();
	const isEnabled =
		order_description_uuid !== null && order_description_uuid !== undefined;

	const { data: garments, updateData } =
		useOtherOrderPropertiesByGarmentsWash({
			enabled: isEnabled,
		});
	const { data: orderbystyle } = useOrderDetailsByStyleForPDF(
		order_number,
		order_description_uuid
	);
	const { data: sr } = useOtherOrderPropertiesBySpecialRequirement({
		enabled: isEnabled,
	});

	const [getPdfData, setGetPdfData] = useState(null);
	const [getPdfData2, setGetPdfData2] = useState(null);
	const [getPdfData3, setGetPdfData3] = useState(null);

	const [order, setOrder] = useState(initial_order || []);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);
	const hasInitialOrder = Object.keys(initial_order || []).length > 0;

	useEffect(() => {
		document.title = order_number;
		if (order_description_uuid !== undefined) {
			useFetchFunc(
				`/zipper/order/details/single-order/by/${order_description_uuid}/UUID`,
				setOrder,
				setLoading,
				setError
			);
		} else {
			setLoading(false);
		}
	}, [order_description_uuid]);

	useEffect(() => {
		if (order?.order_entry?.length > 0 && order_description_uuid) {
			const order_info = {
				id: order?.id,
				pi_numbers: order?.pi_numbers,
				is_bill: order?.is_bill,
				is_cash: order?.is_cash,
				is_sample: order?.is_sample,
				is_inch: order?.is_inch,
				order_status: order?.order_status,
				order_number: order?.order_number,
				party_name: order?.party_name,
				buyer_name: order?.buyer_name,
				marketing_name: order?.marketing_name,
				merchandiser_name: order?.merchandiser_name,
				factory_name: order?.factory_name,
				factory_address: order?.factory_address,
				user_name: order?.user_name,
				marketing_priority: order?.marketing_priority,
				factory_priority: order?.factory_priority,
				revisions: order?.revision_no,
				updated_at: order?.updated_at,
				created_at: order?.created_at,
			};

			const order_sheet = {
				order_info,
				order_entry: [order],
				garments,
				sr,
			};

			const orderByStyle = {
				order_info,
				sr,
				garments,
				orders: orderbystyle?.pageData,
			};

			createPDF(order_sheet, setGetPdfData, OrderSheetPdf);
			createPDF(orderByStyle, setGetPdfData2, OrderSheetByStyle);
			createPDF(orderByStyle, setGetPdfData3, OrderSheetByStyleV3);
		}
	}, [order, garments, sr, order_description_uuid]);

	const total = order?.order_entry?.reduce(
		(totals, item) => {
			totals.Quantity += parseFloat(item.quantity) || 0;
			totals.PlanningBatch +=
				parseFloat(item.planning_batch_quantity) || 0;
			totals.piQuantity += parseFloat(item.total_pi_quantity) || 0;
			totals.deliveryQuantity +=
				parseFloat(item.total_delivery_quantity) || 0;
			totals.warehouseQuantity +=
				parseFloat(item.total_warehouse_quantity) || 0;
			totals.rejectQuantity +=
				parseFloat(item.total_reject_quantity) || 0;
			totals.finishingBalance += parseFloat(item.finishing_balance) || 0;
			totals.shortQuantity += parseFloat(item.total_short_quantity) || 0;
			totals.tapeQuantity += parseFloat(item.dying_and_iron_prod) || 0;
			totals.sliderQuantity += parseFloat(item.coloring_prod) || 0;
			totals.companyPrice +=
				parseFloat(
					item.quantity *
						(order?.order_type !== 'tape'
							? item.company_price / 12
							: item.company_price)
				) || 0;
			totals.partyPrice +=
				parseFloat(
					item.quantity *
						(order?.order_type !== 'tape'
							? item.party_price / 12
							: item.party_price)
				) || 0;

			return totals;
		},
		{
			Quantity: 0,
			PlanningBatch: 0,
			piQuantity: 0,
			deliveryQuantity: 0,
			warehouseQuantity: 0,
			rejectQuantity: 0,
			finishingBalance: 0,
			shortQuantity: 0,
			tapeQuantity: 0,
			sliderQuantity: 0,
			companyPrice: 0,
			partyPrice: 0,
		}
	);

	if (loading)
		return <span className='loading loading-dots loading-lg z-50' />;

	if (!order) return <Navigate to='/not-found' />;
	return (
		<div className='space-y-4'>
			{order_description_uuid && (
				<div className='flex gap-6'>
					<iframe
						id='iframeContainer'
						src={getPdfData}
						className='h-[40rem] w-full rounded-md border-none'
					/>
					<iframe
						id='iframeContainer'
						src={getPdfData2}
						className='h-[40rem] w-full rounded-md border-none'
					/>
				</div>
			)}

			<Suspense fallback={<InformationSkeleton />}>
				<SingleInformation
					idx={idx}
					order={order}
					updateData={updateData}
					hasInitialOrder={hasInitialOrder}
				/>
			</Suspense>

			<Suspense>
				<Timeline {...order} />
				<Table {...order} index={idx} total={total} />
			</Suspense>
		</div>
	);
}

[
	{
		name: 'Assets',
		children: [
			{
				name: 'Non current assets',
				account_type: 'Assets', //optional
				children: [
					{
						name: 'Dyeing Machinery',
						account_tag: 'Ledger', //optional
						children: [{ name: 'Dyeing Machinery' }],
					},
				],
			},
		],
	},
];
