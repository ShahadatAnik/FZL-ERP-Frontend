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
} from '@/util/Schema/utils';

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

export const VOUCHER_SCHEMA = {
	date: STRING_REQUIRED,
	category: STRING_REQUIRED,
	vat_deduction: NUMBER_DOUBLE_REQUIRED,
	tax_deduction: NUMBER_DOUBLE_REQUIRED,
	currency_uuid: STRING_REQUIRED,
	conversion_rate: NUMBER_DOUBLE_REQUIRED.min(
		1,
		'Conversion rate must be greater than 0'
	),
	voucher_entry: yup.array().of(
		yup.object().shape({
			ledger_uuid: STRING_REQUIRED,
			amount: NUMBER_DOUBLE_REQUIRED.min(
				1,
				'Amount must be greater than 0'
			),
			type: STRING_REQUIRED,
			voucher_entry_cost_center: yup
				.array()
				.of(
					yup.object().shape({
						cost_center_uuid: STRING_REQUIRED,
						amount: NUMBER_DOUBLE_REQUIRED.min(
							1,
							'Amount must be greater than 0'
						),
					})
				)
				.optional(),
			voucher_entry_payment: yup
				.array()
				.of(
					yup.object().shape({
						payment_type: STRING_REQUIRED,
						trx_no: STRING_REQUIRED,
						amount: NUMBER_DOUBLE_REQUIRED.min(
							1,
							'Amount must be greater than 0'
						),
						date: STRING.nullable(),
					})
				)
				.optional(),
		})
	),
	remarks: STRING.nullable(),
};
export const VOUCHER_NULLABLE = {
	date: null,
	category: null,
	vat_deduction: 0,
	tax_deduction: 0,
	conversion_rate: 1,
	currency_uuid: null,
	voucher_entry: [
		{
			ledger_uuid: null,
			amount: 0,
			type: 'dr',
			voucher_entry_cost_center: [],
			voucher_entry_payment: [],
		},
		{
			ledger_uuid: null,
			amount: 0,
			type: 'cr',
			voucher_entry_cost_center: [],
			voucher_entry_payment: [],
		},
	],
	remarks: null,
};
