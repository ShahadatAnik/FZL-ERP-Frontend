import { FormField, SectionEntryBody, SimpleDatePicker } from '@/ui';

export default function Header({
	from = '',
	setFrom = () => {},
	to = '',
	setTo = () => {},
	isLoading,
}) {
	return (
		<div>
			<SectionEntryBody title={'Profit and Loss Report'}>
				<div className='flex gap-2'>
					<FormField label='' title='From'>
						<SimpleDatePicker
							key={'from'}
							value={from}
							placeholder='From'
							onChange={(data) => {
								setFrom(data);
							}}
							selected={from}
							disabled={isLoading}
						/>
					</FormField>
					<FormField label='' title='To'>
						<SimpleDatePicker
							key={'to'}
							value={to}
							placeholder='To'
							onChange={(data) => {
								setTo(data);
							}}
							selected={to}
							disabled={isLoading}
						/>
					</FormField>
				</div>
			</SectionEntryBody>
		</div>
	);
}
