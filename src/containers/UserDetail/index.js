import React, { Component } from 'react';
import * as echarts from 'echarts';
import './style.scss';
import { connect } from 'react-redux';
import { getUserDistance } from '../../redux/modules/trip';

class UserDetail extends Component {
	initChart = () => {
		var dataAxis = [ '徒步', '跑步', '骑行', '自驾', '公交', '出租' ];
		console.log(this.props);
		var data = Object.values(this.props.userDistance).slice(1).map((item) => {
			return Number(item);
		});
		var yMax = 500;
		var dataShadow = [];

		for (var i = 0; i < data.length; i++) {
			dataShadow.push(yMax);
		}
		echarts.init(document.getElementById('userDetail_echart')).setOption({
			title: {
				text: '出行里程'
				// subtext: 'Feature Sample: Gradient Color, Shadow, Click Zoom'
			},
			xAxis: {
				data: dataAxis,
				axisLabel: {
					inside: true,
					textStyle: {
						color: '#fff'
					}
				},
				axisTick: {
					show: false
				},
				axisLine: {
					show: false
				},
				z: 10
			},
			yAxis: {
				axisLine: {
					show: false
				},
				axisTick: {
					show: false
				},
				axisLabel: {
					textStyle: {
						color: '#999'
					}
				}
			},
			dataZoom: [
				{
					type: 'inside'
				}
			],
			series: [
				{
					// For shadow
					type: 'bar',
					itemStyle: {
						color: 'rgba(0,0,0,0.05)'
					},
					barGap: '-100%',
					barCategoryGap: '40%',
					data: dataShadow,
					animation: false
				},
				{
					type: 'bar',
					itemStyle: {
						color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
							{ offset: 0, color: '#83bff6' },
							{ offset: 0.5, color: '#188df0' },
							{ offset: 1, color: '#188df0' }
						])
					},
					emphasis: {
						itemStyle: {
							color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
								{ offset: 0, color: '#2378f7' },
								{ offset: 0.7, color: '#2378f7' },
								{ offset: 1, color: '#83bff6' }
							])
						}
					},
					data: data
				}
			]
		});
	}
	componentDidMount() {
		if (this.props.userDistance) {
			this.initChart();
		}
	}
	componentDidUpdate(){
		if (this.props.userDistance) {
			this.initChart();
		}
	}
	render() {
		return (
			<div id="userDetail">
				用户详情
				<div id="userDetail_echart" />
			</div>
		);
	}
}
const mapStateToProps = (state) => ({
	userDistance: getUserDistance(state)
});
export default connect(mapStateToProps, null)(UserDetail);
