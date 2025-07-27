import { useEffect } from 'react';
import { router } from '@/routes/router';
import AuthProvider from '@context/auth';
import { get } from 'react-hook-form';
import { RouterProvider } from 'react-router/dom';
import { toast } from 'react-toastify';

import { Toast } from '@/components/Toast';

import { Loader } from './components/Feedback';
import { BASE_API, PUBLIC_VAPID_KEY } from './lib/secret';
import { useSubscribe } from './state/Other';
import GetDateTime from './util/GetDateTime';
import NotificationSocket from './util/Notification';

function App() {
	const { postData, url } = useSubscribe();
	// const handleNewIssue = (issue) => {
	// 	console.log(issue);
	// 	if ('Notification' in window && Notification.permission === 'granted') {
	// 		new Notification('🚨 New Issue Reported', {
	// 			body: issue || 'HEHE',
	// 		});
	// 	}
	// };

	// useEffect(() => {
	// 	if ('Notification' in window && Notification.permission !== 'granted') {
	// 		Notification.requestPermission().then((permission) => {
	// 			console.log('Notification permission:', permission);
	// 		});
	// 	}
	// }, []);

	useEffect(() => {
		if ('serviceWorker' in navigator) {
			registerAndSubscribe();
		}
	}, []);

	function urlBase64ToUint8Array(base64String) {
		const padding = '='.repeat((4 - (base64String.length % 4)) % 4);
		const base64 = (base64String + padding)
			.replace(/-/g, '+')
			.replace(/_/g, '/');
		const rawData = atob(base64);
		return Uint8Array.from([...rawData].map((char) => char.charCodeAt(0)));
	}

	async function registerAndSubscribe() {
		try {
			const registration =
				await navigator.serviceWorker.register('/service-worker.js');
			console.log('✅ Service Worker registered:', registration);

			const permission = await Notification.requestPermission();
			if (permission !== 'granted') {
				console.warn('❌ Push permission not granted');
				return;
			}

			let subscription = await registration.pushManager.getSubscription();

			if (!subscription) {
				console.log('ℹ️ No existing subscription, creating new one...');
				subscription = await registration.pushManager.subscribe({
					userVisibleOnly: true,
					applicationServerKey:
						urlBase64ToUint8Array(PUBLIC_VAPID_KEY),
				});
				console.log('✅ New subscription created:', subscription);

				// Always send new subscriptions to backend
				await sendSubscriptionToBackend(subscription);
			} else {
				console.log('✅ Using existing subscription:', subscription);

				// 🟢 Only send if we haven't sent this endpoint before
				const savedEndpoint = localStorage.getItem('pushEndpoint');

				if (savedEndpoint !== subscription.endpoint) {
					console.log(
						'ℹ️ Subscription changed or not saved yet. Sending to backend...'
					);
					await sendSubscriptionToBackend(subscription);
				} else {
					console.log(
						'✅ Subscription already saved. Not sending to backend.'
					);
				}
			}
		} catch (error) {
			console.error('Error during subscription:', error);
		}
	}

	async function sendSubscriptionToBackend(subscription) {
		// await fetch(`${BASE_API}/public/subscribe`, {
		// 	method: 'POST',
		// 	body: JSON.stringify({ endpoint: subscription.endpoint }),
		// 	headers: { 'Content-Type': 'application/json' },
		// });

		postData.mutate({
			url,
			newData: { endpoint: subscription, created_at: GetDateTime() },
		});

		localStorage.setItem('pushEndpoint', subscription.endpoint);
		console.log(
			'✅ Subscription sent to backend and endpoint saved locally.'
		);
	}

	return (
		<AuthProvider>
			<RouterProvider router={router} fallbackElement={<Loader />} />
			<Toast />
			{/* <NotificationSocket onNewIssue={handleNewIssue} /> */}
		</AuthProvider>
	);
}

export default App;
