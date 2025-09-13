import { useEffect } from 'react';
import { useAuth } from '@/context/auth';
import { useIssue, useIssueByUUID } from '@/state/Maintenance';
import { useOtherSectionMachine } from '@/state/Other';
import { useAccess, useFetchForRhfReset, useRHF } from '@/hooks';

import { AddModal } from '@/components/Modal';
import { ShowLocalToast } from '@/components/Toast';
import { FormField, Input, ReactSelect, Textarea } from '@/ui';

import nanoid from '@/lib/nanoid';
import { DevTool } from '@/lib/react-hook-devtool';
import { ISSUE_NULL, ISSUE_SCHEMA } from '@util/Schema';
import GetDateTime from '@/util/GetDateTime';

import {
	emergenceOptions,
	extraSectionOptions,
	machineVislon,
	partsDyeing,
	partsMetal,
	partsSlider,
	sections,
	types,
} from './utils';

export default function Index({
	modalId = '',
	updateIssueData = {
		uuid: null,
	},
	setUpdateIssueData,
}) {
	const haveAccess = useAccess('maintenance__issue');
	const { user } = useAuth();

	const { data, updateData, postData } = useIssueByUUID(
		updateIssueData?.uuid
	);

	const { invalidateQuery } = useIssue(
		haveAccess.includes('show_own_issue') ? `own_uuid =${user.uuid}` : ''
	);
	const { data: sectionMachines } = useOtherSectionMachine();

	const {
		register,
		handleSubmit,
		errors,
		reset,
		control,
		Controller,
		context,
		getValues,
		watch,
	} = useRHF(ISSUE_SCHEMA, ISSUE_NULL);

	let options = []; // Initialize options as an empty array

	// Dynamically assign options based on the 'section' value
	switch (watch('section')) {
		case 'dyeing':
			options = partsDyeing;
			break;
		case 'vislon':
			options = machineVislon;
			break;
		case 'metal':
			options = partsMetal;
			break;
		case 'slider':
			options = partsSlider;
			break;
		default:
			// Optionally, handle a default case or no selection
			options = [];
			break;
	}

	useEffect(() => {
		if (data) {
			reset(data);
		}
	}, [data]);

	const onClose = () => {
		setUpdateIssueData((prev) => ({
			...prev,
			uuid: null,
		}));
		reset(ISSUE_NULL);
		window[modalId].close();
	};

	const onSubmit = async (data) => {
		// Update item
		if (
			updateIssueData?.uuid !== null &&
			updateIssueData?.uuid !== undefined
		) {
			const updatedData = {
				...data,
				updated_at: GetDateTime(),
				updated_by: user?.uuid,
			};

			await updateData.mutateAsync({
				url: `/maintain/issue/${updateIssueData?.uuid}`,
				uuid: updateIssueData?.uuid,
				updatedData,
				onClose,
			});
			invalidateQuery();
			return;
		}

		// Add new item
		const updatedData = {
			...data,
			uuid: nanoid(),
			created_by: user?.uuid,
			created_at: GetDateTime(),
		};

		await postData.mutateAsync({
			url: '/maintain/issue',
			newData: updatedData,
			onClose,
		});
		invalidateQuery();
	};

	return (
		<AddModal
			id={modalId}
			title={updateIssueData?.uuid !== null ? `Update Issue ` : 'Issue'}
			formContext={context}
			onSubmit={handleSubmit(onSubmit)}
			onClose={onClose}
			isSmall={true}
		>
			<Input label='name' title='Issuer Name' {...{ register, errors }} />
			<div className='flex gap-2'>
				<FormField label='section' title='Section' errors={errors}>
					<Controller
						name={'section'}
						control={control}
						render={({ field: { onChange } }) => {
							return (
								<ReactSelect
									placeholder='Select section'
									options={sections}
									value={sections?.filter(
										(item) =>
											item.value === getValues('section')
									)}
									onChange={(e) => {
										onChange(e.value);
									}}
								/>
							);
						}}
					/>
				</FormField>
				<FormField
					label='extra_section'
					title='Extra Section'
					errors={errors}
				>
					<Controller
						name={'extra_section'}
						control={control}
						render={({ field: { onChange } }) => {
							return (
								<ReactSelect
									placeholder='Select extra section'
									options={extraSectionOptions}
									value={extraSectionOptions?.filter(
										(item) =>
											item.value ===
											getValues('extra_section')
									)}
									onChange={(e) => {
										onChange(e.value);
									}}
								/>
							);
						}}
					/>
				</FormField>
			</div>
			<FormField
				label='problem_type'
				title='Problem Type'
				errors={errors}
			>
				<Controller
					name={'problem_type'}
					control={control}
					render={({ field: { onChange } }) => {
						return (
							<ReactSelect
								placeholder='Select problem type'
								options={types}
								value={types?.filter(
									(item) =>
										item.value === getValues('problem_type')
								)}
								onChange={(e) => {
									onChange(e.value);
								}}
							/>
						);
					}}
				/>
			</FormField>
			{options.length > 0 && (
				<FormField
					label='parts_problem'
					title='Part Problem'
					errors={errors}
				>
					<Controller
						name={'parts_problem'}
						control={control}
						render={({ field: { onChange } }) => {
							return (
								<ReactSelect
									placeholder='Select part problem'
									options={options}
									value={options?.filter(
										(item) =>
											item.value ===
											getValues('parts_problem')
									)}
									onChange={(e) => {
										onChange(e.value);
									}}
								/>
							);
						}}
					/>
				</FormField>
			)}

			<FormField
				label='section_machine_uuid'
				title='Section Machine'
				errors={errors}
			>
				<Controller
					name={'section_machine_uuid'}
					control={control}
					render={({ field: { onChange } }) => {
						return (
							<ReactSelect
								placeholder='Select section machine'
								options={sectionMachines}
								value={sectionMachines?.filter(
									(item) =>
										item.value ===
										getValues('section_machine_uuid')
								)}
								onChange={(e) => {
									onChange(e.value);
								}}
							/>
						);
					}}
				/>
			</FormField>
			<FormField label='emergence' title='Emegence' errors={errors}>
				<Controller
					name={'emergence'}
					control={control}
					render={({ field: { onChange } }) => {
						return (
							<ReactSelect
								// menuPortalTarget={document.body}
								placeholder='Select emergence'
								options={emergenceOptions}
								value={emergenceOptions?.filter(
									(item) =>
										item.value === getValues('emergence')
								)}
								onChange={(e) => {
									onChange(e.value);
								}}
							/>
						);
					}}
				/>
			</FormField>
			<Textarea label='description' rows={4} {...{ register, errors }} />

			<DevTool control={control} placement='top-left' />
		</AddModal>
	);
}
