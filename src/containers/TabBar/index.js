import React, { Component } from 'react';
import { TabBar } from 'antd-mobile';
import './style.scss';
import { withRouter } from 'react-router-dom';
import MyIcon from '../../components/SvgIcon';

class TabBarExample extends Component {
	render() {
		const { history } = this.props;
		const pathname = window.location.pathname;
		return (
			<div className="tarBar">
				<TabBar
					unselectedTintColor="#949494"
					tintColor="#33A3F4"
					barTintColor="white"
					// hidden={this.state.hidden}
				>
					<TabBar.Item
						title="出行"
						key="Life"
						icon={<MyIcon iconName="home" myClass="tabBarIcon" />}
						selectedIcon={<MyIcon iconName="homeSelected" myClass="tabBarIcon" />}
						selected={pathname.indexOf('trip') > -1}
						onPress={() => {
							this.setState({
								selectedTab: 'trip'
							});
							history.push('/trip');
						}}
						data-seed="logId"
					/>
					<TabBar.Item
						icon={<MyIcon iconName="traffic" myClass="tabBarIcon" />}
						selectedIcon={<MyIcon iconName="trafficSelected-copy" myClass="tabBarIcon" />}
						title="交通"
						key="Koubei"
						selected={pathname.indexOf('traffic') > -1}
						onPress={() => {
							this.setState({
								selectedTab: 'traffic'
							});
							history.push('/traffic');
						}}
						data-seed="logId1"
					/>
					<TabBar.Item
						icon={<MyIcon iconName="history" myClass="tabBarIcon" />}
						selectedIcon={<MyIcon iconName="historySelected" myClass="tabBarIcon" />}
						title="历史"
						key="Friend"
						// dot
						selected={pathname.indexOf('history') > -1}
						onPress={() => {
							this.setState({
								selectedTab: 'history'
							});
							history.push('/history');
						}}
					/>
					<TabBar.Item
						icon={<MyIcon iconName="my" myClass="tabBarIcon" />}
						selectedIcon={<MyIcon iconName="mySelected" myClass="tabBarIcon" />}
						title="我的"
						key="my"
						selected={pathname.indexOf('user') > -1}
						onPress={() => {
							this.setState({
								selectedTab: 'user'
							});
							history.push('/user');
						}}
					/>
				</TabBar>
			</div>
		);
	}
}

export default withRouter(TabBarExample);
