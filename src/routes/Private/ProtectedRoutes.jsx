import { FilteredRoutes, PRIVATE_ROUTES } from '@/routes';
import { useAuth } from '@context/auth';
import { Navigate, Outlet } from 'react-router-dom';

// for testing
const haveRegularAccess = () => true;

// * for production
// const haveRegularAccess = () => FilteredRoutes().length > 0;

export default function ProtectedRoutes() {
	const { signed, loading } = useAuth();

	if (loading)
		return <span className='loading loading-dots loading-lg z-50' />;

	if (!signed) return <Navigate to='/login' replace={true} />;

	if (haveRegularAccess()) return <Outlet />;

	return <Navigate to='/no-access' replace={true} />;
}
