import React, { Component } from 'react';
import UserHeader from './components/UserHeader';
import UserInfo from './components/UserInfo';
import userBg from '../../images/user-bg.jpg';
import { Button } from 'antd-mobile';
import './style.scss';

export default class index extends Component {
	handleLogout = () => {
		localStorage.removeItem('user');
		this.props.history.push('/login');
	}
	constructor(props) {
		super(props);
		this.state = {
			userData: JSON.parse(localStorage.getItem('user'))
		};
	}

	render() {
		const { userData } = this.state;
		return (
			<div className="user">
				<div>
					<img src={userBg} className="user_Bg" />
				</div>
				<div className="user_content">
					<UserHeader name={userData.name} imgAddress={userData.img} username={userData.userName} />
					<UserInfo />
					<div className="user_logout">
						<Button type="warning" onClick={this.handleLogout}>退出</Button>
					</div>
				</div>
			</div>
		);
	}
}
