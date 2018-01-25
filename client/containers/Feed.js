import { connect } from 'react-redux';
import FeedView from '../components/FeedView';

const mapStateToProps = (state, ownProps) => {
	const sortedFollowing = state.userState.following.slice(0).sort((a, b) => {
		return a.currentPlayback.timestamp <= b.currentPlayback.timestamp;
	});

	return {
		following: sortedFollowing
	};
};

const mapDispatchToProps = (state, ownProps) => {
	return {};
};

const Feed = connect(
	mapStateToProps,
	mapDispatchToProps
)(FeedView);

export default Feed;