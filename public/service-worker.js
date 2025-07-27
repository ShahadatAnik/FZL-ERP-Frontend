// This code runs when a push is received, even if your site is closed.
self.addEventListener('push', function (event) {
	const data = event.data.json();
	console.log('[Service Worker] Push Received:', data);

	const options = {
		body: data.body,
		icon: '✅', // Optional: an icon to show with the notification
	};

	// Show the notification
	event.waitUntil(self.registration.showNotification(data.title, options));
});
