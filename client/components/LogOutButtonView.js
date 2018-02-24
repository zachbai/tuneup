import React from 'react';
import classNames from 'classnames';

const LogOutButtonView = (props) => {
	return (
		<div 
			className={classNames('logout-button')}
			onClick={props.onClickLogOut}
		>
            Log Out
		</div>
	); 
};

export default LogOutButtonView;