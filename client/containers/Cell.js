import { connect } from 'react-redux';
import CellView from '../components/CellView';

const mapStateToProps = (state, ownProps) => {
	return {
		username: ownProps.user.username,
		userImageUrl: ownProps.user.imageUrl,
		followers: [],
		following: [],
		isPlaying: ownProps.user.currentPlayback ? ownProps.user.currentPlayback.isPlaying : false,
		device: ownProps.user.currentPlayback ? ownProps.user.currentPlayback.device : null,
		context: ownProps.user.currentPlayback ? ownProps.user.currentPlayback.context : null,
		track: ownProps.user.currentPlayback ? ownProps.user.currentPlayback.track : '',
		artists: ownProps.user.currentPlayback ? ownProps.user.currentPlayback.artists : [],
		album: ownProps.user.currentPlayback ? ownProps.user.currentPlayback.album : '',
	};
};

const mapDispatchToProps = (state, ownProps) => {
	return {};
};

const Cell = connect(
	mapStateToProps,
	mapDispatchToProps
)(CellView);

export default Cell;