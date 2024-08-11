import { lazy } from 'react';

// Pages
// Admin
const User = lazy(() => import('@pages/Library/User'));
const Policy = lazy(() => import('@pages/Library/Policy'));

export const LibraryRoutes = [
	{
		id: 1,
		name: 'Users',
		path: '/library/users',
		element: User,
		type: 'library',
		page_name: 'library__users',
		actions: ['read'],
	},
	{
		id: 2,
		name: 'Policy',
		path: '/library/policy',
		element: Policy,
		type: 'library',
		page_name: 'library__policy',
		actions: ['create', 'read', 'update', 'delete'],
	},
];
