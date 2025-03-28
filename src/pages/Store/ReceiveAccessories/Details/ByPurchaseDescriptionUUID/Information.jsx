import { format } from 'date-fns';

import SectionContainer from '@/ui/Others/SectionContainer';
import RenderTable from '@/ui/Others/Table/RenderTable';

export default function Information({
	purchase = {
		uuid: null,
		purchase_id: null,
		vendor_uuid: null,
		vendor_name: null,
		challan_number: null,
		is_local: null,
		lc_number: null,
		created_by: null,
		created_by_name: null,
		created_at: null,
		updated_at: null,
		remarks: null,
	},
}) {
	const {
		vendor_name,
		lc_number,
		challan_number,
		is_local,
		created_at,
		created_by_name,
		purchase_id,
		remarks,
		updated_at,
	} = purchase;

	const renderItems = () => {
		const items = [
			{
				label: 'Invoice Number',
				value: purchase_id,
			},

			{
				label: 'Vendor',
				value: vendor_name,
			},
			{
				label: 'LC Number',
				value: lc_number,
			},
			{
				label: 'Challan Number',
				value: challan_number,
			},
			{
				label: 'LC/Local',
				value: is_local == 1 ? 'Local' : 'LC',
			},
		];
		const create = [
			{
				label: 'Created By',
				value: created_by_name,
			},
			{
				label: 'Created At',
				value: format(new Date(created_at), 'dd/MM/yyyy - hh:mm a'),
			},
			{
				label: 'Updated At',
				value: format(new Date(updated_at), 'dd/MM/yyyy - hh:mm a'),
			},
			{
				label: 'Remarks',
				value: remarks,
			},
		];

		return {
			items,
			create,
		};
	};

	return (
		<SectionContainer title={'Information'}>
			<div className='grid grid-cols-1 border-secondary/30 lg:grid-cols-2'>
				<RenderTable
					className={'border-secondary/30 lg:border-r'}
					title={'Invoice'}
					items={renderItems().items}
				/>
				<RenderTable
					className={'border-secondary/30 lg:border-r'}
					title={'Created'}
					items={renderItems().create}
				/>
			</div>
		</SectionContainer>
	);
}
