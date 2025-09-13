import { useEffect } from 'react';
import { useCommercialLCPIByUUID } from '@/state/Commercial';
import { useParams } from 'react-router';

import Information from './Information';
import PI from './PI';
import Table from './Table';
import UD from './UD';

export default function Index() {
	const { lc_number } = useParams();
	const { data, isLoading, invalidateQuery } =
		useCommercialLCPIByUUID(lc_number);

	useEffect(() => {
		invalidateQuery();
		document.title = `LC: ${lc_number}`;
	}, [lc_number]);

	if (isLoading)
		return <span className='loading loading-dots loading-lg z-50' />;

	return (
		<div className='flex flex-col gap-6'>
			<Information lc={data} />
			<Table entries={data?.lc_entry} />
			<UD entries={data?.lc_entry_others} />
			{data?.is_old_pi === 0 && <PI entries={data?.pi} />}
			{data?.is_old_pi === 1 && (
				<PI entries={data?.manual_pi} manualPI={true} />
			)}
		</div>
	);
}
