import React, { Component } from 'react';
import './style.scss';
import HistoryList from './components/HistoryList';
import MyIcon from '../../components/SvgIcon';
import {get} from '../../utils/request';

export default class History extends Component {
	constructor(props) {
		super(props);
		this.state = {
			data: []
		};
	}
	componentDidMount() {
		// 待完成用户登录进行后台请求
		get('/trip/historyList', {})
			.then((res) => {
				this.setState({
					data: res.data
				});
			})
			.catch((err) => {
				console.log(err);
			});
	}
	render() {
		const { data } = this.state;
		return (
			<div className="history">
				<h2 className="history_title">
					出行历史 <MyIcon iconName="history-list" myClass="historyTitleIcon" />
				</h2>
				<HistoryList data={data} />
			</div>
		);
	}
}
