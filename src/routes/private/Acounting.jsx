import { lazy } from 'react';

const CostCenter = lazy(() => import('@/pages/Accounting/CostCenter'));
const Currency = lazy(() => import('@/pages/Accounting/Currency'));
const FiscalYear = lazy(() => import('@/pages/Accounting/FiscalYear'));
const Group = lazy(() => import('@/pages/Accounting/Group'));
const Head = lazy(() => import('@/pages/Accounting/Head'));
const Ledger = lazy(() => import('@/pages/Accounting/Ledger'));
const Voucher = lazy(() => import('@/pages/Accounting/Voucher'));
const VoucherEntry = lazy(() => import('@/pages/Accounting/Voucher/Entry'));
const VoucherDetails = lazy(() => import('@/pages/Accounting/Voucher/Details'));
const NeedToAccept = lazy(() => import('@/pages/Accounting/NeedToAccept'));
export const AccountingRoutes = [
	{
		name: 'Accounting',
		children: [
			{
				name: 'Need To Accept',
				path: '/accounting/need-to-accept',
				element: <NeedToAccept />,
				page_name: 'accounting__need_to_accept',
				actions: ['read', 'create', 'update', 'delete'],
			},
			{
				name: 'Voucher',
				path: '/accounting/voucher',
				element: <Voucher />,
				page_name: 'accounting__voucher',
				actions: ['read', 'create', 'update', 'delete'],
			},
			{
				name: 'Voucher Entry',
				path: '/accounting/voucher/entry',
				element: <VoucherEntry />,
				page_name: 'accounting__voucher_entry',
				hidden: true,
				actions: ['read', 'create', 'update', 'delete'],
			},
			{
				name: 'Voucher Update',
				path: '/accounting/voucher/:uuid/update',
				element: <VoucherEntry />,
				page_name: 'accounting__voucher_update',
				hidden: true,
				actions: ['read', 'create', 'update', 'delete'],
			},
			{
				name: 'Voucher Details',
				path: '/accounting/voucher/:uuid/details',
				element: <VoucherDetails />,
				page_name: 'accounting__voucher_details',
				hidden: true,
				actions: ['read', 'create', 'update', 'delete'],
			},
			{
				name: 'Cost Center',
				path: '/accounting/cost-center',
				element: <CostCenter />,
				page_name: 'accounting__cost_center',
				actions: ['read', 'create', 'update', 'delete'],
			},
			{
				name: 'Ledger',
				path: '/accounting/ledger',
				element: <Ledger />,
				page_name: 'accounting__ledger',
				actions: ['read', 'create', 'update', 'delete'],
			},
			{
				name: 'Group',
				path: '/accounting/group',
				element: <Group />,
				page_name: 'accounting__group',
				actions: ['read', 'create', 'update', 'delete'],
			},
			{
				name: 'Head',
				path: '/accounting/head',
				element: <Head />,
				page_name: 'accounting__head',
				actions: ['read', 'create', 'update', 'delete'],
			},

			{
				name: 'Fiscal Year',
				path: '/accounting/fiscal-year',
				element: <FiscalYear />,
				page_name: 'accounting__fiscal_year',
				actions: ['read', 'create', 'update', 'delete'],
			},
			{
				name: 'Currency',
				path: '/accounting/currency',
				element: <Currency />,
				page_name: 'accounting__currency',
				actions: ['read', 'create', 'update', 'delete'],
			},
			{
				name: '',
				path: '/accounting/currency',
				element: <Currency />,
				page_name: 'accounting__currency',
				actions: ['read', 'create', 'update', 'delete'],
			},
		],
	},
];
