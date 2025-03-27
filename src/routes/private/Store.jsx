import { lazy } from 'react';

const MaterialLog = lazy(() => import('@/pages/Store/Log'));
const MaterialLogAccessories = lazy(
	() => import('@/pages/Store/LogAccessories')
);
const Purchase = lazy(() => import('@/pages/Store/Receive'));
const PurchaseInd = lazy(
	() => import('@/pages/Store/Receive/Details/ByPurchaseDescriptionUUID')
);
const PurchaseEntry = lazy(() => import('@/pages/Store/Receive/Entry'));

const PurchaseAccessories = lazy(
	() => import('@/pages/Store/ReceiveAccessories')
);
const PurchaseIndAccessories = lazy(
	() =>
		import(
			'@/pages/Store/ReceiveAccessories/Details/ByPurchaseDescriptionUUID'
		)
);
const PurchaseEntryAccessories = lazy(
	() => import('@/pages/Store/ReceiveAccessories/Entry')
);

const Section = lazy(() => import('@/pages/Store/Section'));
const StockRm = lazy(() => import('@/pages/Store/StockRm'));
const StockAccessories = lazy(() => import('@/pages/Store/StockAccessories'));
const Test = lazy(() => import('@/pages/Store/Test'));
const MaterialType = lazy(() => import('@/pages/Store/Type'));
// * Purchase
const Vendor = lazy(() => import('@/pages/Store/Vendor'));

export const StoreRoutes = [
	{
		name: 'Store (RM)',
		children: [
			{
				name: 'Stock (RM)',
				path: '/store/stock-rm',
				element: <StockRm />,
				page_name: 'store__stock_rm',
				actions: [
					'create',
					'read',
					'update',
					'delete',
					'click_trx_against_order',
					'click_action',
					'click_booking',
				],
			},
			{
				name: 'Receive (RM)',
				path: '/store/receive-rm',
				element: <Purchase />,
				page_name: 'store__receive_rm',
				actions: ['create', 'read', 'update'],
				disableCollapse: true,
				children: [
					{
						name: 'Details',
						path: '/store/receive-rm/:purchase_description_uuid',
						element: <PurchaseInd />,
						hidden: true,
						page_name: 'store__receive_rm_by_uuid',
						actions: ['create', 'read', 'update'],
					},
					{
						name: 'Entry',
						path: '/store/receive-rm/entry',
						element: <PurchaseEntry />,
						hidden: true,
						page_name: 'store__receive_rm_entry',
						actions: ['create', 'read', 'update'],
					},
					{
						name: 'Entry',
						path: '/store/receive-rm/:purchase_description_uuid/update',
						element: <PurchaseEntry />,
						hidden: true,
						page_name: 'store__receive_rm_update',
						actions: ['create', 'read', 'update'],
					},
				],
			},
			{
				name: 'Section',
				path: '/store-rm/section',
				element: <Section />,
				page_name: 'store__rm_section',
				actions: ['create', 'read', 'update', 'delete'],
			},
			{
				name: 'Material Type',
				path: '/store-rm/type',
				element: <MaterialType />,
				page_name: 'store__rm_type',
				actions: ['create', 'read', 'update', 'delete'],
			},
			{
				name: 'Vendor',
				path: '/store-rm/vendor',
				element: <Vendor />,
				page_name: 'store__rm_vendor',
				actions: ['create', 'read', 'update', 'delete'],
			},
			{
				name: 'Log',
				path: '/store-rm/log',
				element: <MaterialLog />,
				page_name: 'store__rm_log',
				actions: [
					'read',
					'update_log',
					'delete_log',
					'update_log_against_order',
					'delete_log_against_order',
					'update_booking',
					'delete_booking',
					'click_trx_against_order',
					'click_action',
				],
			},
			{
				name: 'Test',
				path: '/store-rm/test',
				element: <Test />,
				page_name: 'store__rm_test',
				actions: ['read'],
			},
		],
	},
	{
		name: 'Store (Accessories)',
		children: [
			{
				name: 'Stock (Accessories)',
				path: '/store/stock-accessories',
				element: <StockAccessories />,
				page_name: 'store__stock_accessories',
				actions: [
					'create',
					'read',
					'update',
					'delete',
					'click_trx_against_order',
					'click_action',
					'click_booking',
				],
			},

			{
				name: 'Receive (Accessories)',
				path: '/store/receive-accessories',
				element: <PurchaseAccessories />,
				page_name: 'store__receive_accessories',
				actions: ['create', 'read', 'update'],
				disableCollapse: true,
				children: [
					{
						name: 'Details',
						path: '/store/receive-accessories/:purchase_description_uuid',
						element: <PurchaseIndAccessories />,
						hidden: true,
						page_name: 'store__receive_accessories_by_uuid',
						actions: ['create', 'read', 'update'],
					},
					{
						name: 'Entry',
						path: '/store/receive-accessories/entry',
						element: <PurchaseEntryAccessories />,
						hidden: true,
						page_name: 'store__receive_accessories_entry',
						actions: ['create', 'read', 'update'],
					},
					{
						name: 'Entry',
						path: '/store/receive-accessories/:purchase_description_uuid/update',
						element: <PurchaseEntryAccessories />,
						hidden: true,
						page_name: 'store__receive_accessories_update',
						actions: ['create', 'read', 'update'],
					},
				],
			},
			{
				name: 'Section',
				path: '/store-accessories/section',
				element: <Section />,
				page_name: 'store__accessories_section',
				actions: ['create', 'read', 'update', 'delete'],
			},
			{
				name: 'Material Type',
				path: '/store-accessories/type',
				element: <MaterialType />,
				page_name: 'store__accessories_type',
				actions: ['create', 'read', 'update', 'delete'],
			},
			{
				name: 'Vendor',
				path: '/store-accessories/vendor',
				element: <Vendor />,
				page_name: 'store__accessories_vendor',
				actions: ['create', 'read', 'update', 'delete'],
			},

			{
				name: 'Log',
				path: '/store-accessories/log',
				element: <MaterialLogAccessories />,
				page_name: 'store__accessories_log',
				actions: [
					'read',
					'update_log',
					'delete_log',
					'update_log_against_order',
					'delete_log_against_order',
					'update_booking',
					'delete_booking',
					'click_trx_against_order',
					'click_action',
				],
			},
			{
				name: 'Test',
				path: '/store-accessories/test',
				element: <Test />,
				page_name: 'store__accessories_test',
				actions: ['read'],
			},
		],
	},
];
