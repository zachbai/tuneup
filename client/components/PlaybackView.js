import React from 'react';
import classNames from 'classnames';

const PlaybackView = (props) => {
	return (
		<div className={classNames('playback-container')}>
			<img className={classNames('playback-image')} src={props.album.imageUrl}/>
			<div className={classNames('playback-info')}>
				<img className={classNames('playback-user-image')} src={props.userImageUrl}/>
				<div className={classNames('playback-user-text')}>
					{props.username}
				</div>
				<div className={classNames('playback-track-text')}>
					{props.track.name}
				</div> 
				<div className={classNames('playback-track-info')}>
					<div className={classNames('playback-artist-text')}>	
						{props.artists[0]}
					</div>
					<div className={classNames('playback-album-text')}>
						{props.album.name}
					</div>
				</div>
			</div>
		</div>
	);
};

export default PlaybackView;