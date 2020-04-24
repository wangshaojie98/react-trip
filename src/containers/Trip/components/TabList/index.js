import { Tabs } from 'antd-mobile';
import TabItem from '../TabItem';
import React from 'react';

const TabList = (props) => {
	const tabs = [
		{ title: '徒步', userDistance: props.userDistance.allWalk },
		{ title: '跑步', userDistance: props.userDistance.allRun },
		{ title: '骑行', userDistance: props.userDistance.allCycle },
		{ title: '自驾', userDistance: props.userDistance.allDrive }
	];
	return (
		<div>
			<Tabs
				tabs={tabs}
				initialPage={0}
				onChange={(tab, index) => {
					console.log('onChange', index, tab);
				}}
				onTabClick={(tab, index) => {
					console.log('onTabClick', index, tab);
				}}
			>
				{tabs.map((item, index) => {
					return <TabItem key={index} title={item.title} onClickItem={props.onClickItem} data={item.userDistance}/>;
				})}
			</Tabs>
		</div>
	);
};

export default TabList;
