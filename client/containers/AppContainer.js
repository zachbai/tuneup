import { connect } from 'react-redux';
import AppView from '../views/AppView';

import AuthActions from '../actions/AuthActions';

const mapStateToProps = (state, ownProps) => {
    return {
        loggedIn: state.authState.loggedInFacebook && state.authState.loggedInSpotify
    };
};

const mapDispatchToProps = (state, ownProps) => {
    return {};
}

const AppContainer = connect(
    mapStateToProps,
    mapDispatchToProps
)(AppView);

export default AppContainer;