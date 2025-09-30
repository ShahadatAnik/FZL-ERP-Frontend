import { useEffect, useState } from 'react';
import {
	useOtherOrder,
	useOtherOrderDescriptionByOrderNumber,
	useOtherOrderPropertiesByBottomStopper,
	useOtherOrderPropertiesByColor,
	useOtherOrderPropertiesByColoringType,
	useOtherOrderPropertiesByEndType,
	useOtherOrderPropertiesByEndUser,
	useOtherOrderPropertiesByGarmentsWash,
	useOtherOrderPropertiesByHand,
	useOtherOrderPropertiesByItem,
	useOtherOrderPropertiesByLightPreference,
	useOtherOrderPropertiesByLockType,
	useOtherOrderPropertiesByLogoType,
	useOtherOrderPropertiesByNylonStopper,
	useOtherOrderPropertiesByPullerType,
	useOtherOrderPropertiesBySlider,
	useOtherOrderPropertiesBySliderBodyShape,
	useOtherOrderPropertiesBySliderLink,
	useOtherOrderPropertiesBySpecialRequirement,
	useOtherOrderPropertiesByTeethType,
	useOtherOrderPropertiesByTopStopper,
	useOtherOrderPropertiesByZipperNumber,
} from '@/state/Other';
import { useParams } from 'react-router';

import {
	CheckBox,
	FormField,
	Input,
	ReactSelect,
	SectionEntryBody,
	StatusButton,
	Textarea,
} from '@/ui';

import { cn } from '@/lib/utils';
import { ORDER_NULL } from '@/util/Schema';

import { provided, sliderSections, types } from '../utils';

export default function Header({
	endType = '',
	setEndType,
	itemType = '',
	setItemType,
	register,
	errors,
	control,
	getValues,
	watch,
	reset,
	orderNo,
	setOrderNo,
	Controller,
	is_logo_body,
	is_logo_puller,
	setType,
	setValue,
}) {
	const { order_number, order_description_uuid } = useParams();

	const isUpdate =
		order_description_uuid !== undefined && order_number !== undefined;

	const [orderDesc, setOrderDesc] = useState('');
	const [refOrder, setRefOrder] = useState({
		value: '',
		label: '',
	});
	const [orderNoDetails, setOrderNoDetails] = useState({});

	const { data: order } = useOtherOrder('page=order_sheet');
	const { data: item } = useOtherOrderPropertiesByItem();
	const { data: zipper_number } = useOtherOrderPropertiesByZipperNumber();
	const { data: end_type } = useOtherOrderPropertiesByEndType();

	// * garments info*//
	const { data: garments_wash } = useOtherOrderPropertiesByGarmentsWash();
	const { data: light_preference } =
		useOtherOrderPropertiesByLightPreference();
	const { data: end_user } = useOtherOrderPropertiesByEndUser();

	//* slider info*//
	const { data: slider_body_shape } =
		useOtherOrderPropertiesBySliderBodyShape();
	const { data: slider_link } = useOtherOrderPropertiesBySliderLink();

	const { data: lock_type } = useOtherOrderPropertiesByLockType();

	//* puller info*//
	const { data: puller_type } = useOtherOrderPropertiesByPullerType();
	const { data: color } = useOtherOrderPropertiesByColor();
	const { data: hand } = useOtherOrderPropertiesByHand();
	const { data: nylon_stop } = useOtherOrderPropertiesByNylonStopper();
	const { data: special_requirement } =
		useOtherOrderPropertiesBySpecialRequirement();
	const { data: coloring_type } = useOtherOrderPropertiesByColoringType();
	const { data: slider } = useOtherOrderPropertiesBySlider();
	const { data: top_stopper } = useOtherOrderPropertiesByTopStopper();
	const { data: bottom_stopper } = useOtherOrderPropertiesByBottomStopper();
	const { data: logo_type } = useOtherOrderPropertiesByLogoType();
	const { data: teeth_type } = useOtherOrderPropertiesByTeethType();

	// * get order details
	const { data: orderDescription } = useOtherOrderDescriptionByOrderNumber(
		refOrder.label
	);

	const [isLogoBody, setIsLogoBody] = useState(
		typeof is_logo_body !== 'boolean' && is_logo_body === 1 ? true : false
	);
	const [isLogoPuller, setIsLogoPuller] = useState(
		typeof is_logo_puller !== 'boolean' && is_logo_puller === 1
			? true
			: false
	);

	const [sp_req, setSpReq] = useState({});
	const [garmentsWash, setGramentsWash] = useState({});

	const revisions = [
		{ value: 0, label: 'Revision 0' },
		{ value: 1, label: 'Revision 1' },
		{ value: 2, label: 'Revision 2' },
		{ value: 3, label: 'Revision 3' },
		{ value: 4, label: 'Revision 4' },
		{ value: 5, label: 'Revision 5' },
	];

	useEffect(() => {
		if (order_description_uuid !== undefined) {
			setSpReq((prev) => ({
				...prev,
				special_req: getValues('special_requirement')
					? getValues('special_requirement')
					: '',
			}));
			setGramentsWash((prev) => ({
				...prev,
				wash: getValues('garments_wash')
					? getValues('garments_wash')
					: '',
			}));
		}
		setIsLogoBody(is_logo_body === 1 ? true : false);
		setIsLogoPuller(is_logo_puller === 1 ? true : false);
	}, [getValues('special_requirement'), is_logo_body, is_logo_puller]);

	let order_Descriptions = orderDescription?.map((item) => {
		return {
			label: item.item_description + ' -> ' + item.order_type,
			value: item.order_description_uuid,
			item,
		};
	});

	const orderInfoUuid = watch('order_info_uuid');

	useEffect(() => {
		if ((isUpdate || refOrder) && order && orderInfoUuid) {
			const x = order.find((item) => item.value === orderInfoUuid);
			setOrderNoDetails(x);
		}
	}, [isUpdate, order, orderInfoUuid, refOrder]);

	return (
		<div className='flex flex-col gap-4'>
			<SectionEntryBody
				title='Item'
				header={
					<div
						className={
							isUpdate
								? 'flex w-full justify-end'
								: 'flex w-full justify-between'
						}
					>
						{!order_number && (
							<div className='flex items-center gap-4'>
								<ReactSelect
									className='w-40'
									placeholder='Select Description'
									options={order}
									value={order?.filter(
										(item) => item.value == refOrder.value
									)}
									onChange={(e) => {
										setRefOrder(e);
									}}
								/>
								<ReactSelect
									className='w-80'
									placeholder='Select Description'
									options={order_Descriptions}
									value={order_Descriptions?.filter(
										(item) => item.value == orderDesc
									)}
									onChange={(e) => {
										setOrderDesc(e.value);
										setType(e.item.order_type);
										setOrderNo(e.item.order_number);
										reset({
											order_entry: [
												{
													index: null,
													style: '',
													color: '',
													size: '',
													quantity: '',
													company_price: 0,
													party_price: 0,
													bleaching: e.item.bleaching,
												},
											],
											...e.item,
										});
									}}
								/>
							</div>
						)}

						<div className='flex items-center gap-4'>
							<div className='my-2 h-8 rounded-md bg-secondary px-1'>
								<CheckBox
									text='text-secondary-content'
									label='is_fashion'
									title='Fashion Zipper'
									{...{ register, errors }}
								/>
							</div>
							{watch('order_type') !== 'slider' && (
								<div className='my-2 h-8 rounded-md bg-secondary px-1'>
									<CheckBox
										text='text-secondary-content'
										label='is_multi_color'
										title='Multi-Color'
										{...{ register, errors }}
									/>
								</div>
							)}

							{watch('order_type') !== 'slider' &&
								item
									?.find(
										(item) => item.value === watch('item')
									)
									?.label?.toLowerCase() === 'nylon' && (
									<div className='my-2 h-8 rounded-md bg-secondary px-1'>
										<CheckBox
											text='text-secondary-content'
											label='is_waterproof'
											title='Waterproof'
											{...{ register, errors }}
										/>
									</div>
								)}

							<div className='my-2 w-28'>
								<FormField
									label='order_type'
									title='Order Type'
									is_title_needed='false'
									errors={errors}
								>
									<Controller
										name={'order_type'}
										control={control}
										render={({ field: { onChange } }) => {
											return (
												<ReactSelect
													placeholder='Select Type'
													options={types}
													value={types?.filter(
														(item) =>
															item.value ==
															getValues(
																'order_type'
															)
													)}
													onChange={(e) => {
														onChange(e.value);
														setType(e.value);
														reset({
															...ORDER_NULL,
															order_type:
																watch(
																	'order_type'
																),
															order_info_uuid:
																watch(
																	'order_info_uuid'
																),
															item: watch('item'),
															nylon_stopper:
																watch(
																	'nylon_stopper'
																),
															zipper_number:
																watch(
																	'zipper_number'
																),
															lock_type:
																watch(
																	'lock_type'
																),
														});
													}}
													isDisabled={isUpdate}
												/>
											);
										}}
									/>
								</FormField>
							</div>
							<div className='my-2 w-28'>
								<FormField
									label='revision_no'
									title='Revision No'
									is_title_needed='false'
									errors={errors}
								>
									<Controller
										name={'revision_no'}
										control={control}
										render={({ field: { onChange } }) => {
											return (
												<ReactSelect
													placeholder='Select Type'
													options={revisions}
													value={revisions?.filter(
														(item) =>
															item.value ==
															getValues(
																'revision_no'
															)
													)}
													onChange={(e) => {
														onChange(e.value);
													}}
													isDisabled={!isUpdate}
												/>
											);
										}}
									/>
								</FormField>
							</div>
						</div>
					</div>
				}
			>
				<div className='grid grid-cols-4 gap-4'>
					<div
						className={cn(
							'grid grid-cols-3 gap-4',
							watch('order_info_uuid')
								? 'col-span-2'
								: 'col-span-3'
						)}
					>
						{/* 1,2,3: O/N, Item, Nylon Stopper(conditional) */}
						<div className='flex flex-col gap-4'>
							<FormField
								label='order_info_uuid'
								title='O/N'
								errors={errors}
							>
								<Controller
									name={'order_info_uuid'}
									control={control}
									render={({ field: { onChange } }) => {
										return (
											<ReactSelect
												placeholder='Select Order'
												options={order}
												value={order?.filter(
													(item) =>
														item.value ==
														getValues(
															'order_info_uuid'
														)
												)}
												onChange={(e) => {
													onChange(e.value);
													setOrderNo(e.label);
													setOrderNoDetails(e);
												}}
												isDisabled={
													order_number !== undefined
												}
											/>
										);
									}}
								/>
							</FormField>
							<FormField
								label='item'
								title='Item'
								errors={errors}
							>
								<Controller
									name={'item'}
									control={control}
									render={({ field: { onChange } }) => {
										return (
											<ReactSelect
												placeholder='Select Item'
												options={item}
												value={item?.filter(
													(item) =>
														item.value ===
														getValues('item')
												)}
												onChange={(e) => {
													onChange(e.value);
													setItemType(e.label);
													if (e.value !== 'nylon') {
														reset({
															...watch(),
															nylon_stopper: null,
														});
													}
												}}
											/>
										);
									}}
								/>
							</FormField>
							{item
								?.find((item) => item.value === watch('item'))
								?.label?.toLowerCase() === 'nylon' && (
								<FormField
									label='nylon_stopper'
									title='nylon_stopper'
									errors={errors}
								>
									{' '}
									<Controller
										name={'nylon_stopper'}
										control={control}
										render={({ field: { onChange } }) => {
											return (
												<ReactSelect
													placeholder='Select nylon stopper'
													options={nylon_stop}
													value={nylon_stop?.filter(
														(item) =>
															item.value ==
															getValues(
																'nylon_stopper'
															)
													)}
													onChange={(e) =>
														onChange(e.value)
													}
												/>
											);
										}}
									/>
								</FormField>
							)}
						</div>

						{/* 4,5,6: Zipper Number, End Type, Hand(conditional) */}
						<div className='flex flex-col gap-4'>
							<FormField
								label='zipper_number'
								title='Zipper Number'
								errors={errors}
							>
								<Controller
									name={'zipper_number'}
									control={control}
									render={({ field: { onChange } }) => {
										return (
											<ReactSelect
												placeholder='Select Zipper Number'
												options={zipper_number}
												value={zipper_number?.filter(
													(zipper_number) =>
														zipper_number.value ==
														getValues(
															'zipper_number'
														)
												)}
												onChange={(e) =>
													onChange(e.value)
												}
											/>
										);
									}}
								/>
							</FormField>

							{/* conditional rendering: checking if order type is full */}
							{watch('order_type') === 'full' && (
								<>
									<FormField
										label='end_type'
										title='End Type'
										errors={errors}
									>
										<Controller
											name={'end_type'}
											control={control}
											render={({
												field: { onChange },
											}) => {
												return (
													<ReactSelect
														placeholder='Select End Type'
														options={end_type}
														value={end_type?.filter(
															(end_type) =>
																end_type.value ==
																getValues(
																	'end_type'
																)
														)}
														onChange={(e) => {
															onChange(e.value);
															setValue(
																'hand',
																null
															);
															setEndType(e.label);
														}}
													/>
												);
											}}
										/>
									</FormField>
									{(end_type?.find(
										(end_type) =>
											end_type.value ==
											getValues('end_type')
									)?.label === 'Open End' ||
										end_type?.find(
											(end_type) =>
												end_type.value ===
												getValues('end_type')
										)?.label === '2 Way - Open End') && (
										<FormField
											label='hand'
											title='Hand'
											errors={errors}
										>
											<Controller
												name={'hand'}
												control={control}
												render={({
													field: { onChange },
												}) => {
													return (
														<ReactSelect
															placeholder='Select Hand'
															options={hand}
															value={hand?.filter(
																(hand) =>
																	hand.value ==
																	getValues(
																		'hand'
																	)
															)}
															onChange={(e) =>
																onChange(
																	e.value
																)
															}
														/>
													);
												}}
											/>
										</FormField>
									)}
								</>
							)}
						</div>

						{/* 7,8: Teeth Type, Teeth Color */}
						{/* conditional rendering: checking if order type is full */}
						{watch('order_type') === 'full' && (
							<>
								<div className='flex flex-col gap-4 text-secondary-content'>
									<FormField
										label='teeth_type'
										title='Teeth Type'
										errors={errors}
									>
										<Controller
											name={'teeth_type'}
											control={control}
											render={({
												field: { onChange },
											}) => {
												return (
													<ReactSelect
														placeholder='Select Teeth Type'
														options={teeth_type}
														value={teeth_type?.filter(
															(teeth_type) =>
																teeth_type.value ==
																getValues(
																	'teeth_type'
																)
														)}
														onChange={(e) =>
															onChange(e.value)
														}
													/>
												);
											}}
										/>
									</FormField>
									<FormField
										label='teeth_color'
										title='Teeth Color'
										errors={errors}
									>
										<Controller
											name={'teeth_color'}
											control={control}
											render={({
												field: { onChange },
											}) => {
												return (
													<ReactSelect
														placeholder='Select Teeth Color'
														options={color}
														value={color?.filter(
															(color) =>
																color.value ==
																getValues(
																	'teeth_color'
																)
														)}
														onChange={(e) =>
															onChange(e.value)
														}
													/>
												);
											}}
										/>
									</FormField>
								</div>
							</>
						)}
					</div>

					{/* Special req & Remarks & Description */}
					<div className='flex flex-col gap-4 text-secondary-content'>
						{watch('order_type') === 'full' && (
							<FormField
								label='special_requirement'
								title='Special Req'
								errors={errors}
							>
								<Controller
									name={'special_requirement'}
									control={control}
									render={({ field: { onChange } }) => {
										return (
											<ReactSelect
												placeholder='Select Multi Requirement'
												options={special_requirement}
												value={special_requirement?.filter(
													(item) =>
														sp_req?.special_req?.includes(
															item.value
														)
												)}
												onChange={(e) => {
													setSpReq((prev) => ({
														...prev,
														special_req: e.map(
															(item) => item.value
														),
													}));
													onChange(
														JSON.stringify({
															values: e.map(
																(item) =>
																	item.value
															),
														})
													);
												}}
												isMulti={true}
											/>
										);
									}}
								/>
							</FormField>
						)}
						<Textarea
							rows={3}
							label='description'
							{...{ register, errors }}
						/>
						<Textarea
							rows={3}
							label='remarks'
							{...{ register, errors }}
						/>
					</div>

					{watch('order_info_uuid') && (
						<div className='rounded-md border bg-accent-foreground p-4 text-sm text-primary'>
							<ul className='flex flex-col gap-2'>
								<li className='flex flex-col gap-2'>
									Buyer
									<span className='rounded-md border bg-secondary-foreground p-2'>
										{orderNoDetails?.buyer_name}
									</span>
								</li>
								<li className='flex flex-col gap-2'>
									Factory
									<span className='rounded-md border bg-secondary-foreground p-2'>
										{orderNoDetails?.factory_name}
									</span>
								</li>
								<li className='flex flex-col gap-2'>
									Marketing
									<span className='rounded-md border bg-secondary-foreground p-2'>
										{orderNoDetails?.marketing_name}
									</span>
								</li>
								<li className='flex flex-col gap-2'>
									Merchandiser
									<span className='rounded-md border bg-secondary-foreground p-2'>
										{orderNoDetails?.merchandiser_name}
									</span>
								</li>
								<li className='flex flex-col gap-2'>
									Party
									<span className='rounded-md border bg-secondary-foreground p-2'>
										{orderNoDetails?.party_name}
									</span>
								</li>
								<li className='flex items-center gap-2'>
									Sample/Bill/Cash:{' '}
									<StatusButton
										size='btn-xs'
										value={orderNoDetails?.is_sample}
									/>
									<StatusButton
										size='btn-xs'
										value={orderNoDetails?.is_bill}
									/>
									<StatusButton
										size='btn-xs'
										value={orderNoDetails?.is_cash}
									/>
								</li>

								<li className='flex items-center gap-2'>
									Cancelled:{' '}
									<StatusButton
										size='btn-xs'
										value={orderNoDetails?.is_cancelled}
									/>
								</li>
							</ul>
						</div>
					)}
				</div>
			</SectionEntryBody>

			{/* Slider */}
			{(watch('order_type') == 'full' ||
				watch('order_type') == 'slider') && (
				<SectionEntryBody
					title='Slider'
					header={
						watch('order_type') === 'full' && (
							<div className='flex items-center gap-4 text-sm'>
								<div className='my-2 w-48'>
									<FormField
										label='slider_provided'
										title='Provided'
										is_title_needed={false}
										errors={errors}
									>
										<Controller
											name={'slider_provided'}
											control={control}
											render={({
												field: { onChange },
											}) => {
												return (
													<ReactSelect
														placeholder='Select provided Type'
														options={provided}
														value={provided?.find(
															(item) =>
																item.value ==
																getValues(
																	'slider_provided'
																)
														)}
														onChange={(e) =>
															onChange(e.value)
														}
													/>
												);
											}}
										/>
									</FormField>
								</div>
							</div>
						)
					}
				>
					{watch('slider_provided') !== 'completely_provided' && (
						<div className='grid grid-cols-3 gap-4'>
							{/* 1,3,4,10: Puller type, coloring type, lock type, starting section */}
							<div className='flex flex-col gap-4 text-secondary-content'>
								<FormField
									label='puller_type'
									title='Puller Type'
									errors={errors}
								>
									<Controller
										name={'puller_type'}
										control={control}
										render={({ field: { onChange } }) => {
											return (
												<ReactSelect
													placeholder='Select Puller Type'
													options={puller_type}
													value={puller_type?.find(
														(puller_type) =>
															puller_type.value ==
															getValues(
																'puller_type'
															)
													)}
													onChange={(e) =>
														onChange(e.value)
													}
												/>
											);
										}}
									/>
								</FormField>

								<FormField
									label='coloring_type'
									title='Coloring Type'
									errors={errors}
								>
									<Controller
										name={'coloring_type'}
										control={control}
										render={({ field: { onChange } }) => {
											return (
												<ReactSelect
													placeholder='Select Coloring Type'
													options={coloring_type}
													value={coloring_type?.find(
														(coloring_type) =>
															coloring_type.value ==
															getValues(
																'coloring_type'
															)
													)}
													onChange={(e) =>
														onChange(e.value)
													}
												/>
											);
										}}
									/>
								</FormField>

								<FormField
									label='lock_type'
									title='Lock Type'
									errors={errors}
								>
									<Controller
										name={'lock_type'}
										control={control}
										render={({ field: { onChange } }) => {
											return (
												<ReactSelect
													placeholder='Select Lock Type'
													options={lock_type}
													value={lock_type?.filter(
														(lock_type) =>
															lock_type.value ==
															getValues(
																'lock_type'
															)
													)}
													onChange={(e) =>
														onChange(e.value)
													}
												/>
											);
										}}
									/>
								</FormField>

								<FormField
									label='slider_starting_section'
									title='Starting Section'
									errors={errors}
								>
									<Controller
										name={'slider_starting_section'}
										control={control}
										render={({ field: { onChange } }) => {
											return (
												<ReactSelect
													placeholder='Select Section'
													options={sliderSections}
													value={sliderSections?.find(
														(sliderSections) =>
															sliderSections.value ==
															getValues(
																'slider_starting_section'
															)
													)}
													onChange={(e) =>
														onChange(e.value)
													}
												/>
											);
										}}
									/>
								</FormField>
							</div>

							{/* 2,5,6,7: slider color, slider material, slider body shape, slider link */}
							<div className='flex flex-col gap-4 text-secondary-content'>
								<FormField
									label='puller_color'
									title='Slider Color'
									errors={errors}
								>
									<Controller
										name={'puller_color'}
										control={control}
										render={({ field: { onChange } }) => {
											return (
												<ReactSelect
													placeholder='Select Puller Color'
													options={color}
													value={color?.find(
														(color) =>
															color.value ==
															getValues(
																'puller_color'
															)
													)}
													onChange={(e) =>
														onChange(e.value)
													}
												/>
											);
										}}
									/>
								</FormField>
								<FormField
									label='slider'
									title='Slider Material'
									errors={errors}
								>
									<Controller
										name={'slider'}
										control={control}
										render={({ field: { onChange } }) => {
											return (
												<ReactSelect
													placeholder='Select Slider'
													options={slider}
													value={slider?.find(
														(slider) =>
															slider.value ==
															getValues('slider')
													)}
													onChange={(e) =>
														onChange(e.value)
													}
												/>
											);
										}}
									/>
								</FormField>
								<FormField
									label='slider_body_shape'
									title='Slider Body Shape'
									errors={errors}
								>
									<Controller
										name={'slider_body_shape'}
										control={control}
										render={({ field: { onChange } }) => {
											return (
												<ReactSelect
													placeholder='Select slider body shape'
													options={slider_body_shape}
													value={slider_body_shape?.find(
														(item) =>
															item.value ==
															getValues(
																'slider_body_shape'
															)
													)}
													onChange={(e) =>
														onChange(e.value)
													}
												/>
											);
										}}
									/>
								</FormField>
								<FormField
									label='slider_link'
									title='Slider Link'
									errors={errors}
								>
									<Controller
										name={'slider_link'}
										control={control}
										render={({ field: { onChange } }) => {
											return (
												<ReactSelect
													placeholder='Select Slider Link'
													options={slider_link}
													value={slider_link?.find(
														(item) =>
															item.value ==
															getValues(
																'slider_link'
															)
													)}
													onChange={(e) =>
														onChange(e.value)
													}
												/>
											);
										}}
									/>
								</FormField>
							</div>

							{/* 8,9,11,12,13: top stopper, bottom stopper, logo type, body logo, puller logo */}
							<div className='flex flex-col gap-4 text-secondary-content'>
								{watch('order_type') === 'full' && (
									<>
										<FormField
											label='top_stopper'
											title='Top Stopper'
											errors={errors}
										>
											<Controller
												name={'top_stopper'}
												control={control}
												render={({
													field: { onChange },
												}) => {
													return (
														<ReactSelect
															placeholder='Select Top Stopper'
															options={
																top_stopper
															}
															value={top_stopper?.find(
																(top_stopper) =>
																	top_stopper.value ==
																	getValues(
																		'top_stopper'
																	)
															)}
															onChange={(e) =>
																onChange(
																	e.value
																)
															}
														/>
													);
												}}
											/>
										</FormField>
										<FormField
											label='bottom_stopper'
											title='Bottom Stopper'
											errors={errors}
										>
											<Controller
												name={'bottom_stopper'}
												control={control}
												render={({
													field: { onChange },
												}) => {
													return (
														<ReactSelect
															placeholder='Select Bottom Stopper'
															options={
																bottom_stopper
															}
															value={bottom_stopper?.find(
																(
																	bottom_stopper
																) =>
																	bottom_stopper.value ==
																	getValues(
																		'bottom_stopper'
																	)
															)}
															onChange={(e) =>
																onChange(
																	e.value
																)
															}
														/>
													);
												}}
											/>
										</FormField>
									</>
								)}
								<FormField
									label='logo_type'
									title='Logo Type'
									errors={errors}
								>
									<Controller
										name={'logo_type'}
										control={control}
										render={({ field: { onChange } }) => {
											return (
												<ReactSelect
													placeholder='Select Logo Type'
													options={logo_type}
													value={logo_type?.find(
														(logo_type) =>
															logo_type.value ==
															getValues(
																'logo_type'
															)
													)}
													onChange={(e) =>
														onChange(e.value)
													}
												/>
											);
										}}
									/>
								</FormField>

								<div className='flex gap-4'>
									<div className='flex items-center'>
										<CheckBox
											label='is_logo_body'
											title='Body Logo'
											{...{ register, errors }}
										/>
									</div>
									<div className='flex items-center'>
										<CheckBox
											label='is_logo_puller'
											title='Puller Logo'
											{...{ register, errors }}
										/>
									</div>
								</div>
							</div>
						</div>
					)}
				</SectionEntryBody>
			)}

			{/* Garments */}
			{watch('order_type') == 'full' && (
				<SectionEntryBody title='Garments'>
					<div className='grid grid-cols-2 gap-4 text-secondary-content'>
						<div className='flex flex-col gap-4'>
							<Input
								label={`garment`}
								{...{ register, errors }}
							/>
							<FormField
								label='light_preference'
								title='Light Preference'
								errors={errors}
							>
								<Controller
									name={'light_preference'}
									control={control}
									render={({ field: { onChange } }) => {
										return (
											<ReactSelect
												placeholder='Select light preference'
												options={light_preference}
												value={light_preference?.find(
													(item) =>
														item.value ==
														getValues(
															'light_preference'
														)
												)}
												onChange={(e) =>
													onChange(e.value)
												}
											/>
										);
									}}
								/>
							</FormField>
							<FormField
								label='end_user'
								title='End User'
								errors={errors}
							>
								<Controller
									name={'end_user'}
									control={control}
									render={({ field: { onChange } }) => {
										return (
											<ReactSelect
												placeholder='Select End User'
												options={end_user}
												value={end_user?.find(
													(item) =>
														item.value ==
														getValues('end_user')
												)}
												onChange={(e) =>
													onChange(e.value)
												}
											/>
										);
									}}
								/>
							</FormField>
						</div>

						<div className='flex flex-col gap-4'>
							<FormField
								label='garments_wash'
								title='Garments Wash'
								errors={errors}
							>
								<Controller
									name={'garments_wash'}
									control={control}
									render={({ field: { onChange } }) => {
										return (
											<ReactSelect
												placeholder='Select Multi Requirement'
												options={garments_wash}
												value={garments_wash?.filter(
													(item) =>
														garmentsWash?.wash?.includes(
															item.value
														)
												)}
												onChange={(e) => {
													setGramentsWash((prev) => ({
														...prev,
														wash: e.map(
															(item) => item.value
														),
													}));
													onChange(
														JSON.stringify({
															values: e.map(
																(item) =>
																	item.value
															),
														})
													);
												}}
												isMulti={true}
											/>
										);
									}}
								/>
							</FormField>

							<Textarea
								rows={3}
								label='garments_remarks'
								title='Remarks'
								{...{ register, errors }}
							/>
						</div>
					</div>
				</SectionEntryBody>
			)}
		</div>
	);
}
