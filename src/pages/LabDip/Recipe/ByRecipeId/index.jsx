import { useEffect } from 'react';
import { useLabDipRecipeDetailsByUUID } from '@/state/LabDip';
import { useParams } from 'react-router';
import { useAccess } from '@/hooks';

import Information from './Information';
import Table from './Table';

export default function Index() {
	const { recipe_uuid } = useParams();
	const haveAccess = useAccess('store__receive_by_uuid');

	const { data: recipe, isLoading } =
		useLabDipRecipeDetailsByUUID(recipe_uuid);

	useEffect(() => {
		document.title = 'Recipe Details';
	}, []);

	// if (!recipe) return <Navigate to='/not-found' />;
	if (isLoading)
		return <span className='loading loading-dots loading-lg z-50' />;

	return (
		<div className='space-y-2'>
			<Information recipe={recipe} />
			<Table {...recipe} />
		</div>
	);
}
