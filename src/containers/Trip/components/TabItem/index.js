import React from 'react';
import { Button, WingBlank } from 'antd-mobile';
import './style.scss';

export default function TabItem({ title, onClickItem: handleClickTripItem, data }) {
	console.log(data);
	return (
		<div className="tabItem">
			<WingBlank>
				<div className="tabItem_box">
					<div className="tabItem_title">累计{title}</div>
					<div className="tabItem_distance">{data}KM</div>
				</div>
				
				<Button type="primary" onClick={handleClickTripItem.bind(this, title)}>开始{title}</Button>
			</WingBlank>
		</div>
	);
}
