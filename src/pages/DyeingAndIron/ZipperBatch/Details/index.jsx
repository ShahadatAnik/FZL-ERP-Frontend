import { useEffect, useMemo, useState } from 'react';
import { useDyeingBatchDetailsByUUID } from '@/state/Dyeing';
import { useLabDipRecipeDetailsByUUID } from '@/state/LabDip';
import { useThreadMachineByUUID } from '@/state/Thread';
import { useParams } from 'react-router-dom';
import { useAccess } from '@/hooks';

import SecondPdf from '@/components/Pdf/ZipperBulkRecipe';
import Pdf from '@/components/Pdf/ZipperTravelCard';

import Information from './Information';
import Table from './Table';

export default function Index() {
	const { batch_uuid } = useParams();
	const haveAccess = useAccess('store__receive_by_uuid');

	const { data: batch, loading } = useDyeingBatchDetailsByUUID(batch_uuid);

	const machine_uuid = batch?.machine_uuid;

	const { data: machine } = useThreadMachineByUUID(machine_uuid);
	const shade_recipe_uuids = batch?.dyeing_batch_entry[0]?.recipe_uuid;

	const { data: shade_recipe } =
		useLabDipRecipeDetailsByUUID(shade_recipe_uuids);

	const volume =
		parseFloat(batch?.total_yarn_quantity) *
		parseFloat(batch?.water_capacity);

	const shade_recipes_entries = useMemo(() => {
		return shade_recipe?.recipe_entry?.map((item) => ({
			...item,
			quantity: Number(item?.quantity).toFixed(5),
			bulk: Number((volume * item?.quantity).toFixed(3)),
		}));
	}, [shade_recipe, volume]);

	const programs = useMemo(() => {
		return shade_recipe?.programs?.map((item) => ({
			...item,
			quantity: Number(item?.quantity).toFixed(5),
			bulk: Number((volume * item?.quantity).toFixed(3)),
		}));
	}, [shade_recipe, volume]);

	useEffect(() => {
		document.title = 'Planning Batch Details';
	}, []);

	// if (!planningSNO) return <Navigate to='/not-found' />;
	const [data, setData] = useState('');

	useEffect(() => {
		if (batch && batch?.dyeing_batch_entry) {
			Pdf(batch)?.getDataUrl((dataUrl) => {
				setData(dataUrl);
			});
		}
	}, [batch]);
	const [secondData, setSecondData] = useState('');

	useEffect(() => {
		if (batch && batch?.dyeing_batch_entry) {
			SecondPdf(batch, shade_recipes_entries, programs)?.getDataUrl(
				(dataUrl) => {
					setSecondData(dataUrl);
				}
			);
		}
	}, [batch]);
	if (loading)
		return <span className='loading loading-dots loading-lg z-50' />;

	return (
		<div className='space-y-2'>
			<iframe
				src={data}
				className='h-[40rem] w-full rounded-md border-none'
			/>
			<iframe
				src={secondData}
				className='h-[40rem] w-full rounded-md border-none'
			/>
			<Information batch={batch} />
			<Table {...batch} />
		</div>
	);
}
