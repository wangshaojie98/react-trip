import React from 'react';
import MyIcon from '../../../../components/SvgIcon';
import { Link } from 'react-router-dom';
import './style.scss';

export default function UserInfo() {
	return (
		<div className="userInfo">
			<div>我的信息</div>
			<ul className="userInfo_content">
				<li>
					<Link to="/user/userDetail" className="myLink">
						<MyIcon iconName="personalInfo" myClass="userIcon" />
						<span className="userInfo_iconTitle">信息总览</span>
					</Link>
				</li>
				<li>
					<Link to="/user/trend" className="myLink">
						<MyIcon iconName="trend" myClass="userIcon" />
						<span className="userInfo_iconTitle">出行趋势</span>
					</Link>
				</li>
				<li>
					<Link to="/user/analysis" className="myLink">
						<MyIcon iconName="dataAnalysis" myClass="userIcon" />
						<span className="userInfo_iconTitle">数据分析</span>
					</Link>
				</li>
			</ul>
		</div>
	);
}
