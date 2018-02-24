import React from 'react';
import classNames from 'classnames';

import utils from '../core/utils';

const renderTrack = (props) => {
	if (!props.track.id)
		return null;

	return (
		<a className={classNames('cell-track-info-container')} href={props.track.url} target='_blank'>
			<div className={classNames('cell-track-text')}>
				{props.track.name + ' '}
			</div>
			<div className={classNames('cell-track-text')}>
				<span key='by' className={classNames('cell-track-text', 'sub')}>
					{ 'by' }
				</span>
				{' ' + props.artists[0] + ' '}
			</div>
			<div className={classNames('cell-track-text')}>
				<span key='from' className={classNames('cell-track-text', 'sub')}>
					{'from'}
				</span>
				{' ' + props.album.name}
			</div>
		</a>
	);
};

const CellView = (props) => {
	const backgroundImageStyle = {
		backgroundImage: 'url(' + props.album.imageUrl + ')',
	};

	return (
		<div className={classNames('cell-container')} style={backgroundImageStyle}>
			<div className={classNames('cell-header')}>
				<img className={classNames('cell-user-image')} src={props.user.imageUrl}/>
				<div className={classNames('cell-user-text')}>
					{props.user.username}
				</div>
				<div className={classNames('cell-listening-status-text')}>
					{
						props.isPlaying ? 'currently listening' 
							: ( props.track.id ? 'last listened ' + utils.toTimeString(props.timestamp) + ' ago' 
								: null)
					}
				</div>
			</div>
			{
				props.track.id 
					? null
					: <div className={classNames('cell-no-track-text')}>
						No track available
					</div>
			}
			<div className={classNames('cell-footer')}>
				{renderTrack(props)}
			</div>
		</div>
	);
};

export default CellView;