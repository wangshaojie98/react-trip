import React from 'react';
import { Icon } from 'antd-mobile';
import { Link } from 'react-router-dom';
import './style.scss';

const formateDate = (datetime) => {
	function addDateZero(num) {
		return num < 10 ? '0' + num : num;
	}
	let d = new Date(datetime);
	let formatdatetime = d.getFullYear() + '-' + addDateZero(d.getMonth() + 1) + '-' + addDateZero(d.getDate());
	return formatdatetime;
};

export default function HistoryItem({ data }) {
	return (
		<Link
			to={{
				pathname: '/history/details',
				state: { data: data }
			}}
		>
			<div className="historyItem">
				<div className="historyItem_content">
					<p className="historyItem_title">{data.tripType}</p>
					{data.type === 'traffic' ? (
						<p className="historyItem_trip">
							{data.startPlace}-{data.endPlace}
						</p>
					) : (
						<p className="historyItem_trip">行程{data.distance}公里</p>
					)}
				</div>
				<div className="historyItem_date">
					<span>{formateDate(data.date)}</span>
					<Icon type="right" />
				</div>
			</div>
		</Link>
	);
}
