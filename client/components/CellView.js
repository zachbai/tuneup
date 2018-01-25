import React from 'react';
import classNames from 'classnames';

const renderTrack = (props) => {
	return ( [
		props.track.name + ' ',
		<span key='by' className={classNames('cell-track-text', 'sub')}>
			{ 'by' }
		</span>,
		' ' + props.artists[0] + ' ',
		<span key='from' className={classNames('cell-track-text', 'sub')}>
			{'from'}
		</span>,
		' ' + props.album.name,
	]);
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
					{props.isPlaying ? 'currently listening' : 'last listened'}
				</div>
			</div>
			<div className={classNames('cell-footer')}>
				<a href={props.track.url} target='_blank'>
					<div className={classNames('cell-track-text')}>
						{
							props.track.id
								? renderTrack(props)
								: 'No track available'
						}
					</div>
				</a>
			</div>
		</div>
	);
};

export default CellView;