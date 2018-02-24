import React from 'react';
import classNames from 'classnames';
import LogOutButton from '../containers/LogOutButton';

const HeaderView = (props) => {
	return (
		<div className={classNames('header')}>
			<div className={classNames('header-text')}>
                tuneup
			</div>
			<LogOutButton />
		</div>
	);
};

export default HeaderView;