import { connect } from 'react-redux';
import * as AuthActions from '../actions/AuthActions';
import LandingView from '../components/LandingView';

const mapStateToProps = (state, action) => {
    return {
        loggedInSpotify: state.authState.userRegistered 
            ? true
            : state.authState.loggedInSpotify,
        loggedInFacebook: state.authState.userRegistered
            ? true
            : state.authState.loggedInFacebook
    }
};

const mapDispatchToProps = dispatch => {
    return {
        onClickSpotify: () => dispatch(AuthActions.startLoginSpotify()),
        onLoginFacebook: facebookId => dispatch(AuthActions.loggedInFacebook(facebookId))
    };
}

const Landing = connect(
    mapStateToProps,
    mapDispatchToProps,
)(LandingView);

export default Landing;