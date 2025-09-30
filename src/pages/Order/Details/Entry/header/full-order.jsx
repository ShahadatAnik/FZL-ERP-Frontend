import { useEffect, useState } from 'react';
import {
	useOtherOrder,
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
	Textarea,
} from '@/ui';

import { ORDER_NULL } from '@/util/Schema';

import { provided, sliderSections, types } from './utils';

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
	Controller,
	is_logo_body,
	is_logo_puller,
	setType,
	setValue,
}) {
	const { order_number, order_description_uuid } = useParams();
	const isUpdate =
		order_description_uuid !== undefined && order_number !== undefined;

	const { data: order } = useOtherOrder();
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
	console.log(watch('hand'));

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

	return (
		<div className='flex flex-col gap-4'>
			<SectionEntryBody
				title='Item'
				header={
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
								?.find((item) => item.value === watch('item'))
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
														getValues('order_type')
												)}
												onChange={(e) => {
													onChange(e.value);
													setType(e.value);
													reset({
														...ORDER_NULL,
														order_type: e.value,
													});
												}}
												isDisabled={isUpdate}
											/>
										);
									}}
								/>
							</FormField>
						</div>
					</div>
				}
			>
				<div className='grid grid-cols-1 gap-4 text-secondary-content sm:grid-cols-2 lg:grid-cols-4'>
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
												getValues('order_info_uuid')
										)}
										onChange={(e) => onChange(e.value)}
										isDisabled={order_number !== undefined}
									/>
								);
							}}
						/>
					</FormField>
					<FormField label='item' title='Item' errors={errors}>
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
												item.value === getValues('item')
										)}
										onChange={(e) => {
											onChange(e.value);
											setItemType(e.label);
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
													getValues('nylon_stopper')
											)}
											onChange={(e) => onChange(e.value)}
										/>
									);
								}}
							/>
						</FormField>
					)}
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
												getValues('zipper_number')
										)}
										onChange={(e) => onChange(e.value)}
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
									render={({ field: { onChange } }) => {
										return (
											<ReactSelect
												placeholder='Select End Type'
												options={end_type}
												value={end_type?.filter(
													(end_type) =>
														end_type.value ==
														getValues('end_type')
												)}
												onChange={(e) => {
													onChange(e.value);
													setValue('hand', null);
													setEndType(e.label);
												}}
											/>
										);
									}}
								/>
							</FormField>
							{end_type
								?.find(
									(end_type) =>
										end_type.value == getValues('end_type')
								)
								?.label?.toLowerCase() !== 'close end' && (
								<FormField
									label='hand'
									title='Hand'
									errors={errors}
								>
									<Controller
										name={'hand'}
										control={control}
										render={({ field: { onChange } }) => {
											return (
												<ReactSelect
													placeholder='Select Hand'
													options={hand}
													value={hand?.filter(
														(hand) =>
															hand.value ==
															getValues('hand')
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
						</>
					)}
				</div>

				{/* conditional rendering: checking if order type is full */}
				<div className='grid grid-cols-1 gap-4 text-secondary-content sm:grid-cols-2 lg:grid-cols-4'>
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
												getValues('lock_type')
										)}
										onChange={(e) => onChange(e.value)}
									/>
								);
							}}
						/>
					</FormField>
					{watch('order_type') === 'full' && (
						<>
							<FormField
								label='teeth_type'
								title='Teeth Type'
								errors={errors}
							>
								<Controller
									name={'teeth_type'}
									control={control}
									render={({ field: { onChange } }) => {
										return (
											<ReactSelect
												placeholder='Select Teeth Type'
												options={teeth_type}
												value={teeth_type?.filter(
													(teeth_type) =>
														teeth_type.value ==
														getValues('teeth_type')
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
									render={({ field: { onChange } }) => {
										return (
											<ReactSelect
												placeholder='Select Teeth Color'
												options={color}
												value={color?.filter(
													(color) =>
														color.value ==
														getValues('teeth_color')
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
						</>
					)}
				</div>

				<div className='grid grid-cols-1 gap-4 text-secondary-content sm:grid-cols-2'>
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
			</SectionEntryBody>

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
						<>
							<div className='grid grid-cols-1 gap-4 text-secondary-content sm:grid-cols-2 lg:grid-cols-4'>
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
							</div>

							<div className='grid grid-cols-1 gap-4 text-secondary-content sm:grid-cols-2'>
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

							<div className='grid grid-cols-1 gap-4 text-secondary-content sm:grid-cols-2 lg:grid-cols-4'>
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

								<CheckBox
									label='is_logo_body'
									title='Body Logo'
									{...{ register, errors }}
								/>

								<CheckBox
									label='is_logo_puller'
									title='Puller Logo'
									{...{ register, errors }}
								/>
							</div>
						</>
					)}
				</SectionEntryBody>
			)}

			{watch('order_type') == 'full' && (
				<SectionEntryBody title='Garments'>
					<div className='grid grid-cols-1 gap-4 text-secondary-content sm:grid-cols-2 lg:grid-cols-4'>
						<Input label={`garment`} {...{ register, errors }} />
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
															(item) => item.value
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
											onChange={(e) => onChange(e.value)}
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
											onChange={(e) => onChange(e.value)}
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
				</SectionEntryBody>
			)}
		</div>
	);
}
