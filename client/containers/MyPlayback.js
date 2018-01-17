import { connect } from 'react-redux';
import MyPlaybackView from '../components/MyPlaybackView';

const mapStateToProps = (state, ownProps) => {
	return {
		username: state.userState.username,
		userImageUrl: state.userState.imageUrl,
		followers: state.userState.followers,
		following: state.userState.following,
		isPlaying: state.userState.currentPlayback.isPlaying,
		device: state.userState.currentPlayback.device,
		context: state.userState.currentPlayback.context,
		track: state.userState.currentPlayback.track,
		artists: state.userState.currentPlayback.artists,
		album: state.userState.currentPlayback.album,
	};
};

const mapDispatchToProps = (state, ownProps) => {
	return {};
};

const MyPlayback = connect(
	mapStateToProps,
	mapDispatchToProps
)(MyPlaybackView);

export default MyPlayback;