import React, { Component } from 'react'; 
import querystring from 'querystring';

import constants from '../core/constants.js';
import shared from '../core/shared.js';

class FBLogin extends Component {
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

	render() {
		if (this.props.loggedInFacebook) 
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
