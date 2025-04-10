import { useEffect, useState } from 'react';
import { useAuth } from '@/context/auth';
import {
	useOtherOrderPropertiesByGarmentsWash,
	useOtherOrderPropertiesBySpecialRequirement,
} from '@/state/Other';
import { useOrderStatementReport } from '@/state/Report';
import { format } from 'date-fns';
import { useAccess } from '@/hooks';

import OrderSheetPdf from '@/components/Pdf/OrderStatement';

import Excel from './Excel';
import Header from './Header';

const getPath = (haveAccess, userUUID) => {
	if (haveAccess.includes('show_own_orders') && userUUID) {
		return `own_uuid=${userUUID}`;
	}

	return ``;
};

export default function index() {
	const haveAccess = useAccess('report__production_statement');
	const { user } = useAuth();

	const [get, setGet] = useState(false);

	const [from, setFrom] = useState(format(new Date(), 'yyyy-MM-dd'));
	const [to, setTo] = useState(format(new Date(), 'yyyy-MM-dd'));
	const [marketing, setMarketing] = useState('');
	const [type, setType] = useState('');
	const [party, setParty] = useState('');

	const { data, isLoading } = useOrderStatementReport(
		from,
		to,
		party,
		marketing,
		type,
		getPath(haveAccess, user?.uuid),
		{
			isEnabled: !!user?.uuid && get,
		}
	);
	const { data: garments } = useOtherOrderPropertiesByGarmentsWash();
	const { data: sr } = useOtherOrderPropertiesBySpecialRequirement();

	useEffect(() => {
		if (get && data && !isLoading) {
			OrderSheetPdf(data, garments, sr, from, to)?.open();
			setGet(false);
		}
	}, [get, data, isLoading]);

	if (isLoading)
		return <span className='loading loading-dots loading-lg z-50' />;

	return (
		<div className='flex flex-col gap-8'>
			<Header
				{...{
					from,
					setFrom,
					to,
					setTo,
					marketing,
					setMarketing,
					type,
					setType,
					party,
					setParty,
				}}
			/>
			<div className='flex gap-2'>
				<button
					type='button'
					onClick={() => {
						setGet(true);
					}}
					className='btn btn-primary flex-1'
				>
					PDF
				</button>
				{/* <button
					type='button'
					onClick={() => Excel(data, from, to)}
					className='btn btn-secondary flex-1'>
					Excel
				</button> */}
			</div>
		</div>
	);
}
