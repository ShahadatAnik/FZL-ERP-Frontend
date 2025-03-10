import { lazy } from 'react';

const DailyChallan = lazy(() => import('@/pages/Report/DailyChallan'));

const ProductionStatement = lazy(
	() => import('@/pages/Report/ProductionStatement')
);
const LCDue = lazy(() => import('@/pages/Report/LC'));
const PIRegister = lazy(() => import('@/pages/Report/PIRegister'));
const PIToBeSubmit = lazy(() => import('@/pages/Report/PIToBeSubmit'));

const OrderStatus = lazy(() => import('@/pages/Report/OrderStatus'));
const ThreadProduction = lazy(
	() => import('@/pages/Report/ThreadProductionStatus')
);
const ThreadProductionOrderWise = lazy(
	() => import('@/pages/Report/ThreadProductionStatusOrderWise')
);
const ZipperProduction = lazy(
	() => import('@/pages/Report/ZipperProductionStatus')
);
const Store = lazy(() => import('@/pages/Report/Store'));
const DailyProduction = lazy(() => import('@/pages/Report/DailyProduction'));
const ApprovedOrders = lazy(() => import('@/pages/Report/ApprovedOrders'));
const Sample = lazy(() => import('@/pages/Report/Sample'));
const Bulk = lazy(() => import('@/pages/Report/Bulk'));
const Orders = lazy(() => import('@/pages/Report/Order'));
const ChallanStatus = lazy(() => import('@/pages/Report/ChallanStatus'));
const OrderTracking = lazy(() => import('@/pages/Report/OrderTracking'));
const OrderSummary = lazy(() => import('@/pages/Report/OrderSummary'));
const DeliveryReport = lazy(() => import('@/pages/Report/DeliveryReport'));
const ThreadDelivery = lazy(() => import('@/pages/Report/ThreadDelivery'));

export const ReportRoutes = [
	{
		name: 'Report',
		children: [
			{
				name: 'Zipper Production',
				path: '/report/zipper-production',
				element: <ZipperProduction />,
				page_name: 'report__zipper_production',
				actions: ['read', 'show_own_orders'],
			},
			{
				name: 'Thread Production (BW)',
				path: '/report/thread-production-batch-wise',
				element: <ThreadProduction />,
				page_name: 'report__thread_production_batch_wise',
				actions: ['read', 'show_own_orders'],
			},
			{
				name: 'Thread Production (OW)',
				path: '/report/thread-production-order-wise',
				element: <ThreadProductionOrderWise />,
				page_name: 'report__thread_production_order_wise',
				actions: ['read', 'show_own_orders'],
			},
			{
				name: 'Daily Challan',
				path: '/report/daily-challan',
				element: <DailyChallan />,
				page_name: 'report__daily_challan',
				actions: ['read', 'show_own_orders'],
			},
			{
				name: 'PI Register',
				path: '/report/pi-register',
				element: <PIRegister />,
				page_name: 'report__pi_register',
				actions: ['read', 'show_own_orders'],
			},
			{
				name: 'PI To Be Submitted',
				path: '/report/pi-to-be-submitted',
				element: <PIToBeSubmit />,
				page_name: 'report__pi_to_be_submitted',
				actions: ['read', 'show_own_orders'],
			},
			{
				name: 'LC Due',
				path: '/report/lc-due',
				element: <LCDue />,
				page_name: 'report__lc_due',
				actions: ['read', 'show_own_orders'],
			},

			{
				name: 'Store',
				path: '/report/store',
				element: <Store />,
				page_name: 'report__store',
				actions: ['read'],
			},
			{
				name: 'Daily Production',
				path: '/report/daily-production',
				element: <DailyProduction />,
				page_name: 'report__daily_production',
				actions: ['read', 'show_own_orders'],
			},
			{
				name: 'Production Statement',
				path: '/report/production-statement',
				element: <ProductionStatement />,
				page_name: 'report__production_statement',
				actions: ['read', 'show_own_orders'],
			},
			{
				name: 'Sample',
				path: '/report/sample',
				element: <Sample />,
				page_name: 'report__sample',
				actions: ['read'],
			},
			{
				name: 'Bulk',
				path: '/report/bulk',
				element: <Bulk />,
				page_name: 'report__bulk',
				actions: ['read', 'show_price_pi', 'show_own_orders'],
			},
			{
				name: 'Orders',
				path: '/report/orders',
				element: <Orders />,
				page_name: 'report__orders',
				actions: ['read', 'show_own_orders'],
			},
			{
				name: 'Order Status',
				path: '/report/order-status',
				element: <OrderStatus />,
				page_name: 'report__order_status',
				actions: ['read', 'show_own_orders', 'show_price'],
			},
			{
				name: 'Approved Orders',
				path: '/report/approved-orders',
				element: <ApprovedOrders />,
				page_name: 'report__approved_orders',
				actions: ['read', 'show_own_orders'],
			},
			{
				name: 'Challan Status',
				path: '/report/challan-status',
				element: <ChallanStatus />,
				page_name: 'report__challan_status',
				actions: ['read', 'show_own_orders'],
			},
			{
				name: 'Order Tracking',
				path: '/report/order-tracking',
				element: <OrderTracking />,
				page_name: 'report__order_tracking',
				actions: ['read'],
			},
			{
				name: 'Order Summary',
				path: '/report/order-summary',
				element: <OrderSummary />,
				page_name: 'report__order_summary',
				actions: ['read', 'show_own_orders'],
			},
			{
				name: 'Delivery Report',
				path: '/report/delivery-report',
				element: <DeliveryReport />,
				page_name: 'report__delivery_report',
				actions: ['read', 'show_price', 'show_own_orders'],
			},
			{
				name: 'Thread Delivery',
				path: '/report/thread-delivery',
				element: <ThreadDelivery />,
				page_name: 'report__thread_delivery',
				actions: ['read', 'show_own_orders'],
			},
		],
	},
];
