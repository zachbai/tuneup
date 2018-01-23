import React from 'react';
import classNames from 'classnames';

const renderTrack = (props) => {
	return ( [
		props.track.name + ' ',
		<span key='by' className={classNames('my-playback-track-text', 'sub')}>
			{ 'by' }
		</span>,
		' ' + props.artists[0] + ' ',
		<span key='from' className={classNames('my-playback-track-text', 'sub')}>
			{'from'}
		</span>,
		' ' + props.album.name,
	]);
};

const CellView = (props) => {
	return (
		<div className={classNames('my-playback-container')}>
			<img className={classNames('my-playback-image')} src={props.album.imageUrl}/>
			<div className={classNames('my-playback-info-container')}>
				<div className={classNames('my-playback-user-container')}>
					<img className={classNames('my-playback-user-image')} src={props.userImageUrl}/>
					<div className={classNames('my-playback-user-text')}>
						{props.username}
					</div>
					<div className={classNames('my-playback-listening-status-text')}>
						{props.isPlaying ? 'currently listening' : 'last listened'}
					</div>
					{
						props.isPlaying 
							? <i className={classNames('fa fa-volume-up','my-playback-listening-icon')} aria-hidden="true"></i>
							: null
					}
					<div className={classNames('my-playback-follow-container')}>
						<div className={classNames('my-playback-followers-container')}>
							<div className={classNames('my-playback-follow-text')}>
								followed by
							</div>
							<div className={classNames('my-playback-follow-data')}>
								<div className={classNames('my-playback-follow-number')}>
									{props.followers.length}
								</div>
								{
									props.followers.slice(props.followers.length < 3 ? props.followers.length-1 : 2).map(follower => {
										return (
											<img className={classNames('my-playback-follow-image')} src={follower.imageUrl}/>
										);
									})
								}
							</div>
						</div>
						<div className={classNames('my-playback-following-container')}>
							<div className={classNames('my-playback-follow-text')}>
								following
							</div>
							<div className={classNames('my-playback-follow-data')}>
								<div className={classNames('my-playback-follow-number')}>
									{props.following.length}
								</div>
								{
									props.following.slice(props.following.length < 3 ? props.following.length-1 : 2).map(following => {
										return (
											<img className={classNames('my-playback-follow-image')} src={following.imageUrl}/>
										);
									})
								}
							</div>
						</div>
					</div>
				</div>
				<div className={classNames('my-playback-track-container')}>
					<a href={props.track.url} target='_blank'>
						<div className={classNames('my-playback-track-text')}>
							{
								props.track.id
									? renderTrack(props)
									: 'No track available'
							}
						</div>
					</a>
				</div>
			</div>
		</div>
	);
};

export default CellView;