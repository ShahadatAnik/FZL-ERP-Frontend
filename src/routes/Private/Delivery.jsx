//Packing Lists

// Challan
import ChallanEntry from '@/pages/Delivery/Challan/Entry';
import PackingLists from '@/pages/Delivery/PackingList';
import PackingListsDetails from '@/pages/Delivery/PackingList/Details';
import PackingListsEntry from '@/pages/Delivery/PackingList/Entry';
import Challan from '@pages/Delivery/Challan';
import ChallanDetails from '@pages/Delivery/Challan/Details';
import Log from '@pages/Delivery/Log';
import RM from '@pages/Delivery/RM';

export const DeliveryRoutes = [
	{
		name: 'Delivery',
		children: [
			{
				name: 'Packing List',
				path: '/delivery/packing-list',
				element: <PackingLists />,
				page_name: 'delivery__packing_list',
				actions: [
					'create',
					'read',
					'update',
					'delete',
					'click_receive_status',
				],
			},
			{
				name: 'Packing List Entry',
				path: '/delivery/packing-list/entry',
				element: <PackingListsEntry />,
				page_name: 'delivery__packing_list_entry',
				actions: [
					'create',
					'read',
					'update',
					'delete',
					'click_receive_status',
				],
				hidden: true,
			},

			{
				name: 'Packing List Details',
				path: '/delivery/packing-list/:uuid',
				element: <PackingListsDetails />,
				page_name: 'delivery__packing_list_details',
				actions: [
					'create',
					'read',
					'update',
					'delete',
					'click_receive_status',
				],
				hidden: true,
			},
			{
				name: 'Packing List Update',
				path: '/delivery/packing-list/:uuid/update',
				element: <PackingListsEntry />,
				page_name: 'delivery__packing_list_update',
				actions: [
					'create',
					'read',
					'update',
					'delete',
					'click_receive_status',
				],

				hidden: true,
			},
			{
				name: 'Challan',
				path: '/delivery/challan',
				element: <Challan />,
				page_name: 'delivery__challan',
				actions: [
					'create',
					'read',
					'update',
					'delete',
					'click_gate_pass',
					'click_receive_status',
					'click_gate_pass_override',
					'click_receive_status_override',
				],
			},
			{
				name: 'Challan',
				path: '/delivery/challan/:uuid',
				element: <ChallanDetails />,
				page_name: 'delivery__challan_details',
				actions: [
					'create',
					'read',
					'update',
					'delete',
					'click_receive_status',
				],
				hidden: true,
			},
			{
				name: 'Challan Entry',
				path: '/delivery/challan/entry',
				element: <ChallanEntry />,
				page_name: 'delivery__challan_entry',
				actions: ['create', 'read', 'update', 'delete'],
				hidden: true,
			},
			{
				name: 'Challan Update',
				path: '/delivery/challan/:uuid/update',
				element: <ChallanEntry />,
				page_name: 'delivery__challan_update',
				actions: ['create', 'read', 'update', 'delete'],
				hidden: true,
			},
			{
				name: 'RM',
				path: '/delivery/rm',
				element: <RM />,
				page_name: 'delivery__rm',
				actions: ['create', 'read', 'used', 'delete'],
			},
			{
				name: 'Log',
				path: '/delivery/log',
				element: <Log />,
				page_name: 'delivery__log',
				actions: [
					'create',
					'read',
					'update',
					'delete',
					'click_update_rm_order',
					'click_delete_rm_order',
				],
			},
		],
	},
];
