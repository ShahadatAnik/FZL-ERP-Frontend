import { ArrowBack, PDF, TransferIn } from '@/assets/icons';
import { Eye, MessageCircleReply, Send } from 'lucide-react';

import BadgeCheckbox from './BadgeCheckbox';
import { EditDelete } from './EditDelete';
import StatusButton from './StatusButton';

const ResetPassword = ({ onClick }) => {
	return (
		<button
			type='button'
			className='btn btn-circle btn-accent btn-xs font-semibold'
			onClick={onClick}
		>
			<ArrowBack className='w-4' />
		</button>
	);
};

function Pdf({ props }) {
	return (
		<button
			className='btn btn-xs rounded-full bg-secondary text-secondary-content'
			{...props}
		>
			PDF
			<PDF className='h-4 w-4' />
		</button>
	);
}

const Transfer = ({ onClick, disabled = false }) => {
	return (
		<button
			disabled={disabled}
			type='button'
			className='btn btn-circle btn-accent btn-sm font-semibold text-white shadow-md'
			onClick={onClick}
		>
			<TransferIn className='w-4' />
		</button>
	);
};
const WhatsApp = ({ onClick, disabled = false }) => {
	return (
		<button
			disabled={disabled}
			type='button'
			className='btn btn-circle btn-accent btn-sm font-semibold text-white shadow-md'
			onClick={onClick}
		>
			<Send className='w-4' />
		</button>
	);
};
const EyeBtn = ({ onClick, disabled = false }) => {
	return (
		<button
			disabled={disabled}
			type='button'
			className='btn btn-circle btn-accent btn-sm font-semibold text-white shadow-md'
			onClick={onClick}
		>
			<Eye className='w-4' />
		</button>
	);
};

export {
	BadgeCheckbox,
	EditDelete,
	Pdf,
	ResetPassword,
	StatusButton,
	Transfer,
	WhatsApp,
	EyeBtn,
};
