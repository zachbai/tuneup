import { connect } from 'react-redux';
import LogOutButtonView from '../components/LogOutButtonView';
import { logOut } from '../actions/AuthActions';

const mapStateToProps = (state, ownProps) => {
	return {};
};

const mapDispatchToProps = dispatch => {
	return {
		onClickLogOut: () => dispatch(logOut())
	};
}; 

const LogOutButton = connect(
	mapStateToProps,
	mapDispatchToProps
)(LogOutButtonView);

export default LogOutButton;