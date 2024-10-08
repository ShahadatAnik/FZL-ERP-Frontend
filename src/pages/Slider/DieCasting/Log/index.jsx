import { useEffect } from 'react';

import RMOrderAgainstLog from './RMOrderAgainstLog';
import RMTransferLog from './RMTransferLog';
import SFGTransferLog from './SFGTransferLog';

export default function Index() {
	useEffect(() => {
		document.title = 'Die Casting Log';
	}, []);
	return (
		<div>
			<RMTransferLog />
			<hr className='my-6 border-2 border-dashed border-secondary-content' />
			{/* <RMOrderAgainstLog /> */}
		</div>
	);
}
