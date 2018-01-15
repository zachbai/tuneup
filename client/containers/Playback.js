import { connect } from 'react-redux';
import PlaybackView from '../components/PlaybackView';

const mapStateToProps = (state, ownProps) => {
	return {
		username: state.userState.username,
		userImageUrl: state.userState.imageUrl,
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

const Playback = connect(
	mapStateToProps,
	mapDispatchToProps
)(PlaybackView);

export default Playback;