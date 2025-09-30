import { useMemo } from 'react';

import SwitchToggle from '@/ui/Others/SwitchToggle';
import { CustomLink, DateTime, EditDelete, StatusButton } from '@/ui';

import { DEFAULT_COLUMNS } from '@/util/Table/DefaultColumns';

export const BuyerColumns = ({
	handelUpdate,
	handelDelete,
	haveAccess,
	data,
}) => {
	return useMemo(
		() => [
			{
				accessorKey: 'name',
				header: 'Name',
				enableColumnFilter: false,
				cell: (info) => info.getValue(),
			},
			{
				accessorKey: 'short_name',
				header: 'Short Name',
				enableColumnFilter: false,
				cell: (info) => info.getValue(),
			},

			...DEFAULT_COLUMNS({ handelUpdate, handelDelete, haveAccess }),
		],
		[data]
	);
};

export const PropertiesColumns = ({
	handelUpdate,
	handelDelete,
	haveAccess,
	data,
}) => {
	return useMemo(
		() => [
			{
				accessorKey: 'name',
				header: 'Name',
				enableColumnFilter: false,
				cell: (info) => (
					<span className='capitalize'>{info.getValue()}</span>
				),
			},
			{
				accessorKey: 'type',
				header: 'Type',
				enableColumnFilter: false,
				cell: (info) => {
					return (
						<span className='capitalize'>
							{info.getValue().split('_').join(' ')}
						</span>
					);
				},
			},
			{
				accessorKey: 'item_for',
				header: 'Item For',
				enableColumnFilter: false,
				cell: (info) => (
					<span className='capitalize'>
						{info.getValue().split('_').join(' ')}
					</span>
				),
			},
			{
				accessorKey: 'short_name',
				header: 'Short Name',
				enableColumnFilter: false,
				cell: (info) => (
					<span className='capitalize'>{info.getValue()}</span>
				),
			},
			{
				accessorKey: 'order_sheet_name',
				header: 'Order Sheet Name',
				enableColumnFilter: false,
				cell: (info) => (
					<span className='capitalize'>{info.getValue()}</span>
				),
			},

			...DEFAULT_COLUMNS({ handelUpdate, handelDelete, haveAccess }),
		],
		[data]
	);
};

export const PartyColumns = ({
	handelUpdate,
	handelDelete,
	haveAccess,
	data,
}) => {
	return useMemo(
		() => [
			{
				accessorKey: 'name',
				header: 'Name',
				enableColumnFilter: false,
				width: 'w-32',
				cell: (info) => info.getValue(),
			},
			{
				accessorKey: 'short_name',
				header: 'Short Name',
				enableColumnFilter: false,
				cell: (info) => info.getValue(),
			},
			{
				accessorKey: 'address',
				header: 'Address',
				enableColumnFilter: false,
				width: 'w-32',
				cell: (info) => info.getValue(),
			},

			...DEFAULT_COLUMNS({ handelUpdate, handelDelete, haveAccess }),
		],
		[data]
	);
};

export const FactoryColumns = ({
	handelUpdate,
	handelDelete,
	haveAccess,
	data,
}) => {
	return useMemo(
		() => [
			{
				accessorKey: 'name',
				header: 'Name',
				enableColumnFilter: false,
				width: 'w-32',
				cell: (info) => info.getValue(),
			},
			{
				accessorKey: 'party_name',
				header: 'Party Name',
				enableColumnFilter: false,
				width: 'w-32',
				cell: (info) => info.getValue(),
			},
			{
				accessorKey: 'phone',
				header: 'Phone',
				enableColumnFilter: false,
				cell: (info) => info.getValue(),
			},
			{
				accessorKey: 'address',
				header: 'Address',
				enableColumnFilter: false,
				width: 'w-32',
				cell: (info) => info.getValue(),
			},

			...DEFAULT_COLUMNS({ handelUpdate, handelDelete, haveAccess }),
		],
		[data]
	);
};

export const MerchandiserColumns = ({
	handelUpdate,
	handelDelete,
	haveAccess,
	data,
}) => {
	return useMemo(
		() => [
			{
				accessorKey: 'name',
				header: 'Name',
				enableColumnFilter: false,
				width: 'w-32',
				cell: (info) => info.getValue(),
			},
			{
				accessorKey: 'party_name',
				header: 'Party Name',
				enableColumnFilter: false,
				width: 'w-32',
				cell: (info) => info.getValue(),
			},
			{
				accessorKey: 'email',
				header: 'Email',
				enableColumnFilter: false,
				cell: (info) => info.getValue(),
			},
			{
				accessorKey: 'phone',
				header: 'Phone',
				enableColumnFilter: false,
				cell: (info) => info.getValue(),
			},
			{
				accessorKey: 'address',
				header: 'Address',
				enableColumnFilter: false,
				width: 'w-32',
				cell: (info) => info.getValue(),
			},

			...DEFAULT_COLUMNS({ handelUpdate, handelDelete, haveAccess }),
		],
		[data]
	);
};

export const MarketingColumns = ({
	handelUpdate,
	handelDelete,
	haveAccess,
	data,
}) => {
	return useMemo(
		() => [
			{
				accessorKey: 'name',
				header: 'Name',
				enableColumnFilter: false,
				cell: (info) => info.getValue(),
			},
			{
				accessorKey: 'short_name',
				header: 'Short Name',
				enableColumnFilter: false,
				cell: (info) => info.getValue(),
			},
			{
				accessorKey: 'user_designation',
				header: 'Designation',
				enableColumnFilter: false,
				cell: (info) => info.getValue(),
			},

			...DEFAULT_COLUMNS({ handelUpdate, handelDelete, haveAccess }),
		],
		[data]
	);
};

export const InfoColumns = ({
	handelUpdate,
	handelDelete,
	haveAccess,
	data,
	handelSNOFromHeadOfficeStatus,
	handelReceiveByFactoryStatus,
}) => {
	return useMemo(
		() => [
			{
				accessorKey: 'actions',
				header: 'Actions',
				enableColumnFilter: false,
				enableSorting: false,
				hidden:
					!haveAccess.includes('update') &&
					!haveAccess.includes('delete'),
				width: 'w-24',
				cell: (info) => (
					<EditDelete
						idx={info.row.index}
						handelUpdate={handelUpdate}
						handelDelete={handelDelete}
						showUpdate={haveAccess.includes('update')}
						showDelete={haveAccess.includes('delete')}
					/>
				),
			},
			{
				accessorKey: 'order_number',
				header: 'O/N',
				enableColumnFilter: true,
				cell: (info) => {
					return (
						<CustomLink
							label={info.getValue()}
							url={`/order/details/${info.getValue()}`}
							openInNewTab={true}
						/>
					);
				},
			},

			{
				accessorKey: 'sno_from_head_office',
				header: (
					<>
						Send From <br />
						H/O
					</>
				),
				enableColumnFilter: true,
				width: 'w-24',
				cell: (info) => {
					const permission = haveAccess.includes(
						'click_status_sno_from_head_office'
					);

					const {
						sno_from_head_office_time,
						sno_from_head_office_by_name,
					} = info.row.original;

					return (
						<div className='flex flex-col'>
							<SwitchToggle
								disabled={!permission}
								onChange={() => {
									handelSNOFromHeadOfficeStatus(
										info.row.index
									);
								}}
								checked={info.getValue() === true}
							/>
							<DateTime date={sno_from_head_office_time} />
							<span className='text-xs'>
								{sno_from_head_office_by_name}
							</span>
						</div>
					);
				},
			},
			{
				accessorKey: 'receive_by_factory',
				header: (
					<>
						Received By <br />
						Factory
					</>
				),
				enableColumnFilter: true,
				width: 'w-24',
				cell: (info) => {
					const permission = haveAccess.includes(
						'click_status_receive_by_factory'
					);

					const {
						receive_by_factory_time,
						receive_by_factory_by_name,
					} = info.row.original;

					return (
						<div className='flex flex-col'>
							<SwitchToggle
								disabled={
									!permission ||
									!info.row.original.sno_from_head_office
								}
								onChange={() => {
									handelReceiveByFactoryStatus(
										info.row.index
									);
								}}
								checked={info.getValue() === true}
							/>
							<DateTime date={receive_by_factory_time} />
							<span className='text-xs'>
								{receive_by_factory_by_name}
							</span>
						</div>
					);
				},
			},
			{
				accessorFn: (row) => (row.is_cancelled ? 'YES' : 'NO'),
				id: 'is_cancelled',
				header: 'Cancelled',
				enableColumnFilter: false,
				width: 'w-16',
				cell: (info) => (
					<StatusButton
						size='btn-xs'
						value={info.row.original.is_cancelled}
					/>
				),
			},
			{
				accessorKey: 'id',
				header: 'Sample/Bill/Cash',
				enableColumnFilter: false,
				width: 'w-28',
				cell: (info) => {
					const { is_sample, is_bill, is_cash } = info.row.original;
					return (
						// TODO: need to fix bill vs cash
						<div className='flex gap-6'>
							<StatusButton size='btn-xs' value={is_sample} />
							<StatusButton size='btn-xs' value={is_bill} />
							<StatusButton size='btn-xs' value={is_cash} />
						</div>
					);
				},
			},

			{
				accessorKey: 'party_name',
				header: 'Party',
				enableColumnFilter: false,
				width: 'w-32',
				cell: (info) => info.getValue(),
			},
			{
				accessorKey: 'marketing_name',
				header: 'Marketing',
				enableColumnFilter: false,
				width: 'w-32',
				cell: (info) => info.getValue(),
			},
			{
				accessorKey: 'merchandiser_name',
				header: 'Merchandiser',
				enableColumnFilter: false,
				width: 'w-32',
				cell: (info) => info.getValue(),
			},
			{
				accessorKey: 'factory_name',
				header: 'Factory',
				enableColumnFilter: false,
				width: 'w-32',
				cell: (info) => info.getValue(),
			},
			{
				accessorKey: 'buyer_name',
				header: 'Buyer',
				enableColumnFilter: false,
				width: 'w-32',
				cell: (info) => info.getValue(),
			},
			{
				accessorKey: 'marketing_priority',
				header: 'Priority (Mkt/Fac)',
				enableColumnFilter: false,
				cell: (info) => {
					const { marketing_priority, factory_priority } =
						info.row.original;
					return `${marketing_priority}/${factory_priority}`;
				},
			},

			{
				accessorKey: 'remarks',
				header: 'Remarks',
				enableColumnFilter: false,
				width: 'w-32',
				cell: (info) => info.getValue(),
			},
			{
				accessorKey: 'created_by_name',
				header: 'Created By',
				enableColumnFilter: false,
				width: 'w-32',
				cell: (info) => info.getValue(),
			},
			{
				accessorKey: 'created_at',
				header: 'Created',
				enableColumnFilter: false,
				filterFn: 'isWithinRange',
				cell: (info) => <DateTime date={info.getValue()} />,
			},
			{
				accessorKey: 'updated_at',
				header: 'Updated',
				enableColumnFilter: false,
				cell: (info) => <DateTime date={info.getValue()} />,
			},
		],
		[data]
	);
};

export const DetailsColumns = ({
	handelUpdate,
	haveAccess,
	data,
	handelMarketingCheckedStatus,
}) => {
	return useMemo(
		() => [
			{
				accessorKey: 'actions',
				header: 'Actions',
				enableColumnFilter: false,
				enableSorting: false,
				hidden: !haveAccess.includes('update'),
				cell: (info) => (
					<EditDelete
						idx={info.row.index}
						handelUpdate={handelUpdate}
						showUpdate={haveAccess.includes('update')}
						showDelete={false}
					/>
				),
			},
			{
				accessorKey: 'is_sample',
				header: 'Sample',
				enableColumnFilter: false,
				width: 'w-12',
				cell: (info) => (
					<StatusButton size='btn-xs' value={info.getValue()} />
				),
			},
			{
				accessorKey: 'order_number',
				header: 'O/N',
				enableColumnFilter: true,
				cell: (info) => {
					return (
						<CustomLink
							label={info.getValue()}
							url={`/order/details/${info.getValue()}`}
							openInNewTab={true}
						/>
					);
				},
			},
			{
				accessorKey: 'party_name',
				header: 'Party',
				enableColumnFilter: true,
				width: 'w-36',
				cell: (info) => info.getValue(),
			},

			{
				accessorKey: 'item_description',
				header: 'Item',
				enableColumnFilter: true,
				width: 'w-36',
				cell: (info) => {
					const { order_description_uuid, order_number } =
						info.row.original;
					return (
						<CustomLink
							label={info.getValue()}
							url={`/order/details/${order_number}/${order_description_uuid}`}
							openInNewTab={true}
						/>
					);
				},
			},
			{
				accessorKey: 'order_type',
				header: 'Type',
				enableColumnFilter: false,
			},
			{
				accessorKey: 'is_multi_color',
				header: (
					<>
						Multi <br />
						Color
					</>
				),
				enableColumnFilter: false,
				cell: (info) => (
					<StatusButton size='btn-xs' value={info.getValue()} />
				),
			},
			{
				accessorKey: 'is_fashion',
				header: (
					<>
						Fashion <br />
						Zipper
					</>
				),
				enableColumnFilter: false,
				cell: (info) => (
					<StatusButton size='btn-xs' value={info.getValue()} />
				),
			},
			{
				accessorFn: (row) => {
					if (row.order_type === 'tape') return 'MTR';
					return row.is_inch ? 'INCH' : 'CM';
				},
				id: 'unit',
				header: 'Unit',
				enableColumnFilter: false,
			},
			// ? whats app
			// {
			// 	accessorKey: 'whatsapp_number',
			// 	header: '',
			// 	enableColumnFilter: false,
			// 	enableSorting: false,
			// 	// hidden: !haveAccess.includes('click_whatsapp'),
			// 	width: 'w-8',
			// 	cell: (info) => {
			// 		const { marketing_name } = info.row.original;
			// 		return (
			// 			<WhatsApp
			// 				onClick={() => handleWhatsApp(info.row.index)}
			// 				disabled={marketing_name <= 0 ? true : false}
			// 			/>
			// 		);
			// 	},
			// },
			{
				accessorKey: 'marketing_name',
				header: 'Marketing',
				enableColumnFilter: false,
				width: 'w-32',
				cell: (info) => info.getValue(),
			},
			//? Need to add marketing checked?
			{
				accessorKey: 'is_marketing_checked',
				header: (
					<>
						Marketing <br />
						Checked
					</>
				),
				enableColumnFilter: false,
				cell: (info) => {
					const permission = haveAccess.includes(
						'click_status_marketing_checked'
					);

					const { marketing_checked_at } = info.row.original;

					return (
						<div className='flex flex-col'>
							<SwitchToggle
								disabled={!permission}
								onChange={() => {
									handelMarketingCheckedStatus(
										info.row.index
									);
								}}
								checked={info.getValue() === true}
							/>
							<DateTime date={marketing_checked_at} />
						</div>
					);
				},
			},
			{
				accessorKey: 'buyer_name',
				header: 'Buyer',
				width: 'w-32',
				enableColumnFilter: false,
				cell: (info) => info.getValue(),
			},
			{
				accessorFn: (row) =>
					`${row.swatch_approval_count || 0}/${row.order_entry_count || 0}`,
				id: 'swatch_count',
				header: 'Swatch',
				enableColumnFilter: false,
			},
			{
				accessorFn: (row) =>
					`${row.price_approval_count || 0}/${row.order_entry_count || 0}`,
				id: 'price_approval_count',
				header: (
					<>
						Price <br />
						App.
					</>
				),
				enableColumnFilter: false,
			},
			{
				accessorFn: (row) =>
					`${row.order_number_wise_rank || 0}/${row.order_number_wise_count || 0}`,
				id: 'order_number_wise_rank',
				header: 'Count',
				enableColumnFilter: false,
				width: 'w-12',
			},
			{
				accessorKey: 'remarks',
				header: 'Remarks',
				enableColumnFilter: false,
				width: 'w-32',
				cell: (info) => info.getValue(),
			},
			{
				accessorKey: 'created_by_name',
				header: 'Created By',
				enableColumnFilter: false,
				width: 'w-32',
				cell: (info) => info.getValue(),
			},
			{
				accessorKey: 'order_description_created_at',
				header: 'Created',
				enableColumnFilter: false,
				filterFn: 'isWithinRange',
				cell: (info) => <DateTime date={info.getValue()} />,
			},
			{
				accessorKey: 'order_description_updated_at',
				header: 'Updated',
				enableColumnFilter: false,
				cell: (info) => <DateTime date={info.getValue()} />,
			},
		],
		[data]
	);
};

export const SettingsColumns = ({
	haveAccess,
	data,
	handelSNOFromHeadOfficeStatus,
	handelReceiveByFactoryStatus,
	handelProductionPausedStatus,
	handelSkipSliderProduction,
	handelCancel,
}) => {
	return useMemo(
		() => [
			{
				accessorKey: 'order_number',
				header: 'O/N',
				enableColumnFilter: true,
				cell: (info) => {
					return (
						<CustomLink
							label={info.getValue()}
							url={`/order/details/${info.getValue()}`}
							openInNewTab={true}
						/>
					);
				},
			},

			{
				accessorKey: 'sno_from_head_office',
				header: (
					<>
						Send From <br />
						H/O
					</>
				),
				enableColumnFilter: true,
				width: 'w-24',
				cell: (info) => {
					const permission = haveAccess.includes(
						'click_status_sno_from_head_office'
					);

					const {
						sno_from_head_office_time,
						sno_from_head_office_by_name,
					} = info.row.original;

					return (
						<div className='flex flex-col'>
							<SwitchToggle
								disabled={!permission}
								onChange={() => {
									handelSNOFromHeadOfficeStatus(
										info.row.index
									);
								}}
								checked={info.getValue() === true}
							/>
							<DateTime date={sno_from_head_office_time} />
							<span className='text-xs'>
								{sno_from_head_office_by_name}
							</span>
						</div>
					);
				},
			},
			{
				accessorKey: 'receive_by_factory',
				header: (
					<>
						Received By <br />
						Factory
					</>
				),
				enableColumnFilter: true,
				width: 'w-24',
				cell: (info) => {
					const permission = haveAccess.includes(
						'click_status_receive_by_factory'
					);

					const {
						receive_by_factory_time,
						receive_by_factory_by_name,
					} = info.row.original;

					return (
						<div className='flex flex-col'>
							<SwitchToggle
								disabled={
									!permission ||
									!info.row.original.sno_from_head_office
								}
								onChange={() => {
									handelReceiveByFactoryStatus(
										info.row.index
									);
								}}
								checked={info.getValue() === true}
							/>
							<DateTime date={receive_by_factory_time} />
							<span className='text-xs'>
								{receive_by_factory_by_name}
							</span>
						</div>
					);
				},
			},
			{
				accessorKey: 'production_pause',
				header: (
					<>
						Prod <br />
						Paused
					</>
				),
				enableColumnFilter: false,
				width: 'w-24',
				cell: (info) => {
					const permission = haveAccess.includes(
						'click_status_production_paused'
					);
					const { production_pause_time, production_pause_by_name } =
						info.row.original;
					return (
						<div className='flex flex-col'>
							<SwitchToggle
								disabled={!permission}
								onChange={() => {
									handelProductionPausedStatus(
										info.row.index
									);
								}}
								checked={info.getValue() === true}
							/>
							<DateTime date={production_pause_time} />
							<span className='text-xs'>
								{production_pause_by_name}
							</span>
						</div>
					);
				},
			},
			{
				accessorKey: 'skip_slider_production',
				header: (
					<>
						Skip Slider <br />
						Production
					</>
				),
				enableColumnFilter: false,
				width: 'w-24',
				cell: (info) => {
					const permission = haveAccess.includes(
						'click_status_skip_slider_production'
					);
					const {
						skip_slider_production_time,
						skip_slider_production_by_name,
					} = info.row.original;
					return (
						<div className='flex flex-col'>
							<SwitchToggle
								disabled={!permission}
								onChange={() => {
									handelSkipSliderProduction(info.row.index);
								}}
								checked={info.getValue() === true}
							/>
							<DateTime date={skip_slider_production_time} />
							<span className='text-xs'>
								{skip_slider_production_by_name}
							</span>
						</div>
					);
				},
			},
			{
				accessorKey: 'is_cancelled',
				header: 'Cancelled',
				enableColumnFilter: false,
				width: 'w-24',
				cell: (info) => {
					const permission = haveAccess.includes(
						'click_status_cancel'
					);
					const { is_cancelled_time, is_cancelled_by_name } =
						info.row.original;
					return (
						<div className='flex flex-col'>
							<SwitchToggle
								disabled={!permission}
								onChange={() => {
									handelCancel(info.row.index);
								}}
								checked={info.getValue() === true}
							/>
							<DateTime date={is_cancelled_time} />
							<span className='text-xs'>
								{is_cancelled_by_name}
							</span>
						</div>
					);
				},
			},
			{
				accessorKey: 'id',
				header: 'Sample/Bill/Cash',
				enableColumnFilter: false,
				width: 'w-28',
				cell: (info) => {
					const { is_sample, is_bill, is_cash } = info.row.original;
					return (
						// TODO: need to fix bill vs cash
						<div className='flex gap-6'>
							<StatusButton size='btn-xs' value={is_sample} />
							<StatusButton size='btn-xs' value={is_bill} />
							<StatusButton size='btn-xs' value={is_cash} />
						</div>
					);
				},
			},

			{
				accessorKey: 'party_name',
				header: 'Party',
				enableColumnFilter: false,
				width: 'w-32',
				cell: (info) => info.getValue(),
			},
			{
				accessorKey: 'marketing_name',
				header: 'Marketing',
				enableColumnFilter: false,
				width: 'w-32',
				cell: (info) => info.getValue(),
			},
			{
				accessorKey: 'merchandiser_name',
				header: 'Merchandiser',
				enableColumnFilter: false,
				width: 'w-32',
				cell: (info) => info.getValue(),
			},
			{
				accessorKey: 'factory_name',
				header: 'Factory',
				enableColumnFilter: false,
				width: 'w-32',
				cell: (info) => info.getValue(),
			},
			{
				accessorKey: 'buyer_name',
				header: 'Buyer',
				enableColumnFilter: false,
				width: 'w-32',
				cell: (info) => info.getValue(),
			},
			{
				accessorKey: 'marketing_priority',
				header: 'Priority (Mkt/Fac)',
				enableColumnFilter: false,
				cell: (info) => {
					const { marketing_priority, factory_priority } =
						info.row.original;
					return `${marketing_priority}/${factory_priority}`;
				},
			},

			{
				accessorKey: 'remarks',
				header: 'Remarks',
				enableColumnFilter: false,
				width: 'w-32',
				cell: (info) => info.getValue(),
			},
			{
				accessorKey: 'created_by_name',
				header: 'Created By',
				enableColumnFilter: false,
				width: 'w-32',
				cell: (info) => info.getValue(),
			},
			{
				accessorKey: 'created_at',
				header: 'Created',
				enableColumnFilter: false,
				filterFn: 'isWithinRange',
				cell: (info) => <DateTime date={info.getValue()} />,
			},
			{
				accessorKey: 'updated_at',
				header: 'Updated',
				enableColumnFilter: false,
				cell: (info) => <DateTime date={info.getValue()} />,
			},
		],
		[data]
	);
};
