import { connect } from 'react-redux';
import AppView from '../components/AppView';

import AuthActions from '../actions/AuthActions';

const mapStateToProps = (state, ownProps) => {
    return {
        loggedIn: state.authState.userRegistered
    };
};

const mapDispatchToProps = (state, ownProps) => {
    return {};
}

const App = connect(
    mapStateToProps,
    mapDispatchToProps
)(AppView);

export default App;