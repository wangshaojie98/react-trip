import React, { Component } from 'react';
import './style.scss';
import { get } from '../../utils/request';
// 引入 ECharts 主模块
import echarts from 'echarts/lib/echarts';
// 引入折线图
import 'echarts/lib/chart/line';
// 引入组件
import 'echarts/lib/component/title'
import 'echarts/lib/component/tooltip';
import 'echarts/lib/component/legend';
import 'echarts/lib/component/grid';
import 'echarts/lib/component/toolbox';

export default class Trend extends Component {
	componentDidMount() {
		
		this.init()
	}
	render() {
		return (
			<div className="trend">
				<div id="trend_echart" />
			</div>
		);
	}

	initChart = (legendData, xAxis, series) => {
		echarts.init(document.getElementById('trend_echart')).setOption({
			  title: {
			    text: '出行趋势'
			},
			tooltip: {
				trigger: 'axis'
			},
			legend: {
        data: legendData,
        top: '12%'
			},
			grid: {
				left: '2%',
				right: '4%',
        bottom: '3%',
        top: '22%',
				containLabel: true
			},
			toolbox: {
				feature: {
					saveAsImage: {}
				}
			},
			xAxis,
			yAxis: {
				type: 'value'
			},
			series
		});
	}

	init = () => {
		get('/user/tripTrend', {}).then((res) => {
			let data = res.data;
			let day = new Date().getDate();
			let x = [
				`${day - 6}日`,
				`${day - 5}日`,
				`${day - 4}日`,
				`${day - 3}日`,
				`${day - 2}日`,
				`${day - 1}日`,
				`${day}日`
      ];
      let tmpSeries = {}      
      console.log(x);
      let baseX = [day -6, day - 5, day - 4,day - 3,day - 2,day - 1, day];
			data.forEach((item) => {
        if (!tmpSeries[item.tripType]) {
          tmpSeries[item.tripType] = [0, 0, 0, 0, 0, 0, 0];
          tmpSeries[item.tripType] = {
            name: item.tripType,
            type: 'line',
            data: [0, 0, 0, 0, 0, 0, 0]
          }
        }
        baseX.forEach((itm, idx) => {
          if (item.date.slice(8) == itm) {
            tmpSeries[item.tripType].data[idx] += parseFloat(item.distance);
          }

        })
      });
      let legendData =  ["公交/地铁", "出租车", "单车/电车", "步行","徒步出行", "跑步出行", "骑车出行", "驾车出行"];
      let xAxis = {
        type: 'category',
				boundaryGap: false,
				data: x
      };
      let series = [tmpSeries["徒步出行"],tmpSeries["跑步出行"], tmpSeries["骑车出行"], tmpSeries["驾车出行"],tmpSeries["公交/地铁"],tmpSeries["出租车"], tmpSeries["单车/电车"], tmpSeries["步行"]]
      this.initChart(legendData, xAxis, series);
		});
	}
}
