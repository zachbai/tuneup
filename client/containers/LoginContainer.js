import { connect } from 'react-redux';
import AuthActions from '../actions/AuthActions';
import LoginLanding from '../views/LoginLanding';

const mapStateToProps = (state, action) => {
    return {
        loggedInSpotify: state.authState.loggedInSpotify,
        loggedInFacebook: state.authState.loggedInFacebook
    }
};

const mapDispatchToProps = dispatch => {
    return {
        onClickSpotify: dispatch(AuthActions.startLoginSpotify)
    };
}

const LoginContainer = connect(
    mapStateToProps,
    mapDispatchToProps,
)(LoginLanding);

export default LoginContainer;