import cn from '@lib/cn';
import { Footer, Header } from '../ui';

function AddModal({
	id,
	title,
	subTitle = '',
	onSubmit,
	onClose,
	children,
	isSmall = false,
	formClassName,
}) {
	return (
		<dialog
			id={id}
			className='modal modal-bottom max-h-screen overflow-hidden sm:modal-middle'>
			<form
				onSubmit={onSubmit}
				noValidate
				method='dialog'
				className={cn(
					'modal-box flex w-full flex-col justify-between bg-base-100 p-6 text-secondary-content',
					!isSmall && 'sm:max-w-5xl',
					formClassName
				)}>
				<Header title={title} subTitle={subTitle} onClose={onClose} />
				<div className='flex flex-col justify-between gap-2 pt-2'>
					{children}
				</div>
				<Footer />
			</form>
		</dialog>
	);
}

export default AddModal;
