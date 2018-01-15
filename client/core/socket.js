import store from '../store';
import io from 'socket.io-client';
import { updateCurrentPlayback } from '../actions/UserActions'; 

class Socket {
	listen() {
		const socket = io('http://lvh.me:3000');
		socket.on('current-updated', data => {
			store.dispatch(updateCurrentPlayback(data.currentPlayback, data.userId));
		});
	}
}

export default new Socket();