import store from '../store';
import io from 'socket.io-client';
import { updateCurrentPlayback, updateCurrentPlaybackPlayState } from '../actions/UserActions'; 

class Socket {
	listen() {
		const socket = io('http://lvh.me:3000');
		console.log("Listening for socket events...");

		socket.on('current-updated', data => {
			store.dispatch(updateCurrentPlayback(data.currentPlayback, data.userId));
		});

		socket.on('current-updated-play-state', data => {
			store.dispatch(updateCurrentPlaybackPlayState(data.isPlaying, data.userId));
		});
	}
}

export default new Socket();