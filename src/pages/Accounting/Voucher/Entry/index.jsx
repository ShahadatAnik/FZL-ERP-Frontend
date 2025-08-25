import { lazy, useState } from 'react';
import { FormProvider } from 'react-hook-form';
import { useParams } from 'react-router-dom';

import { Suspense } from '@/components/Feedback';
import { Footer } from '@/components/Modal/ui';

import { DevTool } from '@/lib/react-hook-devtool';

import { VOUCHER_NULLABLE, VOUCHER_SCHEMA } from '../config/schema';
import Header from './components/Header';
import TotalsRow from './components/TotalRow';
import VoucherEntryRow from './components/VoucherEntryRow';
import { useVoucherNestedEntries } from './hooks/useNestedEntries';
import { useVoucherData } from './hooks/useVoucherData';
import { useVoucherEntries } from './hooks/useVoucherEntries';
import { useVoucherForm } from './hooks/useVoucherForm';
import { useVoucherSubmission } from './hooks/useVoucherSubmission';

const CostCenterAdd = lazy(() => import('./components/CostCenterAdd'));
const DeleteModal = lazy(() => import('@/components/Modal/Delete'));

export default function Index() {
	const { uuid } = useParams();

	// State
	const [deleteItem, setDeleteItem] = useState({
		itemId: null,
		itemName: null,
	});
	const [updateItem, setUpdateItem] = useState({ uuid: null });

	// Data fetching
	const {
		voucherURL,
		deleteData,
		voucherData,
		postData,
		invalidateVoucher,
		isVoucherLoading,
		ledgerOptions,
		invalidateLedger,
		currencyOptions,
		isCurrencyLoading,
		isUpdate,
	} = useVoucherData(uuid);

	// Form management
	const formProps = useVoucherForm({
		schema: VOUCHER_SCHEMA,
		nullableDefaults: VOUCHER_NULLABLE,
		currencyOptions,
		isCurrencyLoading,
		data: voucherData,
		isDataLoading: isVoucherLoading,
	});

	const {
		register,
		handleSubmit,
		errors,
		reset,
		control,
		Controller,
		getValues,
		watch,
		setValue,
		setError,
		context: form,
		voucherFields,
	} = formProps;

	// Entry management
	const entryProps = useVoucherEntries({
		watch,
		setValue,
		getValues,
		append: formProps.append,
		remove: formProps.remove,
		voucherFields,
		setDeleteItem,
	});

	const nestedEntryProps = useVoucherNestedEntries({
		watch,
		setValue,
		setDeleteItem,
	});

	// Form submission
	const onSubmit = useVoucherSubmission({
		isUpdate,
		uuid,
		reset,
		VOUCHER_NULLABLE,
		voucherURL,
		setError,
	});

	const rowClass = 'border px-3 py-2 text-sm align-center';
	const currencySymbol = currencyOptions?.find(
		(c) => c.value === getValues('currency_uuid')
	)?.symbol;

	// Loading state
	if (isCurrencyLoading) {
		return <span className='loading loading-dots loading-lg z-50' />;
	}

	return (
		<FormProvider {...form}>
			<form
				onSubmit={handleSubmit(onSubmit)}
				noValidate
				className='flex flex-col gap-4'
			>
				<Header
					register={register}
					errors={errors}
					control={control}
					getValues={getValues}
					setValue={setValue}
					Controller={Controller}
					watch={watch}
					isUpdate={isUpdate}
					currencyOptions={currencyOptions}
				/>

				<VoucherEntryRow
					control={control}
					register={register}
					errors={errors}
					Controller={Controller}
					watch={watch}
					setValue={setValue}
					ledgerOptions={ledgerOptions}
					invalidateLedger={invalidateLedger}
					voucherFields={voucherFields}
					currencyOptions={currencyOptions}
					{...entryProps}
					{...nestedEntryProps}
					setUpdateItem={setUpdateItem}
				>
					{voucherFields.length > 0 && (
						<TotalsRow
							register={register}
							control={control}
							errors={errors}
							rowClass={rowClass}
							currencySymbol={currencySymbol}
							precision={2}
						/>
					)}
				</VoucherEntryRow>

				<Footer buttonClassName='!btn-primary' />
				<DevTool placement='top-left' control={control} />
			</form>

			<Suspense>
				<CostCenterAdd
					modalId='voucher_entry_cost_center_add'
					updateItem={updateItem}
					setUpdateItem={setUpdateItem}
					postData={postData}
				/>
				<DeleteModal
					modalId='voucher_entry_delete'
					title='Delete Voucher Entry'
					deleteItem={deleteItem}
					setDeleteItem={setDeleteItem}
					setItems={deleteItem}
					invalidateQuery={invalidateVoucher}
					url='/acc/voucher-entry'
					deleteData={deleteData}
				/>
				<DeleteModal
					modalId='cost_center_delete'
					title='Delete Cost Center Entry'
					deleteItem={deleteItem}
					setDeleteItem={setDeleteItem}
					invalidateQuery={invalidateVoucher}
					setItems={deleteItem}
					url='/acc/voucher-entry-cost-center'
					deleteData={deleteData}
				/>
				<DeleteModal
					modalId='voucher_entry_payment_delete'
					title='Delete Payment'
					deleteItem={deleteItem}
					setDeleteItem={setDeleteItem}
					invalidateQuery={invalidateVoucher}
					setItems={deleteItem}
					url='/acc/voucher-entry-payment'
					deleteData={deleteData}
				/>
			</Suspense>
		</FormProvider>
	);
}
