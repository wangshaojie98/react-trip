import React, { Component } from 'react';
import './style.scss';
// 引入 ECharts 主模块
import echarts from 'echarts/lib/echarts';
// 引入折线图
import 'echarts/lib/chart/pie';
// 引入组件
import 'echarts/lib/component/title'
import 'echarts/lib/component/tooltip';
import 'echarts/lib/component/legend';
import 'echarts/lib/component/grid';
import { connect } from 'react-redux';
import { getUserDistance } from '../../redux/modules/trip';

class Analysis extends Component {
  componentDidMount() {
    console.log('数据分析',this.props);
    if (this.props.userDistance) {
    console.log('neibu',this.props);

      this.initPieChart(this.props.userDistance)
      this.initBarsChart(this.props.userDistance)
		}
  }
  componentDidUpdate() {
    if (this.props.userDistance) {
      console.log('neibu',this.props);
  
        this.initPieChart(this.props.userDistance)
        this.initBarsChart(this.props.userDistance)
      }
  }
	render() {
    // if (this.props.userDistance) {
    //   console.log('neibu',this.props);
  
    //     this.initPieChart(this.props.userDistance)
    //     this.initBarsChart(this.props.userDistance)
    //   }
		return (
			<div className="analysis">
				<div id="analysis_echart1" />
				<div id="analysis_echart2" />
			</div>
		);
	}

	initPieChart = (data) => {
		echarts.init(document.getElementById('analysis_echart1')).setOption({
      title: {
        text: '出行方式分布图'
      },
			tooltip: {
				trigger: 'item',
				formatter: '{a} <br/>{b}: {c} ({d}%)'
			},
			legend: {
        top: '12%',
				orient: 'vertical',
				left: 0,
				data: ['步行', '跑步', '单车/电车', '自驾/出租', '公交/地铁']
			},
			series: [
				{
					name: '访问来源',
					type: 'pie',
					radius: [ '50%', '70%' ],
					avoidLabelOverlap: false,
					label: {
						show: false,
						position: 'center'
					},
					emphasis: {
						label: {
							show: true,
							fontSize: '30',
							fontWeight: 'bold'
						}
					},
					labelLine: {
						show: false
					},
					data: [
						{ value: data.allWalk, name: '步行' },
						{ value: data.allRun, name: '跑步' },
						{ value: data.allCycle, name: '单车/电车' },
            { value: parseInt(data.allDrive) + parseInt(data.allTaxi), name: '自驾/出租' },
            { value: data.allBus, name: '公交/地铁' }
          ]
				}
			]
		});
  };
  
  initBarsChart = (data) => {
    echarts.init(document.getElementById('analysis_echart2')).setOption({
      title: {
        text: '出行总里程'
      },
      color: ['#3398DB'],
      tooltip: {
          trigger: 'axis',
          axisPointer: {            // 坐标轴指示器，坐标轴触发有效
              type: 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
          }
      },
      grid: {
          left: '3%',
          right: '4%',
          bottom: '3%',
          containLabel: true
      },
      xAxis: [
          {
              type: 'category',
              data: [ '徒步', '跑步','骑行', '自驾', '公交', '出租' ],
              axisTick: {
                  alignWithLabel: true
              }
          }
      ],
      yAxis: [
          {
              type: 'value'
          }
      ],
      series: [
          {
              name: '直接访问',
              type: 'bar',
              barWidth: '60%',
              data: [data.allWalk, data.allRun, data.allCycle, data.allDrive, data.allBus, data.allTaxi]
          }
      ]
  });
  }
}
const mapStateToProps = (state) => ({
	userDistance: getUserDistance(state)
});
export default connect(mapStateToProps, null)(Analysis);