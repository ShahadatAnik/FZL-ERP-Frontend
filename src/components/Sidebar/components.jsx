import { PRIVATE_ROUTES } from '@/routes';
import { useAuth } from '@context/auth';
import { useState } from 'react';
import { NavLink } from 'react-router-dom';
import './index.css';
import { BrandLink, LogoutButton, MenuIcon, Row, SectionButton } from './utils';

const ThirdChildMenu = ({ items, type }) => {
	const [isOpened, setIsOpened] = useState(true);

	return (
		<li key={type} className={`${!isOpened && 'mb-2'}`}>
			<SectionButton {...{ isOpened, setIsOpened, type }} />
			{isOpened && (
				<ul className='text-md pl-2 text-primary-content transition-all duration-500 ease-in-out md:pl-4'>
					{items.map((item) => (
						<Row key={item.path} {...{ item }} />
					))}
				</ul>
			)}
		</li>
	);
};

const SecondChildMenu = ({ items }) => {
	return Object.entries(items).map(([type, items]) => (
		<ThirdChildMenu key={type} {...{ items, type }} />
	));
};

function FirstChildMenu(items) {
	if (showingColumns.includes(items.type)) {
		return <SecondChildMenu key={items.type} items={items.items} />;
	}
	return <Row key={items.path} {...{ item: items }} />;
}

const Menu = ({ items, type }) => {
	const [isOpened, setIsOpened] = useState(true);

	let { obj, parentObj } = items.reduce(
		(acc, item) => {
			if (Array.isArray(item.type)) {
				acc.obj[item.type[1]] = [
					...(acc.obj[item.type[1]] || []),
					item,
				];
				acc.parentObj[item.type[0]] = acc.obj;
			}
			return acc;
		},
		{ obj: {}, parentObj: {} }
	);

	const finalItems = [
		...items.filter((item) => !Array.isArray(item.type)),
		...Object.entries(parentObj).map(([key, value]) => ({
			type: key,
			items: value,
		})),
	];

	return (
		<li
			className={
				!isOpened
					? 'mb-2'
					: 'rounded-md border-b-2 border-l-2 border-secondary'
			}>
			<SectionButton {...{ isOpened, setIsOpened, type }} />
			{isOpened && (
				<ul className='text-md pl-2 text-primary-content transition-all duration-500 ease-in-out md:pl-4'>
					{finalItems.map((item) => ({ ...FirstChildMenu(item) }))}
				</ul>
			)}
		</li>
	);
};

const SingleMenu = ({ items }) => {
	const cls = `block border-l-[3.5px] border-secondary px-2 py-[5px] duration-500`;
	return (
		<ul className='text-md pl-2 text-primary-content transition-all duration-500 ease-in-out md:pl-4'>
			{items.map((item) => (
				<NavLink
					to={item.path}
					key={item.path}
					className={(nav) =>
						nav.isActive
							? `thick-border-active rounded-r-md text-secondary-content ${cls}`
							: `thick-border hover:text-secondary-content ${cls}`
					}>
					{item.name}
				</NavLink>
			))}
		</ul>
	);
};

const getRoutes = () => {
	const { can_access } = useAuth();

	return (
		PRIVATE_ROUTES.filter(
			({ page_name, hidden }) =>
				page_name === 'admin__public' ||
				(!hidden &&
					page_name !== undefined &&
					can_access?.[page_name]?.includes('read'))
		) || {}
	);
};

// for testing
// const FilteredRoutes = (can_access) =>
// 	PRIVATE_ROUTES.filter((item) => !item.hidden);

// Rest of the code remains the same
const showingColumns = ['common', 'metal', 'vislon', 'nylon', 'slider'];
const Sidebar = () => {
	const routes = getRoutes();

	function filterRoutes(type) {
		return routes.filter(
			(item) =>
				(Array.isArray(item.type) ? item.type[0] : item.type) === type
		);
	}

	function filterRoutesIndividual(type) {
		return routes.filter((item) => item?.view === 'individual');
	}

	const pages = {
		// if it is a nested route, then the parent name should be in ⇾ showingColumns
		order: filterRoutes('order'),
		thread: filterRoutes('thread'),
		commercial: filterRoutes('commercial'),
		delivery: filterRoutes('delivery'),
		store: filterRoutes('store'),
		common: filterRoutes('common'),
		dyeing: filterRoutes('dyeing'),
		nylon: filterRoutes('nylon'),
		vislon: filterRoutes('vislon'),
		metal: filterRoutes('metal'),
		slider: filterRoutes('slider'),
		hr: filterRoutes('hr'),
		library: filterRoutes('library'),
		report: filterRoutes('report'),
	};

	const individualPages = {
		// if it is a nested route, then the parent name should be in ⇾ showingColumns
		dashboard: filterRoutesIndividual('dashboard'),
	};

	return (
		<div className='min-h-full bg-primary p-4'>
			<BrandLink className='flex items-center justify-center py-1 text-2xl font-bold text-primary-content md:text-4xl' />
			<hr className='my-2 border-primary-content border-opacity-90' />
			<div className='flex flex-col overflow-auto px-4'>
				<ul className='my-2 flex-1 space-y-6 text-sm font-medium'>
					{Object.entries(individualPages).map(
						([type, items]) =>
							items.length > 0 && (
								<SingleMenu key={type} {...{ items }} />
							)
					)}
					{Object.entries(pages).map(
						([type, items]) =>
							items.length > 0 && (
								<Menu key={type} {...{ items, type }} />
							)
					)}
					<LogoutButton />
				</ul>
			</div>
		</div>
	);
};

const MobileHeader = ({ id }) => {
	return (
		<header className='flex items-center justify-between bg-primary px-2 text-primary-content md:hidden'>
			<BrandLink className='block truncate whitespace-nowrap text-2xl font-bold text-primary-content' />
			<div className='flex items-center'>
				<MenuIcon id={id} />
			</div>
		</header>
	);
};

const Aside = ({ id }) => {
	return (
		<aside className='drawer-side min-w-[14rem]'>
			<label
				htmlFor={id}
				aria-label='close sidebar'
				className='drawer-overlay'
			/>
			<Sidebar />
		</aside>
	);
};

export { Aside, MobileHeader, Sidebar };
