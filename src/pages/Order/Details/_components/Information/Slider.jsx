import { TitleValue } from '@/ui';
import RenderTable from '@/ui/Others/Table/RenderTable';

const renderLogo = (logo_type_name, is_logo_body, is_logo_puller) => {
	if (logo_type_name === '---')
		return <TitleValue title='Logo' value={logo_type_name} />;

	let logoLocations = [];

	if (is_logo_body === 1) logoLocations.push('Body');
	if (is_logo_puller === 1) logoLocations.push('Puller');

	if (logoLocations.length > 0) {
		logo_type_name += ` (${logoLocations.join(', ')})`;
	}

	return <TitleValue title='Logo' value={logo_type_name} />;
};

export default function SliderDescription({ order_description }) {
	const renderItems = () => {
		const {
			slider_name,
			is_slider_provided,
			slider_starting_section,
			bottom_stopper_name,
			top_stopper_name,
		} = order_description;

		const items = [
			{
				label: 'Slider Name',
				value: slider_name,
			},
			{
				label: 'Slider Provided',
				value: is_slider_provided === 1 ? 'Yes' : 'No',
			},
			{
				label: 'Slider Starting Section',
				value: slider_starting_section?.replace(/_/g, ' '),
			},
			{
				label: 'Top Stopper Name',
				value: top_stopper_name,
			},
			{
				label: 'Bottom Stopper Name',
				value: bottom_stopper_name,
			},
		];
		return items;
	};
	return <RenderTable title={'Slider Details'} items={renderItems()} />;
}

// {
// 	renderLogo(
// 		order_description?.logo_type_name,
// 		order_description?.is_logo_body,
// 		order_description?.is_logo_puller
// 	);
// }
