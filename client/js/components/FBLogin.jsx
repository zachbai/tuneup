import React, { Component } from 'react'; 
import querystring from 'querystring';

import constants from '../core/constants.js';
import shared from '../core/shared.js';

class FBLogin extends Component {
	constructor() {
		super();

		this.state = {
			loggedIn: false
		};
	}
	componentDidMount() {
		window.fbAsyncInit = function() {
			FB.init({
				appId      : 546050665765523,
				cookie     : true,
				xfbml      : true,
				version    : 'v2.11'
			});
			window.FB.Event.subscribe('auth.statusChange', (response) => {
				if (response.authResponse) {
					this.updateLoggedInState(response.authResponse);
				}
			});
		}.bind(this);
		

		(function(d, s, id){
		 var js, fjs = d.getElementsByTagName(s)[0];
		 if (d.getElementById(id)) {return;}
		 js = d.createElement(s); js.id = id;
		 js.src = "https://connect.facebook.net/en_US/sdk.js";
		 fjs.parentNode.insertBefore(js, fjs);
		}(document, 'script', 'facebook-jssdk'));
	}	

	updateLoggedInState(authResponse) {
		shared.cookies.set(constants.FACEBOOK_COOKIES_KEY, authResponse.userID);
		this.setState({
			loggedIn: true
		});
		this.props.loggedIn();
	}

	render() {
		if (this.state.loggedIn) 
			return "Logged in thru facebook";
		return (
			<div className="fb-login-button" 
				data-max-rows="1" 
				data-size="large" 
				data-button-type="continue_with" 
				data-show-faces="false" 
				data-auto-logout-link="false" 
				data-use-continue-as="false">
			</div>
		)
	}
}

module.exports = FBLogin;
