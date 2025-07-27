import { useEffect } from 'react';
import { io } from 'socket.io-client';

const socket = io('http://103.147.163.46:4010', { transports: ['websocket'] }); // adjust URL

export default function NotificationSocket({ onNewIssue }) {
	useEffect(() => {
		socket.on('new-issue', onNewIssue);
		return () => {
			socket.off('new-issue', onNewIssue);
		};
	}, [onNewIssue]);

	return null; // No UI, just a listener
}
