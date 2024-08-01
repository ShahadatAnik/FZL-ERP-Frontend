import { AddModal } from "@/components/Modal";
import { useAuth } from "@/context/auth";
import { useFetchForRhfReset, useRHF, useUpdateFunc } from "@/hooks";
import { FormField, Input, ReactSelect } from "@/ui";
import GetDateTime from "@/util/GetDateTime";
import { SFG_TRANSFER_LOG_NULL, SFG_TRANSFER_LOG_SCHEMA } from "@util/Schema";

export default function Index({
	modalId = "",
	setTeethColoringLog,
	updateTeethColoringLog = {
		id: null,
		trx_from: null,
		trx_to: null,
		trx_quantity: null,
		order_description: null,
		order_quantity: null,
		teeth_coloring_prod: null,
		finishing_stock: null,
		order_entry_id: null,
	},
	setUpdateTeethColoringLog,
}) {
	const MAX_QUANTITY =
		updateTeethColoringLog?.teeth_coloring_prod +
		updateTeethColoringLog?.trx_quantity;
	const schema = {
		...SFG_TRANSFER_LOG_SCHEMA,
		trx_quantity: SFG_TRANSFER_LOG_SCHEMA.trx_quantity.max(MAX_QUANTITY),
	};
	const { user } = useAuth();
	const {
		register,
		handleSubmit,
		errors,
		control,
		Controller,
		reset,
		getValues,
	} = useRHF(schema, SFG_TRANSFER_LOG_NULL);

	useFetchForRhfReset(
		`/sfg/trx/by/id/${updateTeethColoringLog?.id}`,
		updateTeethColoringLog?.id,
		reset
	);

	const onClose = () => {
		setUpdateTeethColoringLog((prev) => ({
			...prev,
			id: null,
			trx_from: null,
			trx_to: null,
			trx_quantity: null,
			order_description: null,
			order_quantity: null,
			teeth_coloring_prod: null,
			finishing_stock: null,
			order_entry_id: null,
		}));
		reset(SFG_TRANSFER_LOG_NULL);
		window[modalId].close();
	};

	const onSubmit = async (data) => {
		// Update item
		if (updateTeethColoringLog?.id !== null) {
			const updatedData = {
				...data,
				order_entry_id: updateTeethColoringLog?.order_entry_id,
				updated_at: GetDateTime(),
			};

			await useUpdateFunc({
				uri: `/sfg/trx/${updateTeethColoringLog?.id}/${updateTeethColoringLog?.order_description}`,
				itemId: updateTeethColoringLog?.id,
				data: data,
				updatedData: updatedData,
				setItems: setTeethColoringLog,
				onClose: onClose,
			});

			return;
		}
	};

	const transactionArea = [
		{ label: "Dying and Iron", value: "dying_and_iron_stock" },
		{ label: "Teeth Molding", value: "teeth_molding_stock" },
		{ label: "Teeth Coloring", value: "teeth_coloring_stock" },
		{ label: "Finishing", value: "finishing_stock" },
		{ label: "Slider Assembly", value: "slider_assembly_stock" },
		{ label: "Coloring", value: "coloring_stock" },
	];

	return (
		<AddModal
			id={modalId}
			title={`Teeth Molding SFG Transfer Log`}
			onSubmit={handleSubmit(onSubmit)}
			onClose={onClose}
			isSmall={true}
		>
			<FormField label="trx_to" title="Trx to" errors={errors}>
				<Controller
					name={"trx_to"}
					control={control}
					render={({ field: { onChange } }) => {
						return (
							<ReactSelect
								placeholder="Select Transaction Area"
								options={transactionArea}
								value={transactionArea?.find(
									(item) => item.value == getValues("trx_to")
								)}
								onChange={(e) => onChange(e.value)}
								isDisabled={updateTeethColoringLog?.id !== null}
							/>
						);
					}}
				/>
			</FormField>
			<Input
				label="trx_quantity"
				sub_label={`Max: ${MAX_QUANTITY}`}
				{...{ register, errors }}
			/>
			<Input label="remarks" {...{ register, errors }} />
		</AddModal>
	);
}
