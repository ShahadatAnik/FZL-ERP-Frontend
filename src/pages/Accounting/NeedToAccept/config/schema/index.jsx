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

export const LEDGER_SCHEMA = {
	is_bank_ledger: BOOLEAN_REQUIRED,
	identifier: STRING_REQUIRED,
	table_name: STRING.nullable(),
	table_uuid: STRING.when('table_name', {
		is: (value) => value != null && value !== '',
		then: (schema) => schema.required('Required'),
		otherwise: (schema) => schema.nullable(),
	}),
	name: STRING_REQUIRED,
	// category: STRING_REQUIRED,
	account_no: STRING.when('is_bank_ledger', {
		is: (value) => value === true,
		then: (schema) => schema.required('Required'),
		otherwise: (schema) => schema.nullable(),
	}),
	is_active: BOOLEAN_DEFAULT_VALUE(true),
	restrictions: STRING_REQUIRED.default('none'),
	group_uuid: STRING_REQUIRED,
	vat_deduction: NUMBER_DOUBLE_REQUIRED.default(0),
	tax_deduction: NUMBER_DOUBLE_REQUIRED.default(0),
	old_ledger_id: NUMBER.default(0),
	remarks: STRING.nullable(),
};

export const LEDGER_NULL = {
	is_bank_ledger: false,
	table_name: null,
	table_uuid: null,
	name: '',
	identifier: 'none',
	// category: '',
	account_no: null,
	type: 'asset',
	is_active: true,
	restrictions: 'none',
	group_uuid: '',
	vat_deduction: 0,
	tax_deduction: 0,
	old_ledger_id: 0,
	remarks: null,
};
