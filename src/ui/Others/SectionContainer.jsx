import cn from '@/lib/cn';

const SectionContainer = ({ title, children, className, buttons }) => {
	return (
		<div className={cn('', className)}>
			<div className='flex items-center gap-2 rounded-t-md bg-primary px-4 py-3 text-2xl font-semibold capitalize leading-tight text-secondary-content md:text-3xl'>
				{title}

				{buttons && buttons.length > 0 && (
					<div className='flex gap-2'>{buttons.map((e) => e)}</div>
				)}
			</div>
			<div className='overflow-hidden rounded-md rounded-t-none border border-secondary/30'>
				{children}
			</div>
		</div>
	);
};

export default SectionContainer;
