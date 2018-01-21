import { connect } from 'react-redux';
import FeedView from '../components/FeedView';

const mapStateToProps = (state, ownProps) => {
	return {
		following: state.userState.following
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