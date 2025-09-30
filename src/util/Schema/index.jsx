import * as yup from 'yup';

import {
	BOOLEAN, // default
	BOOLEAN_DEFAULT_VALUE, // default
	BOOLEAN_REQUIRED, // default
	EMAIL, // default
	EMAIL_REQUIRED, // default
	FORTUNE_ZIP_EMAIL_PATTERN, // default
	JSON_STRING, // default
	JSON_STRING_REQUIRED,
	NAME_REQUIRED, // default
	NUMBER, // default
	NUMBER_DOUBLE, // default
	NUMBER_DOUBLE_REQUIRED, // default
	NUMBER_REQUIRED, // default
	ORDER_NUMBER, // default
	ORDER_NUMBER_NOT_REQUIRED, // default
	PASSWORD, // default
	PHONE_NUMBER, // default
	PHONE_NUMBER_REQUIRED, // default
	STRING, // default
	STRING_REQUIRED, // default
	URL_REQUIRED, // default
	UUID, // default
	UUID_FK, // default
	UUID_REQUIRED,
} from './utils';

export {
	BOOLEAN,
	BOOLEAN_REQUIRED,
	EMAIL,
	EMAIL_REQUIRED,
	FORTUNE_ZIP_EMAIL_PATTERN,
	JSON_STRING,
	JSON_STRING_REQUIRED,
	NUMBER,
	NUMBER_DOUBLE,
	NUMBER_DOUBLE_REQUIRED,
	NUMBER_REQUIRED,
	ORDER_NUMBER,
	ORDER_NUMBER_NOT_REQUIRED,
	PASSWORD,
	PHONE_NUMBER,
	PHONE_NUMBER_REQUIRED,
	STRING,
	STRING_REQUIRED,
};

// Library
//User
export const LIBRARY_USER_SCHEMA = {
	name: NAME_REQUIRED,
	email: FORTUNE_ZIP_EMAIL_PATTERN,
	department_designation: STRING_REQUIRED,
	ext: STRING.nullable(),
	phone: PHONE_NUMBER_REQUIRED,
};
export const LIBRARY_USER_NULL = {
	id: null,
	name: '',
	email: '',
	department_designation: null,
	designation_uuid: null,
	ext: '',
	phone: '',
};
// Policy
export const POLICY_SCHEMA = {
	type: STRING_REQUIRED,
	title: STRING_REQUIRED,
	sub_title: STRING_REQUIRED,
	status: NUMBER_REQUIRED,
	url: URL_REQUIRED,
	remarks: STRING.nullable(),
};

export const POLICY_NULL = {
	uuid: null,
	type: '',
	title: '',
	sub_title: '',
	status: 1,
	url: '',
	updated_at: '',
	remarks: '',
};

// Section
export const SECTION_SCHEMA = {
	index: NUMBER_REQUIRED.default(0).min(0, 'Minimum of 0'),
	name: STRING_REQUIRED,
	remarks: STRING.nullable(),
};

export const SECTION_NULL = {
	index: 0,
	uuid: null,
	name: '',
	short_name: '',
	remarks: '',
};

// Buyer
export const BUYER_SCHEMA = {
	name: NAME_REQUIRED,
	short_name: STRING.nullable(),
	remarks: STRING.nullable(),
};

export const BUYER_NULL = {
	uuid: null,
	name: '',
	short_name: '',
	remarks: '',
};

export const PARTY_SCHEMA = {
	name: STRING_REQUIRED,
	short_name: STRING.nullable(),
	address: STRING_REQUIRED,
	remarks: STRING.nullable(),
};

export const PARTY_NULL = {
	uuid: null,
	name: '',
	short_name: '',
	address: '',
	remarks: '',
};

// Merchandiser
export const MERCHANDISER_SCHEMA = {
	party_uuid: STRING_REQUIRED,
	name: STRING_REQUIRED,
	email: EMAIL.nullable(),
	phone: PHONE_NUMBER.nullable().transform((value, originalValue) =>
		originalValue === '' ? null : value
	),
	address: STRING.nullable(),
	remarks: STRING.nullable(),
};

export const MERCHANDISER_NULL = {
	uuid: null,
	party_uuid: null,
	name: '',
	email: '',
	phone: '',
	address: '',
	remarks: '',
};

// Factory
// party_id	name	email	phone	address	created_at	updated_at
export const FACTORY_SCHEMA = {
	party_uuid: STRING_REQUIRED,
	name: STRING_REQUIRED,
	phone: PHONE_NUMBER.nullable().transform((value, originalValue) =>
		originalValue === '' ? null : value
	),
	address: STRING_REQUIRED,
	remarks: STRING.nullable(),
};

export const FACTORY_NULL = {
	uuid: null,
	party_uuid: null,
	name: '',
	phone: '',
	address: '',
	remarks: '',
};

// Marketing
export const MARKETING_SCHEMA = {
	user_uuid: STRING_REQUIRED,
	name: STRING_REQUIRED,
	short_name: STRING.nullable(),
	remarks: STRING.nullable(),
};

export const MARKETING_NULL = {
	uuid: null,
	user_uuid: null,
	name: '',
	short_name: '',
	remarks: '',
};
export const MD_PRICE_SCHEMA = {
	md_price: NUMBER,
};
export const MD_PRICE_NULL = {
	md_price: 0,
};
export const MKT_PRICE_SCHEMA = {
	mkt_party_price: NUMBER,
	mkt_company_price: NUMBER,
};
export const MKT_PRICE_NULL = {
	mkt_party_price: 0,
	mkt_company_price: 0,
};

// Material
export const MATERIAL_SCHEMA = {
	index: NUMBER_REQUIRED.default(0).min(0, 'Minimum of 0'),
	section_uuid: STRING_REQUIRED,
	type_uuid: STRING_REQUIRED,
	name: STRING_REQUIRED,
	unit: STRING_REQUIRED,
	short_name: STRING,
	is_priority_material: BOOLEAN_DEFAULT_VALUE(false),
	is_hidden: BOOLEAN_DEFAULT_VALUE(false),
	average_lead_time: NUMBER.nullable(),
	threshold: NUMBER_DOUBLE,
	description: STRING.nullable(),
	remarks: STRING.nullable(),
};

export const MATERIAL_NULL = {
	index: 0,
	uuid: null,
	name: '',
	short_name: '',
	average_lead_time: 0,
	is_priority_material: false,
	is_hidden: false,
	unit: 'kg',
	threshold: 0,
	description: '',
	section_uuid: null,
	type_uuid: null,
	remarks: '',
};

export const MATERIAL_STOCK_SCHEMA = {
	trx_to: STRING_REQUIRED,
	trx_quantity: NUMBER_DOUBLE_REQUIRED,
	remarks: STRING.nullable(),
};

export const MATERIAL_STOCK_NULL = {
	uuid: null,
	material_uuid: null,
	trx_to: '',
	trx_quantity: '',
	created_by: '',
	remarks: '',
};

export const MATERIAL_TRX_AGAINST_ORDER_SCHEMA = {
	purpose: STRING_REQUIRED.default('general'),
	order_description_uuid: STRING_REQUIRED,
	trx_to: STRING_REQUIRED,
	trx_quantity: NUMBER_DOUBLE_REQUIRED,
	weight: NUMBER_DOUBLE.default(0),
	remarks: STRING.nullable(),
};

export const MATERIAL_TRX_AGAINST_ORDER_NULL = {
	uuid: null,
	purpose: 'general',
	material_uuid: null,
	order_description_uuid: null,
	trx_to: '',
	trx_quantity: '',
	weight: 0,
	created_by: '',
	remarks: '',
};

export const MATERIAL_TRX_AGAINST_ISSUE_SCHEMA = {
	issue_uuid: STRING_REQUIRED,
	trx_to: STRING_REQUIRED,
	trx_quantity: NUMBER_DOUBLE_REQUIRED,
	weight: NUMBER_DOUBLE.default(0),
	remarks: STRING.nullable(),
};

export const MATERIAL_TRX_AGAINST_ISSUE_NULL = {
	issue_uuid: null,
	trx_to: '',
	trx_quantity: '',
	weight: 0,
	remarks: '',
};

export const MATERIAL_BOOKING_SCHEMA = {
	marketing_uuid: STRING_REQUIRED,
	quantity: NUMBER_DOUBLE_REQUIRED.moreThan(0, 'More than 0'),
	remarks: STRING.nullable(),
};

export const MATERIAL_BOOKING_NULL = {
	marketing_uuid: null,
	quantity: '',
	remarks: '',
};

export const SFG_TRANSFER_LOG_SCHEMA = {
	trx_to: STRING_REQUIRED,
	trx_quantity: NUMBER_DOUBLE_REQUIRED,
	remarks: STRING.nullable(),
};

export const SFG_TRANSFER_LOG_NULL = {
	uuid: null,
	order_entry_uuid: null,
	trx_from: '',
	trx_to: '',
	trx_quantity: '',
	created_by: '',
	remarks: '',
};

export const SFG_PRODUCTION_LOG_SCHEMA = {
	production_quantity: NUMBER_REQUIRED.moreThan(0, 'More than 0'),
	production_quantity_in_kg: NUMBER_DOUBLE_REQUIRED.moreThan(
		0,
		'More than 0'
	),
	wastage: NUMBER_DOUBLE.min(0, 'Minimum of 0')
		.nullable()
		.transform((value, originalValue) =>
			String(originalValue).trim() === '' ? 0 : value
		),
	remarks: STRING.nullable(),
};

export const SFG_PRODUCTION_LOG_NULL = {
	uuid: null,
	order_entry_uuid: null,
	section: '',
	used_quantity: null,
	production_quantity: null,
	wastage: null,
	remarks: '',
};

// Purchase
export const PURCHASE_ENTRY_SCHEMA = {
	material_uuid: STRING_REQUIRED,
	quantity: NUMBER_DOUBLE_REQUIRED,
	price: NUMBER_DOUBLE_REQUIRED,
	unit: STRING.nullable(),
	remarks: STRING.nullable(),
};
export const PURCHASE_ENTRY_NULL = {
	material_uuid: null,
	quantity: null,
	price: null,
	unit: null,
	remarks: null,
};

// vendor page
export const VENDOR_SCHEMA = {
	name: STRING_REQUIRED,
	contact_name: STRING.nullable(),
	contact_number: PHONE_NUMBER.nullable(),
	email: EMAIL.nullable(),
	office_address: STRING.nullable(),
	remarks: STRING.nullable(),
};

export const VENDOR_NULL = {
	uuid: null,
	name: '',
	contact_number: '',
	email: '',
	office_address: '',
	remarks: '',
};
// purchase page
export const PURCHASE_SCHEMA = {
	vendor_uuid: NUMBER_REQUIRED,
	is_local: NUMBER_REQUIRED.default(0),
	remarks: STRING.nullable(),
	purchase: yup.array().of(
		yup.object().shape({
			material_uuid: NUMBER_REQUIRED,
			quantity: NUMBER_DOUBLE_REQUIRED,
			price: NUMBER_DOUBLE_REQUIRED,
		})
	),
};

export const PURCHASE_NULL = {
	uuid: null,
	vendor_uuid: null,
	is_local: '',
	remarks: '',
	purchase: [
		{
			material_uuid: null,
			quantity: '',
			price: '',
		},
	],
};

// purchase entry page
export const PURCHASE_RECEIVE_SCHEMA = {
	vendor_uuid: STRING_REQUIRED,
	is_local: NUMBER_REQUIRED.default(0),
	lc_number: STRING.nullable(),
	challan_number: STRING.nullable().when('lc_number', {
		is: (value) => value === null,
		then: (Schema) => Schema.required('Enter Challan Number or LC Number'),
		otherwise: (Schema) => Schema,
	}),
	transport_cost: NUMBER_DOUBLE_REQUIRED.default(0),
	misc_cost: NUMBER_DOUBLE_REQUIRED.default(0),
	currency_uuid: STRING_REQUIRED,
	conversion_rate: NUMBER_DOUBLE_REQUIRED.default(1),

	file: yup
		.mixed()
		.test(
			'is-file',
			'Must be a valid file',
			(value) =>
				value === undefined || // allow no value
				value === null || // allow null
				value instanceof File || // allow File
				(typeof value === 'string' && value.trim() !== '')
		)
		.nullable()
		.optional(),
	remarks: STRING.nullable(),
	purchase: yup.array().of(
		yup.object().shape({
			material_uuid: STRING_REQUIRED,
			quantity: NUMBER_DOUBLE_REQUIRED,
			price: NUMBER_DOUBLE_REQUIRED,
			remarks: STRING.nullable(),
		})
	),
};

export const PURCHASE_RECEIVE_NULL = {
	uuid: null,
	vendor_uuid: null,
	is_local: null,
	lc_number: null,
	challan_number: null,
	transport_cost: 0,
	misc_cost: 0,
	currency_uuid: null,
	conversion_rate: 1,
	file: null,
	remarks: '',
	purchase: [
		{
			purchase_description_uuid: null,
			material_uuid: null,
			quantity: '',
			price: '',
			remarks: '',
		},
	],
};

// Shade Recipe
export const SHADE_RECIPE_SCHEMA = {
	name: STRING_REQUIRED,
	sub_streat: STRING_REQUIRED,
	remarks: STRING.nullable(),
	lab_status: BOOLEAN.default(false),
	bleaching: STRING_REQUIRED.default('non-bleach'),
	shade_recipe_entry: yup.array().of(
		yup.object().shape({
			material_uuid: STRING_REQUIRED,
			quantity: NUMBER_DOUBLE_REQUIRED.moreThan(
				0,
				'Quantity must be more than 0'
			).default(0),
			remarks: STRING.nullable(),
		})
	),
};

export const SHADE_RECIPE_NULL = {
	uuid: null,
	name: '',
	sub_streat: '',
	bleaching: 'non-bleach',
	remarks: '',
	shade_recipe_entry: [
		{
			uuid: null,
			shade_recipe_uuid: null,
			material_uuid: null,
			quantity: '',
			remarks: '',
			lab_status: 0,
		},
	],
};

// Received
export const RECEIVED_SCHEMA = {
	received_quantity: NUMBER_DOUBLE_REQUIRED,
	remarks: STRING.nullable(),
};

export const RECEIVED_NULL = {
	uuid: null,
	vendor_uuid: null,
	material_uuid: null,
	received_quantity: '',
	price: '',
	is_local: '',
	remarks: '',
};

// Order
// Order Properties
export const PROPERTIES_SCHEMA = {
	item_for: STRING_REQUIRED,
	type: STRING_REQUIRED,
	name: STRING_REQUIRED,
	short_name: STRING_REQUIRED,
	order_sheet_name: STRING.nullable(),
	remarks: STRING.nullable(),
};

export const PROPERTIES_NULL = {
	uuid: null,
	item_for: 'zipper',
	type: '',
	name: '',
	short_name: '',
	order_sheet_name: '',
	remarks: '',
	created_by: '',
	created_at: '',
	updated_at: '',
};

// Product Order
export const handelNumberDefaultValue = (value) =>
	value === null ? undefined : value;

// Order Info
export const ORDER_INFO_SCHEMA = {
	reference_order_info_uuid: STRING.nullable(),
	is_sample: BOOLEAN_REQUIRED.default(false),
	is_bill: BOOLEAN.default(true),
	is_cash: BOOLEAN_REQUIRED,
	is_cancelled: BOOLEAN_REQUIRED.default(false),
	conversion_rate: NUMBER_DOUBLE.nullable().default(80),
	status: BOOLEAN_REQUIRED.default(false),
	marketing_uuid: STRING_REQUIRED,
	merchandiser_uuid: STRING.nullable(),
	factory_uuid: STRING_REQUIRED,
	party_uuid: STRING_REQUIRED,
	buyer_uuid: STRING.nullable(),
	marketing_priority: STRING,
	factory_priority: STRING,
	remarks: STRING.nullable(),
};

export const ORDER_INFO_NULL = {
	uuid: null,
	reference_order_info_uuid: '',
	is_sample: false,
	is_bill: true,
	is_cash: false,
	is_cancelled: false,
	conversion_rate: 80,
	status: false,
	marketing_uuid: null,
	merchandiser_uuid: null,
	factory_uuid: null,
	party_uuid: null,
	buyer_uuid: null,
	marketing_priority: '',
	factory_priority: '',
	remarks: '',
};

export const ORDER_SCHEMA = {
	// * order type
	revision_no: NUMBER_REQUIRED.default(0),
	is_multi_color: BOOLEAN.default(false),
	is_fashion: BOOLEAN.default(false),
	is_waterproof: BOOLEAN.default(false),
	order_type: STRING_REQUIRED.default('full'),

	// * item section
	order_info_uuid: UUID_REQUIRED,
	item: UUID_REQUIRED,
	zipper_number: UUID_REQUIRED,
	lock_type: UUID.when(['order_type', 'slider_provided'], {
		is: (orderType, sliderProvided) =>
			orderType === 'tape' || sliderProvided !== 'not_provided',
		then: (schema) => schema,
		otherwise: (schema) => schema.required('Required'),
	}),

	end_type: UUID.when('order_type', {
		is: (value) => value === 'full',
		then: (schema) => schema.required('Required'),
		otherwise: (schema) => schema,
	}),
	teeth_type: UUID_FK,
	teeth_color: UUID.when('order_type', {
		is: (value) => value === 'full',
		then: (schema) => schema.required('Required'),
		otherwise: (schema) => schema,
	}),
	special_requirement: JSON_STRING_REQUIRED,
	description: STRING.nullable(),
	remarks: STRING.nullable(),

	// * slider section
	slider_provided: STRING.default('not_provided'),
	// puller
	puller_type: UUID.when(['order_type', 'slider_provided'], {
		is: (orderType, sliderProvided) =>
			orderType === 'tape' || sliderProvided !== 'not_provided',
		then: (schema) => schema,
		otherwise: (schema) => schema.required('Required'),
	}),

	// using this field puller_color as slider color
	puller_color: UUID.when(['order_type', 'slider_provided'], {
		is: (orderType, sliderProvided) =>
			orderType === 'tape' || sliderProvided !== 'not_provided',
		then: (schema) => schema,
		otherwise: (schema) => schema.required('Required'),
	}),

	coloring_type: UUID.when(['order_type', 'slider_provided'], {
		is: (orderType, sliderProvided) =>
			orderType === 'tape' || sliderProvided !== 'not_provided',
		then: (schema) => schema,
		otherwise: (schema) => schema.required('Required'),
	}),

	// slider
	slider: UUID.nullable(),
	slider_body_shape: UUID_FK,
	slider_link: UUID_FK,

	slider_starting_section: STRING_REQUIRED.default('---'),

	// stopper
	top_stopper: UUID_FK,
	bottom_stopper: UUID_FK,

	// logo
	logo_type: UUID_FK,
	is_logo_body: BOOLEAN.default(false).when('logo_type', {
		is: (value) => value != null && value !== '', // Check if logo_type has a value
		then: (schema) =>
			schema.test(
				'is_logo_body_test',
				'Either logo body or logo puller is required',
				function (value) {
					// Pass if either is_logo_body is true or is_logo_puller is true
					return value || this.parent.is_logo_puller;
				}
			),
		otherwise: (schema) => schema, // No special validation if logo_type is null or empty
	}),
	is_logo_puller: BOOLEAN.default(false).when('logo_type', {
		is: (value) => value != null && value !== '', // Check if logo_type has a value
		then: (schema) =>
			schema.test(
				'is_logo_puller_test',
				'Either logo body or logo puller is required',
				function (value) {
					// Pass if either is_logo_puller is true or is_logo_body is true
					return value || this.parent.is_logo_body;
				}
			),
		otherwise: (schema) => schema, // No special validation if logo_type is null or empty
	}),
	is_slider_provided: BOOLEAN_DEFAULT_VALUE(false),

	// garments
	end_user: UUID_FK,
	garment: STRING.nullable(),
	light_preference: UUID_FK,
	garments_wash: JSON_STRING_REQUIRED,
	garments_remarks: STRING.nullable(),

	// size type
	is_inch: BOOLEAN_DEFAULT_VALUE(false),
	is_meter: BOOLEAN_DEFAULT_VALUE(false),
	is_cm: BOOLEAN_DEFAULT_VALUE(true),

	order_entry: yup.array().of(
		yup.object().shape({
			index: NUMBER_REQUIRED,
			style: STRING_REQUIRED,
			color: STRING,
			color_ref: STRING,
			size: NUMBER_DOUBLE,
			quantity: STRING,
			company_price: NUMBER_DOUBLE_REQUIRED.transform(
				handelNumberDefaultValue
			).default(0),
			party_price: NUMBER_DOUBLE_REQUIRED.transform(
				handelNumberDefaultValue
			).default(0),
			bleaching: STRING_REQUIRED,
		})
	),
};

export const ORDER_NULL = {
	revision_no: 0,
	is_multi_color: false,
	is_fashion: false,
	is_waterproof: false,
	order_type: 'full',
	id: null,
	order_info_uuid: null,
	order_description_uuid: null,
	item: null,
	zipper_number: null,
	end_type: null,
	lock_type: null,
	puller_type: null,
	teeth_type: null,
	teeth_color: null,
	puller_color: null,
	slider_provided: 'not_provided',
	is_logo_body: false,
	is_logo_puller: false,
	special_requirement: '',
	description: '',
	remarks: '',
	slider_starting_section: '---',
	garments_wash: '',
	is_inch: false,
	is_meter: false,
	is_cm: true,
	order_entry: [
		{
			index: null,
			order_description_uuid: null,
			style: '',
			color: '',
			color_ref: '',
			size: '',
			quantity: '',
			company_price: 0,
			party_price: 0,
			status: 1,
			swatch_approval_date: null,
			bleaching: 'non-bleach',
		},
	],
};

// * Lab recipe schema*//
export const LAB_RECIPE_SCHEMA = {
	lab_dip_info_uuid: null,
	name: STRING_REQUIRED,
	bleaching: STRING_REQUIRED,
	sub_streat: STRING_REQUIRED,
	approved: BOOLEAN.transform(handelNumberDefaultValue).default(false),
	status: BOOLEAN.transform(handelNumberDefaultValue).default(false),
	remarks: STRING.nullable(),
	recipe_entry: yup.array().of(
		yup.object().shape({
			material_uuid: STRING_REQUIRED,
			quantity: NUMBER_DOUBLE_REQUIRED,
			remarks: STRING.nullable(),
		})
	),
};

export const LAB_RECIPE_NULL = {
	lab_dip_info_uuid: null,
	name: '',
	bleaching: 'non-bleach',
	sub_streat: '',
	approved: 0,
	status: 0,
	remarks: '',
	recipe_entry: [
		{
			color: '',
			quantity: '',
			remarks: '',
		},
	],
};

// * Lab info schema*//
export const LAB_INFO_SCHEMA = {
	order_info_uuid: STRING.nullable(),
	name: STRING_REQUIRED,
	remarks: STRING.nullable(),
	recipe: yup.array().of(
		yup.object().shape({
			approved: BOOLEAN.transform(handelNumberDefaultValue).default(
				false
			),
			recipe_uuid: STRING_REQUIRED,
			is_pps_req: BOOLEAN.transform(handelNumberDefaultValue).default(
				false
			),
			remarks: STRING.nullable(),
		})
	),
};

export const LAB_INFO_NULL = {
	order_info_uuid: null,
	name: '',
	remarks: '',
	recipe: [
		{
			approved: false,
			recipe_uuid: null,
			is_pps_req: false,
			remarks: '',
		},
	],
};

// Issue
// Wastage
export const WASTAGE_SCHEMA = {
	order_uuid: STRING_REQUIRED,
	material_id: NUMBER_REQUIRED,
	assigned_quantity: NUMBER_DOUBLE_REQUIRED,
	remarks: STRING.nullable(),
};

export const WASTAGE_NULL = {
	id: null,
	order_uuid: '',
	material_id: '',
	quantity: '',
	remarks: '',
};
// ISSUE Order page
export const ORDER_ISSUE_SCHEMA = {
	quantity: NUMBER_DOUBLE_REQUIRED,
	isWastage: NUMBER_REQUIRED,
	remarks: STRING.nullable(),
};

export const ORDER_ISSUE_NULL = {
	id: null,
	order_uuid: null,
	material_id: null,
	quantity: '',
	isWastage: null,
	remarks: '',
};

// Maintenance
export const MAINTENANCE_SCHEMA = {
	material_id: NUMBER_REQUIRED,
	quantity: NUMBER_DOUBLE_REQUIRED,
	description: STRING_REQUIRED,
	remarks: STRING.nullable(),
};

export const MAINTENANCE_NULL = {
	id: null,
	material_id: null,
	quantity: '',
	description: '',
	remarks: '',
};

// Spare Parts
export const SPARE_PARTS_SCHEMA = {
	material_id: NUMBER_REQUIRED,
	quantity: NUMBER_DOUBLE_REQUIRED,
	description: STRING_REQUIRED,
	remarks: STRING.nullable(),
};

export const SPARE_PARTS_NULL = {
	id: null,
	material_id: null,
	quantity: '',
	description: '',
	remarks: '',
};

// Material Entry

// Material
export const MATERIAL_ENTRY_SCHEMA = {
	price: NUMBER_DOUBLE_REQUIRED,
	quantity: NUMBER_DOUBLE_REQUIRED,
	purchase_type: STRING_REQUIRED,
	remarks: STRING.nullable(),
};

export const MATERIAL_ENTRY_NULL = {
	id: null,
	price: '',
	quantity: '',
	purchase_type: '',
	material_id: null,
	remarks: '',
};

// Consumption to Issue
export const CONSUMPTION_TO_ISSUE_SCHEMA = {
	quantity: NUMBER_DOUBLE_REQUIRED,
	remarks: STRING.nullable(),
};

export const CONSUMPTION_TO_ISSUE_NULL = {
	id: null,
	order_uuid: null,
	order_number: null,
	material_id: null,
	material_name: null,
	material_unit: null,
	quantity: '',
	remarks: '',
};

// Waste to Issue
export const WASTE_TO_ISSUE_SCHEMA = {
	quantity: NUMBER_DOUBLE_REQUIRED,
	remarks: STRING.nullable(),
};

export const WASTE_TO_ISSUE_NULL = {
	id: null,
	order_uuid: null,
	material_id: null,
	quantity: '',
	remarks: '',
};

// Login
export const LOGIN_SCHEMA = {
	email: FORTUNE_ZIP_EMAIL_PATTERN,
	pass: PASSWORD,
};

export const LOGIN_NULL = {
	email: '',
	pass: '',
};

// User
export const USER_SCHEMA = {
	name: STRING_REQUIRED,
	email: FORTUNE_ZIP_EMAIL_PATTERN,
	department_uuid: STRING_REQUIRED,
	designation_uuid: STRING_REQUIRED,
	// pass: PASSWORD,
	// repeatPass: yup
	// 	.string()
	// 	.min(4, "Password length should be at least 4 characters")
	// 	.max(12, "Password cannot exceed more than 12 characters")
	// 	.oneOf([yup.ref("pass")], "Passwords do not match"),
	ext: STRING.nullable(),
	phone: PHONE_NUMBER_REQUIRED,
	remarks: STRING.nullable(),
};

export const USER_NULL = {
	uuid: null,
	name: '',
	email: '',
	department_uuid: null,
	designation_uuid: null,
	pass: '',
	repeatPass: '',
	ext: '',
	phone: '',
	remarks: '',
};

// * User -> Department
export const USER_DEPARTMENT_SCHEMA = {
	department: STRING_REQUIRED,
	remarks: STRING.nullable(),
};

export const USER_DEPARTMENT_NULL = {
	uuid: null,
	department: '',
	remarks: null,
};

// * User -> Designation
export const USER_DESIGNATION_SCHEMA = {
	designation: STRING_REQUIRED,
	remarks: STRING.nullable(),
};

export const USER_DESIGNATION_NULL = {
	uuid: null,
	designation: '',
	remarks: null,
};

// Reset Password
export const RESET_PASSWORD_SCHEMA = {
	pass: PASSWORD,
	repeatPass: PASSWORD.oneOf([yup.ref('pass')], 'Passwords do not match'),
};

export const RESET_PASSWORD_NULL = {
	pass: '',
	repeatPass: '',
};

// Common
// Tape Add
export const TAPE_STOCK_ADD_SCHEMA = {
	name: STRING_REQUIRED,
	material_uuid: STRING.nullable(),
	thread_material_uuid: STRING.nullable(),
	thread_consumption_per_kg: NUMBER_DOUBLE_REQUIRED,
	cord_material_uuid: STRING.nullable(),
	cord_consumption_per_kg: NUMBER_DOUBLE_REQUIRED,
	monofilament_material_uuid: STRING.nullable(),
	monofilament_consumption_per_kg: NUMBER_DOUBLE_REQUIRED,
	item_uuid: STRING_REQUIRED,
	nylon_stopper_uuid: STRING.nullable(),
	zipper_number_uuid: STRING_REQUIRED,
	is_import: NUMBER.nullable(),
	is_reverse: STRING.nullable(),
	// top: NUMBER_DOUBLE_REQUIRED,
	// bottom: NUMBER_DOUBLE_REQUIRED,
	raw_per_kg_meter: NUMBER_DOUBLE_REQUIRED,
	dyed_per_kg_meter: NUMBER_DOUBLE_REQUIRED,
	remarks: STRING.nullable(),
};

export const TAPE_STOCK_ADD_NULL = {
	uuid: null,
	name: '',
	material_uuid: null,
	thread_material_uuid: null,
	thread_consumption_per_kg: 0,
	cord_material_uuid: null,
	cord_consumption_per_kg: 0,
	monofilament_material_uuid: null,
	monofilament_consumption_per_kg: 0,
	item_uuid: '',
	zipper_number_uuid: '',
	is_imported: 0,
	is_reverse: 0,
	// top: '',
	// bottom: '',
	raw_per_kg_meter: '',
	dyed_per_kg_meter: '',
	remarks: '',
};
// Tape Production
export const TAPE_PROD_SCHEMA = {
	production_quantity: NUMBER_REQUIRED.moreThan(0),
	wastage: NUMBER.nullable().default(0),
	remarks: STRING.nullable(),
};

export const TAPE_PROD_NULL = {
	uuid: null,
	section: '',
	tape_or_coil_stock_id: '',
	production_quantity: '',
	wastage: 0,
	remarks: '',
};
//Tape To Coil
export const TAPE_TO_COIL_TRX_SCHEMA = {
	trx_quantity: NUMBER_REQUIRED,
	wastage: NUMBER.nullable().default(0),
	remarks: STRING.nullable(),
};

export const TAPE_TO_COIL_TRX_NULL = {
	uuid: null,
	tape_coil_stock_uuid: '',
	created_by: '',
	trx_quantity: '',
	quantity: '',
	wastage: 0,
	remarks: '',
};
// Dyeing Against Stock
export const DYEING_AGAINST_STOCK_SCHEMA = {
	trx_quantity: NUMBER_REQUIRED.moreThan(0),
	remarks: STRING.nullable(),
};

export const DYEING_AGAINST_STOCK_NULL = {
	uuid: null,
	trx_quantity: '',
	remarks: '',
};
//* Tape Stock Trx To Dying
export const TAPE_STOCK_TRX_TO_DYING_SCHEMA = {
	order_description_uuid: NUMBER_REQUIRED,
	trx_quantity: NUMBER_DOUBLE_REQUIRED.moreThan(0),
	remarks: STRING.nullable(),
};

export const TAPE_STOCK_TRX_TO_DYING_NULL = {
	id: null,
	order_description_uuid: '',
	trx_quantity: '',
	trx_from: 'tape_making',
	trx_to: 'dying_and_iron_stock',
	issued_by: '',
	remarks: '',
};

//*Dyeing Transfer From Stock
export const DYEING_TRANSFER_FROM_STOCK_SCHEMA = {
	dyeing_transfer_entry: yup.array().of(
		yup.object().shape({
			order_description_uuid: STRING_REQUIRED,
			trx_quantity: NUMBER_DOUBLE.required('Required').transform(
				(value, originalValue) =>
					String(originalValue).trim() === '' ? null : value
			), // Transforms empty strings to null
			remarks: STRING.nullable(),
		})
	),
};

export const DYEING_TRANSFER_FROM_STOCK_NULL = {
	dyeing_transfer_entry: [
		{
			sfg_uuid: null,
			order_description_uuid: null,
			trx_quantity: null,
			remarks: '',
		},
	],
};

export const TAPE_OR_COIL_PRODUCTION_LOG_SCHEMA = {
	production_quantity: NUMBER_DOUBLE_REQUIRED.moreThan(0),
	wastage: NUMBER_DOUBLE.nullable().default(0),
	remarks: STRING.nullable(),
};

export const TAPE_OR_COIL_PRODUCTION_LOG_NULL = {
	uuid: null,
	type_of_zipper: null,
	tape_or_coil_stock_id: null,
	prod_quantity: null,
	wastage: 0,
	remarks: null,
};

// * Tape Required
export const TAPE_REQUIRED_SCHEMA = {
	end_type_uuid: UUID_REQUIRED,
	item_uuid: UUID_REQUIRED,
	nylon_stopper_uuid: UUID,
	zipper_number_uuid: UUID_REQUIRED,
	top: NUMBER_DOUBLE_REQUIRED,
	bottom: NUMBER_DOUBLE_REQUIRED,
	raw_mtr_per_kg: NUMBER_DOUBLE.moreThan(0, 'More than 0'),
	dyed_mtr_per_kg: NUMBER_DOUBLE.moreThan(0, 'More than 0'),
	remarks: STRING.nullable(),
};

export const TAPE_REQUIRED_NULL = {
	uuid: null,
	end_type_uuid: null,
	item_uuid: null,
	nylon_stopper_uuid: null,
	zipper_number_uuid: null,
	top: '',
	bottom: '',
	raw_mtr_per_kg: 0,
	dyed_mtr_per_kg: 0,
	remarks: '',
};

// Coil Production
export const COIL_PROD_SCHEMA = {
	production_quantity: NUMBER_DOUBLE_REQUIRED.moreThan(0),
	wastage: NUMBER_DOUBLE.nullable().default(0),
	remarks: STRING.nullable(),
};

export const COIL_PROD_NULL = {
	uuid: null,
	section: '',
	tape_or_coil_stock_id: '',
	production_quantity: '',
	wastage: 0,
	remarks: '',
};

// Coil Stock
export const COIL_STOCK_SCHEMA = {
	order_entry_id: NUMBER_REQUIRED,
	trx_quantity: NUMBER_DOUBLE_REQUIRED.moreThan(0),
	remarks: STRING.nullable(),
};

export const COIL_STOCK_NULL = {
	uuid: null,
	order_entry_id: null,
	tape_or_coil_stock_id: null,
	quantity: '',
	remarks: '',
	zipper_number: null,
	trx_quantity: '',
};

// * common coil to dyeing

export const COMMON_COIL_TO_DYEING_SCHEMA = {
	coil_to_dyeing_entry: yup.array().of(
		yup.object().shape({
			order_id: UUID_REQUIRED,
			trx_quantity: NUMBER_DOUBLE_REQUIRED,
			// .max(yup.ref('max_trf_qty'), 'Beyond Stock'), // Transforms empty strings to null
			remarks: STRING.nullable(),
		})
	),
};

export const COMMON_COIL_TO_DYEING_NULL = {
	coil_to_dyeing_entry: [
		{
			order_id: null,
			trx_quantity: null,
			remarks: '',
		},
	],
};
export const COMMON_COIL_TO_DYEING_LOG_SCHEMA = {
	order_description_uuid: STRING_REQUIRED,
	trx_quantity: NUMBER_DOUBLE_REQUIRED,
	remarks: STRING.nullable(),
};
export const COMMON_COIL_TO_DYEING_LOG_NULL = {
	order_description_uuid: null,
	trx_quantity: null,
	remarks: null,
};

// RM Material Used
// material_stock_id	section	quantity	wastage	issued_by

export const RM_MATERIAL_USED_SCHEMA = {
	remaining: NUMBER_DOUBLE_REQUIRED,
	wastage: NUMBER_DOUBLE.nullable().default(0),
	remarks: STRING.nullable(),
};

export const RM_MATERIAL_USED_NULL = {
	uuid: null,
	material_stock_id: null,
	used_quantity: '',
	section: '',
	remaining: '',
	wastage: 0,
	issued_by: '',
	remarks: '',
	tape_making: '',
	coil_forming: '',
	dying_and_iron: '',
	lab_dip: '',
};

export const RM_MATERIAL_USED_EDIT_SCHEMA = {
	used_quantity: NUMBER_DOUBLE_REQUIRED,
	wastage: NUMBER_DOUBLE.nullable().default(0),
	remarks: STRING.nullable(),
};

export const RM_MATERIAL_USED_EDIT_NULL = {
	uuid: null,
	material_stock_id: null,
	section: '',
	used_quantity: '',
	wastage: 0,
	issued_by: '',
	remarks: '',
};
export const RM_MATERIAL_ORDER_AGAINST_EDIT_SCHEMA = {
	trx_quantity: NUMBER_DOUBLE_REQUIRED,
	remarks: STRING.nullable(),
};

export const RM_MATERIAL_ORDER_AGAINST_EDIT_NULL = {
	uuid: null,
	material_stock_id: null,
	section: '',
	trx_quantity: '',
	issued_by: '',
	remarks: '',
};

// * Multi Color Dashboard
export const MULTI_COLOR_DASHBOARD_SCHEMA = {
	expected_tape_quantity: NUMBER_DOUBLE_REQUIRED.moreThan(0, 'More than 0'),
	tape_coil_uuid: STRING_REQUIRED,
	tape_quantity: NUMBER_DOUBLE_REQUIRED.moreThan(0, 'More than 0'),
	coil_uuid: STRING_REQUIRED,
	coil_quantity: NUMBER_DOUBLE_REQUIRED.moreThan(0, 'More than 0'),
	thread_uuid: STRING_REQUIRED,
	thread_quantity: NUMBER_DOUBLE_REQUIRED.moreThan(0, 'More than 0'),
	remarks: STRING.nullable(),
};

export const MULTI_COLOR_DASHBOARD_NULL = {
	uuid: null,
	expected_tape_quantity: 0,
	tape_coil_uuid: '',
	tape_quantity: 0,
	coil_uuid: '',
	coil_quantity: 0,
	thread_uuid: '',
	thread_quantity: 0,
	remarks: '',
};

// * Multi Color Tape Received
export const MULTI_COLOR_TAPE_RECEIVED_SCHEMA = {
	quantity: NUMBER_DOUBLE_REQUIRED.moreThan(0, 'More than 0'),
	remarks: STRING.nullable(),
};

export const MULTI_COLOR_TAPE_RECEIVED_NULL = {
	uuid: null,
	quantity: null,
	remarks: '',
};

// Swatch Schema
export const SWATCH_SCHEMA = {
	remarks: STRING.nullable(),
};

export const SWATCH_NULL = {
	order_entry_id: null,
	remarks: '',
};

// SFG Transaction
// id	order_entry_id	trx_from	trx_to	trx_quantity	issued_by

export const SFG_TRX_SCHEMA = {
	trx_quantity: NUMBER_DOUBLE_REQUIRED.moreThan(0),
	remarks: STRING.nullable(),
};

export const SFG_TRX_NULL = {
	id: null,
	order_entry_id: null,
	trx_from: '',
	trx_to: '',
	trx_quantity: '',
	issued_by: '',
	remarks: '',
};

// Slider Die Casting

export const SLIDER_DIE_CASTING_SCHEMA = {
	array: yup.array().of(
		yup.object().shape({
			mc_no: NUMBER_REQUIRED,
			die_casting_uuid: STRING_REQUIRED,
			order_description_uuid: STRING.nullable(),
			cavity_goods: NUMBER_REQUIRED.moreThan(0, 'Must be more than 0'),
			cavity_defect: NUMBER_REQUIRED,
			push: NUMBER_REQUIRED.moreThan(0, 'Must be more than 0'),
			weight: NUMBER_DOUBLE_REQUIRED.moreThan(0, 'Must be more than 0'),
			remarks: STRING.nullable(),
		})
	),
};

export const SLIDER_DIE_CASTING_NULL = {
	array: [
		{
			mc_no: '',
			die_casting_uuid: '',
			order_description_uuid: null,
			cavity_goods: '',
			cavity_defect: '',
			push: '',
			weight: '',
			remarks: '',
		},
	],
};

export const SLIDER_DIE_CASTING_PRODUCT_EDIT_SCHEMA = {
	mc_no: NUMBER_REQUIRED,
	cavity_goods: NUMBER_REQUIRED,
	cavity_defect: NUMBER_REQUIRED,
	push: NUMBER_REQUIRED,
	weight: NUMBER_DOUBLE_REQUIRED,
	remarks: STRING.nullable(),
};

export const SLIDER_DIE_CASTING_PRODUCT_EDIT_NULL = {
	mc_no: '',
	cavity_goods: '',
	cavity_defect: '',
	push: '',
	weight: '',
	remarks: '',
};
// Slider Assembly

export const SLIDER_SLIDER_ASSEMBLY_SCHEMA = {
	slider_slider_assembly_details: yup.array().of(
		yup.object().shape({
			slider_slider_assembly_uuid: STRING,
			order_number: STRING,
			party: STRING,
			slider_item_id: STRING_REQUIRED,
			production_quantity: NUMBER_DOUBLE_REQUIRED,
			production_weight: NUMBER_DOUBLE_REQUIRED,
			remarks: STRING.nullable(),
		})
	),
};

export const SLIDER_SLIDER_ASSEMBLY_NULL = {
	slider_slider_assembly_details: [
		{
			slider_slider_assembly_uuid: '',
			order_number: '',
			party: '',
			slider_item_id: '',
			production_quantity: '',
			production_weight: '',
			remarks: '',
		},
	],
};

// * Slider Assembly Production entry

export const SLIDER_ASSEMBLY_PRODUCTION_ENTRY_SCHEMA = {
	production_quantity: NUMBER_REQUIRED,
	weight: NUMBER_DOUBLE_REQUIRED.moreThan(0, 'More than 0'),
	wastage: NUMBER.nullable()
		.transform((value, originalValue) =>
			String(originalValue).trim() === '' ? 0 : value
		)
		.min(0, 'Minimum of 0'),
	remarks: STRING.nullable(),
};

export const SLIDER_ASSEMBLY_PRODUCTION_ENTRY_NULL = {
	production_quantity: null,
	weight: null,
	wastage: 0,
	remarks: '',
};

// * Slider Assembly Transaction entry
export const SLIDER_ASSEMBLY_TRANSACTION_SCHEMA = {
	trx_quantity: NUMBER_REQUIRED,
	weight: NUMBER_DOUBLE_REQUIRED.moreThan(0, 'More than 0'),
	remarks: STRING.nullable(),
};

export const SLIDER_ASSEMBLY_TRANSACTION_NULL = {
	trx_quantity: null,
	weight: null,
	remarks: '',
};

// Item Library (Die Casting, Slider Assembly)

export const ITEM_LIBRARY_SCHEMA = {
	name: STRING_REQUIRED,
	short_name: STRING,
	remarks: STRING.nullable(),
};

export const ITEM_LIBRARY_NULL = {
	id: null,
	name: '',
	short_name: '',
	section: '',
	remarks: '',
};

// Slider Item Transaction (Die Casting, Slider Assembly)

export const SLIDER_ITEM_TRANSACTION_SCHEMA = {
	trx_quantity: NUMBER_DOUBLE_REQUIRED,
	remarks: STRING.nullable(),
};

export const SLIDER_ITEM_TRANSACTION_NULL = {
	id: null,
	order_entry_id: null,
	trx_from: '',
	trx_to: '',
	trx_quantity: '',
	issued_by: '',
	remarks: '',
};

// Delivery
export const PACKING_LIST_SCHEMA = {
	item_for: STRING_REQUIRED,
	order_info_uuid: STRING_REQUIRED,
	carton_uuid: STRING.when('item_for', {
		is: (item_for) =>
			item_for === 'zipper' ||
			item_for === 'thread' ||
			item_for === 'tape' ||
			item_for === 'slider',
		then: (Schema) => Schema.required('Carton Size required'),
		otherwise: (Schema) => Schema.nullable(),
	}),
	carton_weight: NUMBER_DOUBLE.when('item_for', {
		is: (item_for) =>
			item_for === 'zipper' ||
			item_for === 'thread' ||
			item_for === 'tape' ||
			item_for === 'slider',
		then: (Schema) => Schema.required('Carton Weight is required'),
		otherwise: (Schema) =>
			Schema.nullable().transform((value, originalValue) =>
				String(originalValue).trim() === '' ? null : value
			),
	}),

	remarks: STRING.nullable(),
	packing_list_entry: yup.array().of(
		yup.object().shape({
			quantity: yup
				.number()
				.nullable()
				.max(yup.ref('max_quantity'), 'Beyond Max Quantity'),
			reject_quantity: yup.number().when('quantity', {
				is: (quantity) => quantity > 0,
				then: (Schema) =>
					Schema.typeError('Must be a number').max(
						yup.ref('order_quantity'),
						'Beyond Order Quantity'
					),
				otherwise: (Schema) =>
					Schema.nullable().transform((value, originalValue) =>
						String(originalValue).trim() === '' ? null : value
					),
			}),
			poli_quantity: yup.number().when(['quantity', 'item_for'], {
				is: (quantity, item_for) =>
					quantity > 0 && item_for === 'zipper',
				then: (Schema) =>
					Schema.typeError('Must be a number')
						.required('Poly Quantity is required')
						.moreThan(0, 'Must be greater than zero'),
				otherwise: (Schema) =>
					Schema.nullable().transform((value, originalValue) =>
						String(originalValue).trim() === '' ? null : value
					),
			}),
			remarks: STRING.nullable(),
			//isDeletable: BOOLEAN,
		})
	),
};
export const PACKING_LIST_UPDATE_SCHEMA = {
	...PACKING_LIST_SCHEMA,
	new_packing_list_entry: yup.array().of(
		yup.object().shape({
			quantity: yup
				.number()
				.nullable()
				.max(yup.ref('max_quantity'), 'Beyond Max Quantity'),
			reject_quantity: yup.number().when('quantity', {
				is: (quantity) => quantity > 0,
				then: (Schema) =>
					Schema.typeError('Must be a number').max(
						yup.ref('order_quantity'),
						'Beyond Order Quantity'
					),
				otherwise: (Schema) =>
					Schema.nullable().transform((value, originalValue) =>
						String(originalValue).trim() === '' ? null : value
					),
			}),
			poli_quantity: yup.number().when(['quantity', 'item_for'], {
				is: (quantity, item_for) =>
					quantity > 0 &&
					(item_for === 'zipper' || item_for === 'sample_zipper'),
				then: (Schema) =>
					Schema.typeError('Must be a number')
						.required('Poly Quantity is required')
						.moreThan(0, 'Must be greater than zero'),
				otherwise: (Schema) =>
					Schema.nullable().transform((value, originalValue) =>
						String(originalValue).trim() === '' ? null : value
					),
			}),
			remarks: STRING.nullable(),
			//isDeletable: BOOLEAN,
		})
	),
};
export const PACKING_LIST_NULL = {
	item_for: '',
	order_info_uuid: '',
	carton_size_uuid: '',
	carton_weight: '',
	remarks: '',
	packing_list_entry: [
		{
			is_checked: false,
			sfg_uuid: '',
			packing_list_uuid: '',
			order_number: '',
			item_description: '',
			style_color_size: '',
			order_quantity: null,
			warehouse: null,
			delivered: null,
			balance_quantity: null,
			quantity: 0,
			poli_quantity: 0,
			reject_quantity: 0,
			remarks: '',
			isDeletable: false,
		},
	],
	new_packing_list_entry: [
		{
			is_checked: false,
			sfg_uuid: '',
			packing_list_uuid: '',
			order_number: '',
			item_description: '',
			style_color_size: '',
			order_quantity: null,
			warehouse: null,
			delivered: null,
			balance_quantity: null,
			quantity: 0,
			poli_quantity: 0,
			reject_quantity: 0,
			remarks: '',
			isDeletable: false,
		},
	],
};

// Challan
export const CHALLAN_SCHEMA = {
	item_for: STRING_REQUIRED,
	delivery_type: STRING_REQUIRED.default('normal'),
	name: STRING.when('delivery_type', {
		is: 'hand',
		then: (Schema) => Schema.required('Required'),
		otherwise: (Schema) => Schema.nullable(),
	}),
	delivery_cost: NUMBER.when('delivery_type', {
		is: 'hand',
		then: (Schema) => Schema.required('Required'),
		otherwise: (Schema) => Schema.nullable(),
	}),
	vehicle_uuid: STRING.when(['delivery_type', 'item_for'], {
		is: (delivery_type, item_for) =>
			delivery_type === 'hand' ||
			delivery_type === 'own' ||
			item_for === 'sample_zipper' ||
			item_for === 'sample_thread',
		then: (Schema) => Schema.nullable(),
		otherwise: (Schema) => Schema.required('Required'),
	}),
	order_info_uuid: STRING_REQUIRED,
	packing_list_uuids: JSON_STRING_REQUIRED.test(
		'required',
		'Required',
		(value) => {
			if (value.length === 0) {
				return false;
			}
			return true;
		}
	),
	new_packing_list_uuids: JSON_STRING_REQUIRED,
	challan_entry: yup.array().of(
		yup.object().shape({
			// packing_list_entry_uuid: STRING_REQUIRED,
			remarks: STRING.nullable(),
		})
	),
	delivery_date: yup.date().required('Required'),
	new_challan_entry: yup
		.array()
		.of(
			yup.object().shape({
				// packing_list_entry_uuid: STRING_REQUIRED,
				remarks: STRING.nullable(),
			})
		)
		.optional(),
};

export const CHALLAN_NULL = {
	item_for: 'zipper',
	delivery_type: 'normal',
	vehicle_uuid: null,
	name: '',
	delivery_cost: 0,
	order_info_uuid: null,
	packing_list_uuids: [],
	new_packing_list_uuids: [],
	delivery_date: null,
	challan_entry: [
		{
			packing_list_uuid: '',
			remarks: '',
		},
	],

	new_challan_entry: [],
};
//* Vehicle
export const DELIVERY_VEHICLE_SCHEMA = {
	type: STRING_REQUIRED,
	name: STRING_REQUIRED,
	number: STRING_REQUIRED,
	driver_name: STRING_REQUIRED,
	active: BOOLEAN_REQUIRED.default(false),
	remarks: STRING.nullable(),
};

export const DELIVERY_VEHICLE_NULL = {
	uuid: null,
	type: '',
	name: '',
	number: '',
	driver_name: '',
	active: false,
	created_by: null,
	created_by_name: '',
	created_at: '',
	updated_at: null,
	remarks: '',
};

//* Quantity Return
export const QUANTITY_RETURN_SCHEMA = {
	order_info_uuid: STRING_REQUIRED,
	challan_uuid: STRING.nullable(),

	order_details: yup.array().of(
		yup.object().shape({
			uuid: STRING.nullable(),
			size: STRING.nullable(),

			length: STRING.nullable(),
			count_length_name: STRING.nullable(),

			style: STRING.nullable(),
			color: STRING.nullable(),
			quantity: NUMBER.nullable(),

			fresh_quantity: NUMBER.default(0).nullable(),
			repair_quantity: NUMBER.default(0).nullable(),
		})
	),
};

export const QUANTITY_RETURN_NULL = {
	order_info_uuid: null,
	challan_uuid: null,
	order_details: [
		{
			size: '',

			length: '',
			count_length_name: '',

			style: '',
			color: '',
			quantity: 0,

			fresh_quantity: 0,
			repair_quantity: 0,
		},
	],
};

//* Return Quantity Update
export const RETURN_QUANTITY_UPDATE_SCHEMA = {
	fresh_quantity: NUMBER,
	repair_quantity: NUMBER.nullable(),
};

export const RETURN_QUANTITY_UPDATE_NULL = {
	fresh_quantity: 0,
	repair_quantity: 0,
};

//* Carton
export const DELIVERY_CARTON_SCHEMA = {
	size: STRING_REQUIRED,
	name: STRING_REQUIRED,
	used_for: STRING_REQUIRED,
	active: BOOLEAN_REQUIRED.default(false),
	remarks: STRING.nullable(),
};

export const DELIVERY_CARTON_NULL = {
	uuid: null,
	size: '',
	name: '',
	used_for: '',
	active: false,
	created_by: null,
	created_by_name: '',
	created_at: '',
	updated_at: null,
	remarks: '',
};

// Commercial
// PI

export const PI_SCHEMA = {
	pi_date: STRING_REQUIRED,
	lc_uuid: STRING.nullable(),
	marketing_uuid: STRING_REQUIRED,
	party_uuid: STRING_REQUIRED,
	order_info_uuids: JSON_STRING.optional(),
	thread_order_info_uuids: JSON_STRING.optional(),
	new_order_info_uuids: JSON_STRING.optional(),
	new_order_info_thread_uuids: JSON_STRING.optional(),
	merchandiser_uuid: STRING.nullable(),
	factory_uuid: STRING_REQUIRED,
	bank_uuid: STRING_REQUIRED,
	validity: NUMBER_REQUIRED,
	payment: NUMBER_REQUIRED,
	remarks: STRING.nullable(),
	weight: NUMBER_DOUBLE.optional(),
	cross_weight: NUMBER_DOUBLE.optional(),
	is_rtgs: BOOLEAN_REQUIRED,

	pi_cash_entry: yup.array().of(
		yup.object().shape({
			is_checked: BOOLEAN_DEFAULT_VALUE(false),
			sfg_uuid: STRING.when('is_checked', {
				is: true,
				then: (Schema) => Schema.required('required'),
				otherwise: (Schema) =>
					Schema.nullable().transform((value, originalValue) =>
						String(originalValue).trim() === '' ? null : value
					),
			}),
			max_quantity: NUMBER.default(0),
			pi_cash_quantity: yup.number().when('is_checked', {
				is: true,
				then: (Schema) =>
					Schema.typeError('Must be a number')
						.required('Quantity is required')
						.max(yup.ref('max_quantity'), 'Beyond Max Quantity'),
				otherwise: (Schema) =>
					Schema.nullable().transform((value, originalValue) =>
						String(originalValue).trim() === '' ? null : value
					),
			}),
			remarks: STRING.nullable(),
		})
	),

	new_pi_cash_entry: yup
		.array()
		.of(
			yup.object().shape({
				is_checked: BOOLEAN_DEFAULT_VALUE(false),
				sfg_uuid: STRING.when('is_checked', {
					is: true,
					then: (Schema) => Schema.required('required'),
					otherwise: (Schema) =>
						Schema.nullable().transform((value, originalValue) =>
							String(originalValue).trim() === '' ? null : value
						),
				}),
				max_quantity: NUMBER.default(0),
				pi_cash_quantity: yup.number().when('is_checked', {
					is: true,
					then: (Schema) =>
						Schema.typeError('Must be a number')
							.required('Quantity is required')
							.max(
								yup.ref('max_quantity'),
								'Beyond Max Quantity'
							),
					otherwise: (Schema) =>
						Schema.nullable().transform((value, originalValue) =>
							String(originalValue).trim() === '' ? null : value
						),
				}),
				remarks: STRING.nullable(),
			})
		)
		.optional(),

	pi_cash_entry_thread: yup.array().of(
		yup.object().shape({
			is_checked: BOOLEAN_DEFAULT_VALUE(false),
			max_quantity: NUMBER.default(0),
			pi_cash_quantity: yup.number().when('is_checked', {
				is: true,
				then: (Schema) =>
					Schema.typeError('Must be a number')
						.required('Quantity is required')
						.max(yup.ref('max_quantity'), 'Beyond Max Quantity'),
				otherwise: (Schema) =>
					Schema.nullable().transform((value, originalValue) =>
						String(originalValue).trim() === '' ? null : value
					),
			}),
			remarks: STRING.nullable(),
		})
	),

	new_pi_cash_entry_thread: yup
		.array()
		.of(
			yup.object().shape({
				is_checked: BOOLEAN_DEFAULT_VALUE(false),
				max_quantity: NUMBER.default(0),
				pi_cash_quantity: yup.number().when('is_checked', {
					is: true,
					then: (Schema) =>
						Schema.typeError('Must be a number')
							.required('Quantity is required')
							.max(
								yup.ref('max_quantity'),
								'Beyond Max Quantity'
							),
					otherwise: (Schema) =>
						Schema.nullable().transform((value, originalValue) =>
							String(originalValue).trim() === '' ? null : value
						),
				}),
				remarks: STRING.nullable(),
			})
		)
		.optional(),
};

export const PI_NULL = {
	pi_date: '',
	uuid: null,
	marketing_uuid: '',
	party_uuid: '',
	order_info_uuids: [],
	thread_order_info_uuids: [],
	new_order_info_uuids: [],
	new_order_info_thread_uuids: [],
	merchandiser_uuid: null,
	factory_uuid: '',
	bank_uuid: '',
	validity: '',
	payment: '',
	remarks: '',
	weight: 0,
	cross_weight: 0,
	is_rtgs: false,

	pi_cash_entry: [
		{
			is_checked: false,
			sfg_uuid: '',
			pi_uuid: '',
			max_quantity: 0,
			pi_cash_quantity: null,
			remarks: '',
		},
	],
	new_pi_cash_entry: [
		{
			is_checked: false,
			sfg_uuid: '',
			pi_uuid: '',
			max_quantity: 0,
			pi_cash_quantity: null,
			remarks: '',
		},
	],
	pi_cash_entry_thread: [
		{
			is_checked: false,
			sfg_uuid: '',
			pi_uuid: '',
			max_quantity: 0,
			pi_cash_quantity: null,
			remarks: '',
		},
	],
	new_pi_cash_entry_thread: [
		{
			is_checked: false,
			sfg_uuid: '',
			pi_uuid: '',
			max_quantity: 0,
			pi_cash_quantity: null,
			remarks: '',
		},
	],
};

export const PI_CASH_SCHEMA = {
	marketing_uuid: STRING_REQUIRED,
	party_uuid: STRING_REQUIRED,
	order_info_uuids: JSON_STRING_REQUIRED,
	thread_order_info_uuids: JSON_STRING.optional(),
	new_order_info_uuids: JSON_STRING.optional(),
	new_order_info_thread_uuids: JSON_STRING.optional(),
	merchandiser_uuid: STRING.nullable(),
	factory_uuid: STRING_REQUIRED,
	conversion_rate: NUMBER_DOUBLE_REQUIRED,
	receive_amount: NUMBER_DOUBLE,
	remarks: STRING.nullable(),
	pi_cash_entry: yup.array().of(
		yup.object().shape({
			is_checked: BOOLEAN,
			sfg_uuid: STRING_REQUIRED,
			max_quantity: NUMBER,
			pi_cash_quantity: yup.number().when('is_checked', {
				is: true,
				then: (Schema) =>
					Schema.typeError('Must be a number')
						.required('Quantity is required')
						.max(yup.ref('max_quantity'), 'Beyond Max Quantity'),
				otherwise: (Schema) =>
					Schema.nullable().transform((value, originalValue) =>
						String(originalValue).trim() === '' ? null : value
					),
			}),
			remarks: STRING.nullable(),
			isDeletable: BOOLEAN,
		})
	),

	new_pi_cash_entry: yup
		.array()
		.of(
			yup.object().shape({
				is_checked: BOOLEAN,
				sfg_uuid: STRING_REQUIRED,
				max_quantity: NUMBER,
				pi_cash_quantity: yup.number().when('is_checked', {
					is: true,
					then: (Schema) =>
						Schema.typeError('Must be a number')
							.required('Quantity is required')
							.max(
								yup.ref('max_quantity'),
								'Beyond Max Quantity'
							),
					otherwise: (Schema) =>
						Schema.nullable().transform((value, originalValue) =>
							String(originalValue).trim() === '' ? null : value
						),
				}),
				remarks: STRING.nullable(),
				isDeletable: BOOLEAN,
			})
		)
		.optional(),

	pi_cash_entry_thread: yup.array().of(
		yup.object().shape({
			is_checked: BOOLEAN,
			max_quantity: NUMBER,
			pi_cash_quantity: yup.number().when('is_checked', {
				is: true,
				then: (Schema) =>
					Schema.typeError('Must be a number')
						.required('Quantity is required')
						.max(yup.ref('max_quantity'), 'Beyond Max Quantity'),
				otherwise: (Schema) =>
					Schema.nullable().transform((value, originalValue) =>
						String(originalValue).trim() === '' ? null : value
					),
			}),
			remarks: STRING.nullable(),
			isDeletable: BOOLEAN.optional(),
		})
	),

	new_pi_cash_entry_thread: yup
		.array()
		.of(
			yup.object().shape({
				is_checked: BOOLEAN,
				max_quantity: NUMBER,
				pi_cash_quantity: yup.number().when('is_checked', {
					is: true,
					then: (Schema) =>
						Schema.typeError('Must be a number')
							.required('Quantity is required')
							.max(
								yup.ref('max_quantity'),
								'Beyond Max Quantity'
							),
					otherwise: (Schema) =>
						Schema.nullable().transform((value, originalValue) =>
							String(originalValue).trim() === '' ? null : value
						),
				}),
				remarks: STRING.nullable(),
				isDeletable: BOOLEAN.optional(),
			})
		)
		.optional(),
};

export const PI_CASH_NULL = {
	uuid: null,
	marketing_uuid: '',
	party_uuid: '',
	order_info_uuids: [],
	thread_order_info_uuids: [],
	new_order_info_uuids: [],
	new_order_info_thread_uuids: [],
	merchandiser_uuid: '',
	factory_uuid: '',
	remarks: '',
	conversion_rate: 0,
	receive_amount: 0,
	pi_cash_entry: [],
	new_pi_cash_entry: [],
	pi_cash_entry_thread: [],
	new_pi_cash_entry_thread: [],
};
// PI CASH RECEIVE
export const PI_CASH_RECEIVE_SCHEMA = {
	amount: NUMBER_DOUBLE_REQUIRED,
	remarks: STRING.nullable(),
};

export const PI_CASH_RECEIVE_NULL = {
	uuid: null,
	amount: null,
	remarks: '',
};

export const BANK_SCHEMA = {
	name: STRING_REQUIRED,
	account_no: STRING.nullable(),
	swift_code: STRING_REQUIRED,
	routing_no: STRING.nullable(),
	address: STRING_REQUIRED,
	policy: STRING_REQUIRED,
	remarks: STRING.nullable(),
};

export const BANK_NULL = {
	uuid: null,
	name: '',
	account_no: '',
	swift_code: '',
	routing_no: '',
	address: '',
	policy: '',
	remarks: null,
};

// LC
export const LC_SCHEMA = {
	party_uuid: STRING_REQUIRED,
	lc_number: STRING_REQUIRED,
	lc_date: STRING_REQUIRED,

	commercial_executive: STRING_REQUIRED,
	party_bank: STRING_REQUIRED,
	production_complete: BOOLEAN_REQUIRED,
	lc_cancel: BOOLEAN_REQUIRED,
	problematical: BOOLEAN_REQUIRED,
	epz: BOOLEAN_REQUIRED,
	is_rtgs: BOOLEAN_REQUIRED,
	is_old_pi: BOOLEAN_REQUIRED,

	// export
	export_lc_number: STRING_REQUIRED,
	export_lc_date: STRING_REQUIRED,
	export_lc_expire_date: STRING.nullable(),
	up_date: STRING.nullable(),
	up_number: STRING.nullable(),

	// if is_old_pi = true
	pi_number: STRING.when('is_old_pi', {
		is: true,
		then: (Schema) => Schema.required('required'),
		otherwise: (Schema) =>
			Schema.nullable().transform((value, originalValue) =>
				String(originalValue).trim() === '' ? null : value
			),
	}),
	lc_value: NUMBER_DOUBLE.when('is_old_pi', {
		is: true,
		then: (Schema) =>
			Schema.required('required').moreThan(0, 'More than 0'),
		otherwise: (Schema) => Schema.nullable(),
	}),

	shipment_date: STRING.nullable().transform((value, originalValue) =>
		String(originalValue).trim() === '' ? null : value
	),
	expiry_date: STRING.nullable().transform((value, originalValue) =>
		String(originalValue).trim() === '' ? null : value
	),
	at_sight: STRING_REQUIRED,
	amd_date: STRING.nullable().transform((value, originalValue) =>
		String(originalValue).trim() === '' ? null : value
	),
	amd_count: NUMBER,
	remarks: STRING.nullable(),

	lc_entry: yup.array().of(
		yup.object().shape({
			amount: NUMBER_DOUBLE.transform((value, originalValue) =>
				String(originalValue).trim() === '' ? 0 : value
			),
			ldbc_fdbc: STRING.nullable(),
			// receive_date: STRING.nullable().transform((value, originalValue) =>
			// 	String(originalValue).trim() === '' ? null : value
			// ),
			document_submission_date: STRING.nullable().transform(
				(value, originalValue) =>
					String(originalValue).trim() === '' ? null : value
			),
			bank_forward_date: STRING.nullable().transform(
				(value, originalValue) =>
					String(originalValue).trim() === '' ? null : value
			),
			handover_date: STRING.nullable().transform(
				(value, originalValue) =>
					String(originalValue).trim() === '' ? null : value
			),
			document_receive_date: STRING.nullable().transform(
				(value, originalValue) =>
					String(originalValue).trim() === '' ? null : value
			),
			acceptance_date: STRING.nullable().transform(
				(value, originalValue) =>
					String(originalValue).trim() === '' ? null : value
			),
			maturity_date: STRING.nullable().transform(
				(value, originalValue) =>
					String(originalValue).trim() === '' ? null : value
			),
			payment_date: STRING.nullable().transform((value, originalValue) =>
				String(originalValue).trim() === '' ? null : value
			),
			payment_value: NUMBER_DOUBLE.transform((value, originalValue) =>
				String(originalValue).trim() === '' ? 0 : value
			),
		})
	),

	lc_entry_others: yup.array().of(
		yup.object().shape({
			ud_no: STRING.nullable().transform((value, originalValue) =>
				String(originalValue).trim() === '' ? null : value
			),
			ud_received: STRING.nullable().transform((value, originalValue) =>
				String(originalValue).trim() === '' ? null : value
			),
			up_number: STRING.nullable().transform((value, originalValue) =>
				String(originalValue).trim() === '' ? null : value
			),
			remarks: STRING.nullable(),
		})
	),

	pi: yup.array().of(
		yup.object().shape({
			uuid: STRING.when('is_old_pi', {
				is: true,
				then: (Schema) => Schema.required('required'),
				otherwise: (Schema) =>
					Schema.nullable().transform((value, originalValue) =>
						String(originalValue).trim() === '' ? null : value
					),
			}),
		})
	),
};

export const LC_NULL = {
	party_uuid: null,
	lc_number: null,
	lc_date: null,

	commercial_executive: null,
	pi_number: null,
	lc_value: 0,
	party_bank: null,
	production_complete: false,
	lc_cancel: false,

	export_lc_number: null,
	export_lc_date: null,
	export_lc_expire_date: null,
	up_date: null,
	up_number: null,

	shipment_date: null,
	expiry_date: null,
	at_sight: null,
	amd_date: null,
	amd_count: 0,
	problematical: false,
	epz: false,
	is_rtgs: false,
	is_old_pi: false,
	remarks: null,

	lc_entry: [
		{
			amount: 0,
			ldbc_fdbc: null,
			handover_date: null,
			document_receive_date: null,
			acceptance_date: null,
			maturity_date: null,
			payment_date: null,
			payment_value: 0,

			receive_date: null,
			document_submission_date: null,
			bank_forward_date: null,
		},
	],

	lc_entry_others: [
		{
			ud_no: null,
			ud_received: null,
			up_number: null,
			remarks: null,
		},
	],

	pi: [
		{
			uuid: null,
		},
	],
};

// * Manual LC
export const MANUAL_PI_SCHEMA = {
	pi_uuids: yup.array().of(STRING_REQUIRED),
	marketing_uuid: STRING_REQUIRED,
	party_uuid: STRING_REQUIRED,
	buyer_uuid: STRING_REQUIRED,
	merchandiser_uuid: STRING.nullable(),
	factory_uuid: STRING_REQUIRED,
	bank_uuid: STRING_REQUIRED,
	validity: NUMBER_REQUIRED,
	payment: NUMBER_REQUIRED,
	receive_amount: NUMBER_DOUBLE_REQUIRED,
	weight: NUMBER_DOUBLE_REQUIRED,
	date: STRING_REQUIRED,
	pi_number: STRING_REQUIRED,
	remarks: STRING.nullable(),

	manual_zipper_pi_entry: yup
		.array()
		.of(
			yup.object().shape({
				order_number: STRING_REQUIRED,
				po: STRING.nullable(),
				style: STRING.nullable(),
				size: STRING.nullable(),
				item: STRING.nullable(),
				specification: STRING_REQUIRED,
				quantity: NUMBER_REQUIRED,
				unit_price: NUMBER_DOUBLE_REQUIRED,
				is_zipper: BOOLEAN_DEFAULT_VALUE(true),
			})
		)
		.optional(),
	manual_thread_pi_entry: yup
		.array()
		.of(
			yup.object().shape({
				order_number: STRING_REQUIRED,
				po: STRING.nullable(),
				style: STRING.nullable(),
				size: STRING.nullable(),
				quantity: NUMBER_REQUIRED,
				unit_price: NUMBER_DOUBLE_REQUIRED,
				is_zipper: BOOLEAN_DEFAULT_VALUE(false),
			})
		)
		.optional(),
};

export const MANUAL_PI_NULL = {
	pi_uuids: [],
	marketing_uuid: null,
	party_uuid: null,
	buyer_uuid: null,
	merchandiser_uuid: null,
	factory_uuid: null,
	bank_uuid: null,
	validity: 0,
	payment: 0,
	receive_amount: 0,
	weight: 0,
	date: null,
	pi_number: null,
	remarks: null,

	manual_zipper_pi_entry: [],
	manual_thread_pi_entry: [],
};
// Thread
// Count Length
export const THREAD_COUNT_LENGTH_SCHEMA = {
	count: STRING_REQUIRED,
	length: NUMBER_REQUIRED,
	min_weight: NUMBER_DOUBLE_REQUIRED.max(
		yup.ref('max_weight'),
		'Beyond Max Weight'
	),
	max_weight: NUMBER_DOUBLE_REQUIRED.min(
		yup.ref('min_weight'),
		'Less than Min Weight'
	),
	con_per_carton: NUMBER_REQUIRED.default(0),
	price: NUMBER_DOUBLE_REQUIRED,
	sst: STRING_REQUIRED,
	remarks: STRING.nullable(),
};

export const THREAD_COUNT_LENGTH_NULL = {
	uuid: null,
	count: '',
	length: '',
	min_weight: null,
	max_weight: null,
	con_per_carton: 0,
	price: null,
	sst: '',
	remarks: '',
};
// Thread Machine
export const THREAD_MACHINE_SCHEMA = {
	name: NAME_REQUIRED,
	max_capacity: NUMBER_DOUBLE_REQUIRED.min(
		yup.ref('min_capacity'),
		'Less than Min Capacity'
	),
	min_capacity: NUMBER_DOUBLE_REQUIRED.max(
		yup.ref('max_capacity'),
		'Beyond Max Capacity'
	),
	is_nylon: BOOLEAN.transform(handelNumberDefaultValue).default(false),
	is_metal: BOOLEAN.transform(handelNumberDefaultValue).default(false),
	is_vislon: BOOLEAN.transform(handelNumberDefaultValue).default(false),
	is_sewing_thread: BOOLEAN.transform(handelNumberDefaultValue).default(
		false
	),
	is_bulk: BOOLEAN.transform(handelNumberDefaultValue).default(false),
	is_sample: BOOLEAN.transform(handelNumberDefaultValue).default(false),
	water_capacity: NUMBER_REQUIRED,
	remarks: STRING.nullable(),
};

export const THREAD_MACHINE_NULL = {
	uuid: null,
	name: '',
	min_capacity: null,
	max_capacity: null,
	is_nylon: false,
	is_metal: false,
	is_vislon: false,
	is_sewing_thread: false,
	is_bulk: false,
	is_sample: false,
	water_capacity: null,
	remarks: '',
};

// Thread DyesCategory
export const THREAD_DYES_CATEGORY_SCHEMA = {
	name: NAME_REQUIRED,
	id: NUMBER_REQUIRED,
	bleaching: STRING_REQUIRED,
	upto_percentage: NUMBER_DOUBLE_REQUIRED,
	remarks: STRING.nullable(),
};

export const THREAD_DYES_CATEGORY_NULL = {
	uuid: null,
	name: '',
	bleaching: '',
	id: null,
	upto_percentage: null,
	remarks: '',
};

// Production Capacity
export const PRODUCTION_CAPACITY_SCHEMA = {
	product: STRING_REQUIRED,
	item: STRING_REQUIRED,
	nylon_stopper: STRING_REQUIRED,
	zipper_number: STRING_REQUIRED,
	end_type: STRING_REQUIRED,
	quantity: NUMBER_REQUIRED.moreThan(0, 'Quantity must be more than 0'),
	remarks: STRING.nullable(),
};

export const PRODUCTION_CAPACITY_NULL = {
	product: 'zipper',
	item: null,
	nylon_stopper: null,
	zipper_number: null,
	end_type: null,
	quantity: 0,
	remarks: '',
};
// Thread Challan
export const THREAD_CHALLAN_SCHEMA = {
	is_hand_delivery: BOOLEAN_DEFAULT_VALUE(false),
	name: STRING.when('is_hand_delivery', {
		is: true,
		then: (Schema) => Schema.required('Required'),
		otherwise: (Schema) => Schema.nullable(),
	}),
	delivery_cost: NUMBER.when('is_hand_delivery', {
		is: true,
		then: (Schema) => Schema.required('Required'),
		otherwise: (Schema) => Schema.nullable(),
	}),
	vehicle_uuid: STRING.when('is_hand_delivery', {
		is: true,
		then: (Schema) => Schema.nullable(),
		otherwise: (Schema) => Schema.required('Required'),
	}),
	received: BOOLEAN_DEFAULT_VALUE(false),
	gate_pass: BOOLEAN_DEFAULT_VALUE(false),
	order_info_uuid: STRING_REQUIRED,
	carton_quantity: NUMBER_REQUIRED,
	remarks: STRING.nullable(),
};

export const THREAD_CHALLAN_NULL = {
	is_hand_delivery: false,
	name: '',
	delivery_cost: 0,
	uuid: null,
	received: false,
	gate_pass: false,
	vehicle_uuid: null,
	order_info_uuid: null,
	remarks: '',
};

// Thread Programs
export const THREAD_PROGRAMS_SCHEMA = {
	dyes_category_uuid: STRING_REQUIRED,
	material_uuid: STRING_REQUIRED,
	quantity: NUMBER_DOUBLE_REQUIRED,
	remarks: STRING.nullable(),
};

export const THREAD_PROGRAMS_NULL = {
	uuid: null,
	dyes_category_uuid: null,
	material_uuid: null,
	quantity: null,
	remarks: '',
};

// Shade Recipe
export const THREAD_SHADE_RECIPE_SCHEMA = {
	name: STRING_REQUIRED,
	sub_streat: STRING_REQUIRED,
	lab_status: STRING,
	remarks: STRING.nullable(),
	thread_shade_recipe_entry: yup.array().of(
		yup.object().shape({
			material_id: NUMBER_REQUIRED,
			quantity: NUMBER_DOUBLE_REQUIRED,
			remarks: STRING.nullable(),
		})
	),
};

export const THREAD_SHADE_RECIPE_NULL = {
	id: null,
	name: '',
	thread_shade_recipe_uuid: null,
	sub_streat: '',
	lab_status: '',
	remarks: '',
	thread_shade_recipe_entry: [
		{
			id: null,
			thread_shade_recipe_uuid: null,
			material_id: null,
			quantity: '',
			remarks: '',
		},
	],
};

// Order Info Entry
export const THREAD_ORDER_INFO_ENTRY_SCHEMA = {
	revision_no: NUMBER_REQUIRED.default(0),
	party_uuid: STRING_REQUIRED,
	marketing_uuid: STRING_REQUIRED,
	factory_uuid: STRING_REQUIRED,
	merchandiser_uuid: STRING.nullable(),
	buyer_uuid: STRING.nullable(),
	is_sample: BOOLEAN.transform(handelNumberDefaultValue).default(false),
	is_bill: BOOLEAN.transform(handelNumberDefaultValue).default(false),
	is_cash: BOOLEAN.transform(handelNumberDefaultValue).default(false),
	is_cancelled: BOOLEAN.default(false),
	delivery_date: yup.date().nullable(),
	remarks: STRING.nullable(),
	order_info_entry: yup.array().of(
		yup.object().shape({
			index: NUMBER_REQUIRED,
			color: STRING_REQUIRED,
			color_ref: STRING.nullable(),
			// shade_recipe_uuid: STRING.nullable(),
			// po: STRING_REQUIRED,
			style: STRING_REQUIRED,
			count_length_uuid: STRING_REQUIRED,
			bleaching: STRING_REQUIRED,
			quantity: NUMBER_REQUIRED.moreThan(
				0,
				'Quantity must be more than 0'
			),
			company_price: NUMBER_DOUBLE_REQUIRED,
			party_price: NUMBER_DOUBLE_REQUIRED,
			remarks: STRING.nullable(),
		})
	),
};

export const THREAD_ORDER_INFO_ENTRY_NULL = {
	revision_no: 0,
	uuid: null,
	party_uuid: null,
	marketing_uuid: null,
	factory_uuid: null,
	merchandiser_uuid: null,
	buyer_uuid: null,
	is_sample: false,
	is_bill: false,
	is_cash: false,
	is_cancelled: false,
	issued_by: null,
	remarks: '',
	delivery_date: null,
	order_info_entry: [
		{
			index: null,
			uuid: null,
			order_info_uuid: null,
			// po: '',
			// shade_recipe_uuid: null,
			style: '',
			color: '',
			color_ref: '',
			count_length_uuid: null,
			bleaching: 'non-bleach',
			quantity: 0,
			company_price: 0,
			party_price: 0,
			remarks: '',
		},
	],
};
//* Thread Coning Schema*//
export const THREAD_CONING_SCHEMA = {
	coning_operator: STRING_REQUIRED,
	coning_supervisor: STRING_REQUIRED,
	coning_machines: STRING_REQUIRED,
	batch_entry: yup.array().of(
		yup.object().shape({
			coning_production_quantity: NUMBER_REQUIRED.max(
				yup.ref('quantity'),
				'Beyond Max Quantity'
			),
			coning_production_quantity_in_kg: NUMBER_REQUIRED,
			transfer_quantity: NUMBER_REQUIRED.max(
				yup.ref('quantity'),
				'Beyond Max Quantity'
			),
		})
	),
	new_finishing_batch_entry: yup.array().of(
		yup.object().shape({
			uuid: STRING,
			dyeing_batch_uuid: STRING,
			sfg_uuid: STRING,
			quantity: NUMBER.max(
				yup.ref('max_quantity'),
				`Beyond Max Quantity`
			),
			remarks: STRING.nullable(),
		})
	),
};

export const THREAD_CONING_NULL = {
	uuid: null,
	coning_operator: '',
	coning_supervisor: '',
	coning_machines: '',
	batch_entry: [
		{
			coning_production_quantity: null,
			coning_production_quantity_in_kg: null,
			transfer_quantity: null,
		},
	],
};

// * Dyeing Planning SNO schema*//
export const DYEING_PLANNING_SNO_SCHEMA = {
	remarks: STRING.nullable(),
	planning_entry: yup.array().of(
		yup.object().shape({
			sno_quantity: NUMBER.nullable() // Allows the field to be null
				.transform((value, originalValue) =>
					String(originalValue).trim() === '' ? null : value
				) // Transforms empty strings to null
				.max(yup.ref('max_sno_quantity'), ({ max }) => {
					return `Beyond Max Quantity of ${Math.floor(max)}`;
				}),

			sno_remarks: STRING.nullable(),
		})
	),
};

export const DYEING_PLANNING_SNO_NULL = {
	week: '',
	remarks: '',
	planning_entry: yup.array().of(
		yup.object().shape({
			sno_quantity: null,
			factory_quantity: null,
			sno_remarks: '',
			factory_remarks: '',
		})
	),
};

// * Dyeing Planning Head Office schema*//
export const DYEING_PLANNING_HEADOFFICE_SCHEMA = {
	remarks: STRING.nullable(),
	planning_entry: yup.array().of(
		yup.object().shape({
			factory_quantity: NUMBER.nullable() // Allows the field to be null
				.transform((value, originalValue) =>
					String(originalValue).trim() === '' ? null : value
				) // Transforms empty strings to null
				.max(yup.ref('max_factory_quantity'), ({ max }) => {
					return `Beyond Max Quantity of ${Math.floor(max)}`;
				}),

			factory_remarks: STRING.nullable(),
		})
	),
};

export const DYEING_PLANNING_HEADOFFICE_NULL = {
	week: '',
	remarks: '',
	planning_entry: yup.array().of(
		yup.object().shape({
			factory_quantity: null,
			factory_remarks: '',
		})
	),
};

// * Dyeing Planning Batch schema*//

export const DYEING_BATCH_SCHEMA = {
	batch_type: STRING_REQUIRED,
	order_info_uuid: STRING.when('batch_type', {
		is: (batch_type) => batch_type === 'extra',
		then: (Schema) => Schema.required('Required'),
		otherwise: (Schema) => Schema.nullable(),
	}),
	machine_uuid: STRING_REQUIRED,
	slot: NUMBER_REQUIRED.moreThan(0, 'Slot should be more than 0'),
	production_date: STRING_REQUIRED,
	remarks: STRING.nullable(),
	dyeing_batch_entry: yup.array().of(
		yup.object().shape({
			quantity: NUMBER.when('batch_type', {
				is: (batch_type) => batch_type === 'extra',
				then: (Schema) => Schema.nullable(),
				otherwise: (Schema) =>
					Schema.max(yup.ref('max_quantity'), `Beyond Max Quantity`),
			}),
			remarks: STRING.nullable(),
			batch_type: STRING.nullable(),
		})
	),
};
export const DYEING_BATCH_SCHEMA_UPDATE = {
	batch_type: STRING_REQUIRED,
	order_info_uuid: STRING.when('batch_type', {
		is: (batch_type) => batch_type === 'extra',
		then: (Schema) => Schema.required('Required'),
		otherwise: (Schema) => Schema.nullable(),
	}),
	machine_uuid: STRING_REQUIRED,
	slot: NUMBER_REQUIRED.moreThan(0, 'Slot should be more than 0'),
	production_date: STRING_REQUIRED,
	remarks: STRING.nullable(),
	dyeing_batch_entry: yup.array().of(
		yup.object().shape({
			quantity: NUMBER.when('batch_type', {
				is: (batch_type) => batch_type === 'extra',
				then: (Schema) => Schema.nullable(),
				otherwise: (Schema) =>
					Schema.max(yup.ref('max_quantity'), `Beyond Max Quantity`),
			}),
			remarks: STRING.nullable(),
			batch_type: STRING.nullable(),
		})
	),
	new_dyeing_batch_entry: yup
		.array()
		.of(
			yup.object().shape({
				quantity: NUMBER.when('batch_type', {
					is: (batch_type) => batch_type === 'extra',
					then: (Schema) => Schema.nullable(),
					otherwise: (Schema) =>
						Schema.max(
							yup.ref('max_quantity'),
							`Beyond Max Quantity`
						),
				}),
				remarks: STRING.nullable(),
				batch_type: STRING.nullable(),
			})
		)
		.optional(),
};

export const DYEING_BATCH_NULL = {
	batch_type: 'normal',
	order_info_uuid: null,
	machine_uuid: null,
	slot: null,
	production_date: null,
	remarks: '',
	dyeing_batch_entry: [
		{
			quantity: null,
			batch_remarks: '',
		},
	],
	new_dyeing_batch_entry: [
		{
			quantity: null,
			batch_remarks: '',
		},
	],
};

// * Dyeing Thread Batch schema*//

export const DYEING_THREAD_BATCH_SCHEMA = {
	batch_type: STRING_REQUIRED,
	order_info_uuid: STRING.when('batch_type', {
		is: (batch_type) => batch_type === 'extra',
		then: (Schema) => Schema.required('Required'),
		otherwise: (Schema) => Schema.nullable(),
	}),
	machine_uuid: STRING_REQUIRED,
	slot: NUMBER_REQUIRED.moreThan(0, 'Slot should be more than 0'),
	production_date: STRING_REQUIRED,
	remarks: STRING.nullable(),
	batch_entry: yup.array().of(
		yup.object().shape({
			quantity: NUMBER.when('batch_type', {
				is: (batch_type) => batch_type === 'extra',
				then: (Schema) => Schema.nullable(),
				otherwise: (Schema) =>
					Schema.max(yup.ref('max_quantity'), `Beyond Max Quantity`),
			}),
			batch_remarks: STRING.nullable(),
			batch_type: STRING.nullable(),
		})
	),
};
export const DYEING_THREAD_BATCH_SCHEMA_UPDATE = {
	batch_type: STRING_REQUIRED,
	order_info_uuid: STRING.when('batch_type', {
		is: (batch_type) => batch_type === 'extra',
		then: (Schema) => Schema.required('Required'),
		otherwise: (Schema) => Schema.nullable(),
	}),
	machine_uuid: STRING_REQUIRED,
	slot: NUMBER_REQUIRED.moreThan(0, 'Slot should be more than 0'),
	production_date: STRING_REQUIRED,
	remarks: STRING.nullable(),
	batch_entry: yup.array().of(
		yup.object().shape({
			quantity: NUMBER.when('batch_type', {
				is: (batch_type) => batch_type === 'extra',
				then: (Schema) => Schema.nullable(),
				otherwise: (Schema) =>
					Schema.max(yup.ref('max_quantity'), `Beyond Max Quantity`),
			}),
			batch_remarks: STRING.nullable(),
			batch_type: STRING.nullable(),
		})
	),

	new_batch_entry: yup
		.array()
		.of(
			yup.object().shape({
				quantity: NUMBER.when('batch_type', {
					is: (batch_type) => batch_type === 'extra',
					then: (Schema) => Schema.nullable(),
					otherwise: (Schema) =>
						Schema.max(
							yup.ref('max_quantity'),
							`Beyond Max Quantity`
						),
				}),
				batch_remarks: STRING.nullable(),
				batch_type: STRING.nullable(),
			})
		)
		.optional(),
};

export const DYEING_THREAD_BATCH_NULL = {
	batch_type: 'normal',
	order_info_uuid: null,
	machine_uuid: null,
	slot: null,
	production_date: null,
	remarks: '',
	batch_entry: [
		{
			quantity: null,
			batch_remarks: '',
		},
	],
};

// * Dyeing Planning Batch production schema*//

export const DYEING_BATCH_PRODUCTION_SCHEMA = {
	yarn_issued: NUMBER_DOUBLE.nullable(),
	dyeing_batch_entry: yup.array().of(
		yup.object().shape({
			production_quantity: NUMBER.nullable() // Allows the field to be null
				.transform((value, originalValue) =>
					String(originalValue).trim() === '' ? null : value
				)
				.max(yup.ref('quantity'), 'Beyond Batch Quantity'), // Transforms empty strings to null
			//
			production_quantity_in_kg: NUMBER_DOUBLE.nullable()
				.transform((value, originalValue) =>
					String(originalValue).trim() === '' ? null : value
				)
				.max(yup.ref('quantity'), 'Beyond Batch Quantity'),
			batch_production_remarks: STRING.nullable(),
		})
	),
};

export const DYEING_BATCH_PRODUCTION_NULL = {
	dyeing_batch_entry: [
		{
			production_quantity: null,
			production_quantity_in_kg: null,
			batch_production_remarks: '',
		},
	],
};
export const DYEING_BATCH_YARN_ISSUE_SCHEMA = {
	yarn_issued: NUMBER_DOUBLE_REQUIRED.moreThan(
		0,
		'Yarn Issued should be more than 0'
	),
};
export const DYEING_BATCH_YARN_ISSUE_NULL = {
	yarn_issued: 0,
};

// * Dyeing Thread Batch Yarn schema*//
export const DYEING_THREAD_BATCH_YARN_SCHEMA = {
	yarn_quantity: NUMBER.moreThan(0),
};
export const DYEING_THREAD_BATCH_YARN_NULL = {
	uuid: null,
	yarn_quantity: null,
};

// * Dyeing Thread Batch Entry Transfer Schema*//
export const DYEING_THREAD_BATCH_ENTRY_TRANSFER_SCHEMA = {
	transfer_quantity: NUMBER.moreThan(0),
};
export const DYEING_THREAD_BATCH_ENTRY_TRANSFER_NULL = {
	uuid: null,
	transfer_quantity: null,
};

// * Dyeing Thread Batch Dyeing schema*//
export const DYEING_THREAD_BATCH_DYEING_SCHEMA = {
	yarn_quantity: NUMBER_REQUIRED,
	dyeing_operator: STRING_REQUIRED,
	reason: STRING_REQUIRED,
	category: STRING_REQUIRED,
	status: STRING_REQUIRED,
	pass_by: STRING_REQUIRED,
	shift: STRING_REQUIRED,
	dyeing_supervisor: STRING_REQUIRED,
	remarks: STRING.nullable(),
};

export const DYEING_THREAD_BATCH_DYEING_NULL = {
	dyeing_operator: '',
	reason: '',
	category: '',
	status: '',
	pass_by: '',
	shift: '',
	dyeing_supervisor: '',
	remarks: '',
};
//* Dyeing Thread Batch Conneing
export const DYEING_THREAD_CONNEING_SCHEMA = {
	uuid: STRING_REQUIRED,
	//yarn_quantity: NUMBER.nullable(),
	machine_uuid: STRING_REQUIRED,
	dyeing_operator: STRING.nullable(),
	reason: STRING.nullable(),
	category: STRING.nullable(),
	status: STRING.nullable(),
	pass_by: STRING.nullable(),
	shift: STRING.nullable(),
	dyeing_supervisor: STRING.nullable(),
	remarks: STRING.nullable(),

	batch_entry: yup.array().of(
		yup.object().shape({
			yarn_quantity: NUMBER_DOUBLE.nullable(),
		})
	),
};

export const DYEING_THREAD_CONNEING_NULL = {
	...DYEING_THREAD_BATCH_DYEING_NULL,
	uuid: '',
	machine_uuid: '',
	dyeing_operator: '',
	reason: '',
	category: '',
	status: 'pending',
	pass_by: '',
	shift: '',
	dyeing_supervisor: '',
	remarks: '',

	batch_entry: [
		{
			uuid: '',
			yarn_quantity: null,
		},
	],
};
// * Dyeing Transfer

export const DYEING_TRANSFER_SCHEMA = {
	dyeing_transfer_entry: yup.array().of(
		yup.object().shape({
			sfg_uuid: STRING.when({
				is: () => yup.ref('order_type') === 'tape',
				then: (schema) => schema.required('Required'),
				otherwise: (schema) => schema.nullable(),
			}),
			order_description_uuid: STRING_REQUIRED,
			colors: yup.array().of(yup.string()).nullable(),
			trx_quantity: NUMBER_DOUBLE.required('Required').transform(
				(value, originalValue) =>
					String(originalValue).trim() === '' ? null : value
			), // Transforms empty strings to null
			remarks: STRING.nullable(),
		})
	),
};

export const DYEING_TRANSFER_NULL = {
	dyeing_transfer_entry: [
		{
			sfg_uuid: null,
			order_description_uuid: null,
			colors: [],
			trx_quantity: null,
			remarks: '',
		},
	],
};

export const UPDATE_DYEING_TRANSFER_SCHEMA = {
	order_description_uuid: UUID_FK,
	trx_quantity: NUMBER_DOUBLE_REQUIRED.transform((value, originalValue) =>
		String(originalValue).trim() === '' ? null : value
	),
	remarks: STRING.nullable(),
};

export const UPDATE_DYEING_TRANSFER_NULL = {
	order_description_uuid: null,
	trx_quantity_in_meter: 0,
	trx_quantity: 0,
	remarks: '',
};

// ? Finishing Batch
// * Finishing Batch Entry

export const FINISHING_BATCH_ENTRY_SCHEMA = {
	order_description_uuid: STRING_REQUIRED,
	slider_lead_time: NUMBER,
	dyeing_lead_time: NUMBER,
	status: STRING_REQUIRED,
	production_date: STRING_REQUIRED,
	finishing_batch_entry: yup.array().of(
		yup.object().shape({
			uuid: STRING,
			dyeing_batch_uuid: STRING,
			sfg_uuid: STRING,
			quantity: NUMBER.default(0).max(
				yup.ref('max_quantity'),
				`Beyond Max Quantity`
			),
			remarks: STRING.nullable(),
		})
	),
	new_finishing_batch_entry: yup.array().of(
		yup.object().shape({
			uuid: STRING,
			dyeing_batch_uuid: STRING,
			sfg_uuid: STRING,
			quantity: NUMBER.default(0).max(
				yup.ref('max_quantity'),
				`Beyond Max Quantity`
			),
			remarks: STRING.nullable(),
		})
	),
};

export const FINISHING_BATCH_ENTRY_NULL = {
	order_description_uuid: null,
	slider_lead_time: null,
	dyeing_lead_time: null,
	status: 'hold',
	production_date: null,
	finishing_batch_entry: [],
	new_finishing_batch_entry: [],
};

// *Slider/Die Casting --> (STOCK)*//
export const SLIDER_DIE_CASTING_STOCK_SCHEMA = {
	name: STRING_REQUIRED, //
	pcs_per_kg: NUMBER_DOUBLE,
	item: STRING.when('type', {
		is: 'body',
		then: (schema) => schema.required('Required'),
		otherwise: (schema) => schema.nullable(),
	}),
	zipper_number: STRING_REQUIRED, //
	end_type: STRING.nullable(), //
	puller_type: STRING.when('type', {
		is: 'puller',
		then: (schema) => schema.required('Required'),
		otherwise: (schema) => schema.nullable(),
	}), //
	logo_type: STRING.nullable(), //
	slider_body_shape: STRING.nullable(), //
	slider_link: STRING.when('type', {
		is: 'link',
		then: (schema) => schema.required('Required'),
		otherwise: (schema) => schema.nullable(),
	}),
	stopper_type: STRING.nullable(), //
	type: STRING_REQUIRED,
	// quantity: NUMBER_REQUIRED, //
	// weight: NUMBER_REQUIRED, //
	// pcs_per_kg: NUMBER_REQUIRED, //
	remarks: STRING.nullable(),
	is_body: BOOLEAN,
	is_puller: BOOLEAN,
	is_cap: BOOLEAN,
	is_link: BOOLEAN,
	is_h_bottom: BOOLEAN,
	is_u_top: BOOLEAN,
	is_box_pin: BOOLEAN,
	is_two_way_pin: BOOLEAN,
	is_logo_body: BOOLEAN.default(false).when('logo_type', {
		is: (value) => value != null && value !== '', // Check if logo_type has a value
		then: (schema) =>
			schema.test(
				'is_logo_body_test',
				'Either logo body or logo puller is required',
				function (value) {
					// Pass if either is_logo_body is true or is_logo_puller is true
					return value || this.parent.is_logo_puller;
				}
			),
		otherwise: (schema) => schema, // No special validation if logo_type is null or empty
	}),
	is_logo_puller: BOOLEAN.default(false).when('logo_type', {
		is: (value) => value != null && value !== '', // Check if logo_type has a value
		then: (schema) =>
			schema.test(
				'is_logo_puller_test',
				'Either logo body or logo puller is required',
				function (value) {
					// Pass if either is_logo_puller is true or is_logo_body is true
					return value || this.parent.is_logo_body;
				}
			),
		otherwise: (schema) => schema, // No special validation if logo_type is null or empty
	}),
};

export const SLIDER_DIE_CASTING_STOCK_NULL = {
	uuid: null,
	name: '',
	item: null,
	zipper_number: null,
	end_type: null,
	puller_type: null,
	logo_type: null,
	slider_body_shape: null,
	slider_link: null,
	stopper_type: null,
	// quantity: null,
	// weight: null,
	pcs_per_kg: 0,
	created_at: '',
	updated_at: '',
	remarks: '',
	is_body: false,
	is_puller: false,
	is_cap: false,
	is_link: false,
	is_h_bottom: false,
	is_u_top: false,
	is_box_pin: false,
	is_two_way_pin: false,
	is_logo_body: false,
	is_logo_puller: false,
};

// * Slider Assembly --> (STOCK)*//
export const SLIDER_ASSEMBLY_STOCK_SCHEMA = {
	name: STRING_REQUIRED, //
	pcs_per_kg: NUMBER_DOUBLE,
	material_uuid: STRING.nullable().transform((value, originalValue) =>
		String(originalValue).trim() === '' ? null : value
	),
	die_casting_body_uuid: STRING.when('material_uuid', {
		is: (value) => value === null || value === '', // Check if material_uuid has a value
		then: (schema) => schema.required('Required'),
		otherwise: (schema) => schema.nullable(),
	}), //
	die_casting_puller_uuid: STRING.when('material_uuid', {
		is: (value) => value === null || value === '', // Check if material_uuid has a value
		then: (schema) => schema.required('Required'),
		otherwise: (schema) => schema.nullable(),
	}), //
	die_casting_cap_uuid: STRING.when('material_uuid', {
		is: (value) => value === null || value === '', // Check if material_uuid has a value
		then: (schema) => schema.required('Required'),
		otherwise: (schema) => schema.nullable(),
	}), //
	die_casting_link_uuid: STRING.nullable().transform(
		(value, originalValue) =>
			String(originalValue).trim() === '' ? null : value
	), //
	remarks: STRING.nullable(),
};

export const SLIDER_ASSEMBLY_STOCK_NULL = {
	name: '',
	pcs_per_kg: 0,
	material_uuid: null,
	die_casting_body_uuid: null,
	die_casting_puller_uuid: null,
	die_casting_cap_uuid: null,
	die_casting_link_uuid: null,

	remarks: '',
};

// * Slider/Dashboard --> (INFO)*//
export const SLIDER_DASHBOARD_INFO_SCHEMA = {
	order_info_uuid: STRING_REQUIRED,
	item: STRING_REQUIRED,
	zipper_number: STRING_REQUIRED,
	end_type: STRING_REQUIRED,
	puller_type: STRING_REQUIRED,
	color: STRING_REQUIRED,
	order_quantity: NUMBER_REQUIRED,
	body_quantity: NUMBER_REQUIRED,
	cap_quantity: NUMBER_REQUIRED,
	puller_quantity: NUMBER_REQUIRED,
	link_quantity: NUMBER_REQUIRED,
	sa_prod: NUMBER_REQUIRED,
	coloring_stock: NUMBER_REQUIRED,
	coloring_prod: NUMBER_REQUIRED,
	trx_to_finishing: NUMBER_REQUIRED,
	u_top_quantity: NUMBER_REQUIRED,
	h_bottom_quantity: NUMBER_REQUIRED,
	box_pin_quantity: NUMBER_REQUIRED,
	two_way_pin_quantity: NUMBER_REQUIRED,
	remarks: STRING.nullable(),
};

export const SLIDER_DASHBOARD_INFO_NULL = {
	uuid: null,
	order_info_uuid: '',
	item: '',
	zipper_number: '',
	end_type: '',
	puller_type: '',
	color: '',
	order_quantity: null,
	body_quantity: null,
	cap_quantity: null,
	puller_quantity: null,
	link_quantity: null,
	sa_prod: null,
	coloring_stock: null,
	coloring_prod: null,
	trx_to_finishing: null,
	u_top_quantity: null,
	h_bottom_quantity: null,
	box_pin_quantity: null,
	two_way_pin_quantity: null,
	remarks: '',
};

// * Slider/Die Casting --> (TRANSFER AGAINST STOCK)*//
export const SLIDER_DIE_CASTING_TRANSFER_AGAINST_STOCK_SCHEMA = {
	section: STRING_REQUIRED,
	order_description_uuid: STRING.when('section', {
		is: (value) => value == 'coloring',
		then: (schema) => schema.required('order is required'),
		otherwise: (schema) => schema.nullable(),
	}),
	stocks: yup.array().of(
		yup.object().shape({
			assigned_quantity: NUMBER.nullable()
				.test('required', 'Must be greater than 0', (value) => {
					if (value === 0) {
						return false;
					}
					return true;
				})
				.max(yup.ref('quantity'), 'Beyond Max Quantity')
				.transform((value, originalValue) =>
					String(originalValue).trim() === '' ? null : value
				),
			assigned_weight: NUMBER_DOUBLE.nullable(),
			remarks: STRING.nullable(),
		})
	),
};

export const SLIDER_DIE_CASTING_TRANSFER_AGAINST_STOCK_NULL = {
	uuid: null,
	order_description_uuid: null,
	section: null,
	is_body: false,
	is_cap: false,
	is_puller: false,
	is_link: false,
	stocks: [],
};

export const SLIDER_DIE_CASTING_TRANSFER_AGAINST_STOCK_UPDATE = {
	quantity: NUMBER_REQUIRED.max(
		yup.ref('max_quantity'),
		'Beyond Max Quantity'
	),
	weight: NUMBER_DOUBLE_REQUIRED.max(
		yup.ref('max_weight'),
		'Beyond Max Quantity'
	),
	remarks: STRING.nullable(),
};

export const SLIDER_DIE_CASTING_TRANSFER_AGAINST_STOCK_UPDATE_NULL = {
	quantity: null,
	weight: null,
	remarks: '',
};

export const SLIDER_DIE_CASTING_TRANSFER_AGAINST_ORDER_UPDATE = {
	trx_quantity: NUMBER_REQUIRED.max(
		yup.ref('max_quantity'),
		'Beyond Max Quantity'
	),
	weight: NUMBER_DOUBLE_REQUIRED.max(
		yup.ref('max_weight'),
		'Beyond Max Quantity'
	),
	remarks: STRING.nullable(),
};

export const SLIDER_DIE_CASTING_TRANSFER_AGAINST_ORDER_UPDATE_NULL = {
	trx_quantity: null,
	weight: null,
	remarks: '',
};

// * Slider/Die Casting --> (TRANSFER AGAINST ORDER)*//
export const SLIDER_DIE_CASTING_TRANSFER_AGAINST_ORDER_SCHEMA = {
	order_info_uuids: yup.array().of(STRING_REQUIRED),
	is_body: BOOLEAN_REQUIRED,
	is_cap: BOOLEAN_REQUIRED,
	is_puller: BOOLEAN_REQUIRED,
	is_link: BOOLEAN_REQUIRED,

	stocks: yup.array().of(
		yup.object().shape({
			is_checked: BOOLEAN_REQUIRED,
			order_number: STRING,
			order_info_uuids: yup.array().of(yup.string()).nullable(),
			name: STRING,
			item_name: STRING,
			zipper_number_name: STRING,
			end_type_name: STRING,
			puller_type_name: STRING,
			logo_type_name: STRING,
			slider_body_shape_name: STRING,
			puller_link_name: STRING,
			stopper_type_name: STRING,
			is_body: BOOLEAN,
			is_cap: BOOLEAN,
			is_puller: BOOLEAN,
			is_link: BOOLEAN,
			is_h_bottom: BOOLEAN,
			is_u_top: BOOLEAN,
			is_box_pin: BOOLEAN,
			is_two_way_pin: BOOLEAN,
			assigned_quantity: NUMBER.required(),
		})
	),
};

export const SLIDER_DIE_CASTING_TRANSFER_AGAINST_ORDER_NULL = {
	uuid: null,
	order_info_uuids: [],
	is_body: false,
	is_cap: false,
	is_puller: false,
	is_link: false,
	stocks: [],
};

// * vislon production
export const VISLON_PRODUCTION_SCHEMA = {
	production_quantity_in_kg: NUMBER_REQUIRED,
	wastage: NUMBER.nullable().transform((value, originalValue) =>
		String(originalValue).trim() === '' ? 0 : value
	),
	remarks: STRING.nullable(),
};

export const VISLON_PRODUCTION_SCHEMA_NULL = {
	production_quantity_in_kg: null,
	wastage: null,
	remarks: '',
};

// * vislon transaction

export const VISLON_TRANSACTION_SCHEMA = {
	trx_quantity_in_kg: NUMBER_DOUBLE_REQUIRED,
	remarks: STRING.nullable(),
};

export const VISLON_TRANSACTION_SCHEMA_NULL = {
	trx_quantity_in_kg: null,
	remarks: '',
};

// * Metal Teeth Molding Production
export const METAL_TEETH_MOLDING_PRODUCTION_SCHEMA = {
	production_quantity: NUMBER_REQUIRED,
	production_quantity_in_kg: NUMBER_DOUBLE_REQUIRED,
	wastage: NUMBER,
	remarks: STRING.nullable(),
};

export const METAL_TEETH_MOLDING_PRODUCTION_SCHEMA_NULL = {
	uuid: null,
	production_quantity: null,
	production_quantity_in_kg: null,
	wastage: null,
	remarks: null,
};

// * SFG PRODUCTION

export const SFG_PRODUCTION_SCHEMA_IN_KG = {
	production_quantity_in_kg: NUMBER_DOUBLE_REQUIRED.moreThan(
		0,
		'More Than 0'
	),
	remarks: STRING.nullable(),
};

export const SFG_PRODUCTION_SCHEMA_IN_KG_NULL = {
	uuid: null,
	order_entry_uuid: null,
	section: '',
	production_quantity_in_kg: '',
	remarks: '',
};

export const SFG_PRODUCTION_SCHEMA_IN_PCS = {
	production_quantity: NUMBER_REQUIRED.moreThan(0, 'More Than 0'),
	wastage: NUMBER_DOUBLE.min(0, 'Minimum of 0')
		.nullable()
		.transform((value, originalValue) =>
			String(originalValue).trim() === '' ? 0 : value
		),
	remarks: STRING.nullable(),
};

export const SFG_PRODUCTION_SCHEMA_IN_PCS_NULL = {
	uuid: null,
	order_entry_uuid: null,
	section: '',
	production_quantity: '',
	wastage: '',
	remarks: '',
};

export const SFG_PRODUCTION_SCHEMA = {
	...SFG_PRODUCTION_SCHEMA_IN_KG,
	...SFG_PRODUCTION_SCHEMA_IN_PCS,
};

export const SFG_PRODUCTION_NULL = {
	...SFG_PRODUCTION_SCHEMA_IN_KG_NULL,
	...SFG_PRODUCTION_SCHEMA_IN_PCS_NULL,
};

export const SFG_PRODUCTION_SCHEMA_NULL = {
	...SFG_PRODUCTION_SCHEMA_IN_KG_NULL,
	...SFG_PRODUCTION_SCHEMA_IN_PCS_NULL,
};

// * SFG transaction in kg
export const SFG_TRANSACTION_SCHEMA_IN_KG = {
	trx_quantity_in_kg: NUMBER_REQUIRED,
	remarks: STRING.nullable(),
};

export const SFG_TRANSACTION_SCHEMA_IN_KG_NULL = {
	trx_quantity_in_kg: null,
	remarks: '',
};

// * SFG transaction in pcs
export const SFG_TRANSACTION_SCHEMA_IN_PCS = {
	trx_quantity: NUMBER_REQUIRED.moreThan(0, 'More Than 0'),
	remarks: STRING.nullable(),
};

export const SFG_TRANSACTION_SCHEMA_IN_PCS_NULL = {
	trx_quantity_in_kg: null,
	trx_quantity: null,
	remarks: '',
};

// * SFG transaction
export const SFG_TRANSACTION_SCHEMA = {
	...SFG_TRANSACTION_SCHEMA_IN_KG,
	...SFG_TRANSACTION_SCHEMA_IN_PCS,
};

export const SFG_TRANSACTION_SCHEMA_NULL = {
	...SFG_TRANSACTION_SCHEMA_IN_KG_NULL,
	...SFG_TRANSACTION_SCHEMA_IN_PCS_NULL,
};

export const POLY_SCHEMA = {
	quantity: NUMBER_REQUIRED,
	remarks: STRING.nullable(),
};

export const POLY_NULL = {
	uuid: null,
	quantity: null,
	remarks: '',
};
// * Warehouse Receive
export const WAREHOUSE_RECEIVE_SCHEMA = {
	option: STRING_REQUIRED,
	packet_list_uuid: STRING.nullable(),
	entry: yup.array().of(
		yup.object().shape({
			remarks: STRING.nullable(),
		})
	),
};
export const WAREHOUSE_RECEIVE_NULL = {
	packet_list_uuid: null,
	option: 'warehouse_receive',
	entry: [],
};
// * Gate Pass
export const GATE_PASS_SCHEMA = {
	challan_uuid: STRING_REQUIRED,
	entry: yup.array().of(
		yup.object().shape({
			remarks: STRING.nullable(),
		})
	),
};
export const GATE_PASS_NULL = {
	challan_uuid: null,
	entry: [],
};

// * Challan By Date
export const CHALlAN_BY_DATE_SCHEMA = {
	date: STRING_REQUIRED,
};
export const CHALlAN_BY_DATE_SCHEMA_NULL = {
	date: null,
};

// * Marketing * //
// Marketing Team

export const MARKETING_TEAM_SCHEMA = {
	name: STRING_REQUIRED,
	remarks: STRING.nullable(),

	marketing_team_entry: yup.array().of(
		yup.object().shape({
			marketing_uuid: STRING_REQUIRED,
			is_team_leader: BOOLEAN_DEFAULT_VALUE(false),
			remarks: STRING.nullable(),
		})
	),
};

export const MARKETING_TEAM_NULL = {
	uuid: null,
	name: '',
	remarks: '',
	marketing_team_entry: [],
};

// marketing targers

export const MARKETING_TARGET_SCHEMA = {
	marketing_uuid: STRING_REQUIRED,
	year: NUMBER_REQUIRED.min(
		new Date().getFullYear(),
		'Minimum of Current Year'
	),
	month: NUMBER_REQUIRED.min(1, 'Minimum of 1').max(12, 'Maximum of 12'),
	zipper_amount: NUMBER_REQUIRED.moreThan(0, 'More Than 0'),
	thread_amount: NUMBER_REQUIRED.moreThan(0, 'More Than 0'),
	remarks: STRING.nullable(),
};

export const MARKETING_TARGET_NULL = {
	marketing_uuid: null,
	year: null,
	month: null,
	zipper_amount: null,
	thread_amount: null,
	remarks: null,
};

export const MAINTENANCE_MACHINE_SCHEMA = {
	section: STRING_REQUIRED,
	name: STRING_REQUIRED,
	status: BOOLEAN_REQUIRED,
	remarks: STRING.nullable(),
};

export const MAINTENANCE_MACHINE_NULL = {
	section: '',
	name: '',
	status: false,
	remarks: '',
};

export const ISSUE_SCHEMA = {
	section: STRING_REQUIRED,
	extra_section: STRING.default('normal'),
	problem_type: STRING_REQUIRED,
	parts_problem: STRING.nullable(),
	section_machine_uuid: STRING_REQUIRED,
	description: STRING,
	emergence: STRING_REQUIRED,
};

export const ISSUE_NULL = {
	section: '',
	extra_section: 'normal',
	problem_type: '',
	parts_problem: null,
	section_machine_uuid: '',
	description: '',
	emergence: '',
};

export const ISSUE_PROCUREMENT_SCHEMA = {
	material_uuid: STRING_REQUIRED,
	quantity: NUMBER_REQUIRED.moreThan(0, 'More Than 0'),
	description: STRING,
};

export const ISSUE_PROCUREMENT_NULL = {
	material_uuid: '',
	quantity: null,
	description: '',
};
