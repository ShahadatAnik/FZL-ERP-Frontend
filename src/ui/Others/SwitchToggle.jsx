import cn from '@/lib/cn';

const SwitchToggle = ({ className, ...props }) => {
	return (
		<input
			type='checkbox'
			className={cn('toggle toggle-md checked:toggle-accent', className)}
			defaultChecked
			{...props}
		/>
	);
};

export default SwitchToggle;