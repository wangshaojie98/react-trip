import React, { Component } from 'react';
import { AMap } from '../../utils/mapClass';
import { Toast } from 'antd-mobile';
import './style.scss';

export default class HistoryDetail extends Component {
	constructor(props) {
		super(props);
		this.state = {
			data: null
		};
	}

	render() {
		const { data } = this.state;
		return (
			<div id="historyDetail">
				<div id="historyDetail_container" />
				{data && (data.type === 'trip') ? this.renderStartGo(data) : false}
			</div>
		);
	}

	componentDidMount() {
		let data = this.props.location.state.data;
		this.setState({
			data: data
		});
    this.createMap();

    // 切结不能用this.state.data来取值，因为this.setState是异步的
    if ((data !== null) && (data.type === 'trip')) {
      this.createPathTrajectory(data);
      // 如果是交通
    } else if ((data !== null) && (data.type === 'traffic')){
      this.handleDriving(data);
    }
	}

	componentWillUnmount() {
		// 销毁地图
		console.log('销毁地图');
		if (this.map) {
			this.map.destroy(); // 不是destory 是destroy
    }
     if (this.driving) {
      this.driving.clear();
     }
	}

	createMap = () => {
		// 创建地图
		this.map = new AMap.Map('historyDetail_container', {
			resizeEnable: true,
			zoom: 11,
			center: [ 116.397428, 39.90923 ] //中心点坐标
    });
	};

	// 绘制行程路径
	createPathTrajectory = (data) => {
		let that = this;
		let lineArr = data.trajectory; // 行程坐标数组
		let marker = new AMap.Marker({
			map: that.map,
			position: lineArr[0], // 起始点
			icon: 'https://webapi.amap.com/images/car.png',
			offset: new AMap.Pixel(-26, -13), 
			autoRotation: true, 
			angle: -90 
		});

		// 绘制轨迹。利用折线先画出路线
		let polyline = new AMap.Polyline({
			map: that.map,
			path: lineArr,
			showDir: true,
			strokeColor: '#28F', // 线颜色
			// strokeOpacity: 1,     //线透明度
			strokeWeight: 6 // 线宽
			// strokeStyle: "solid"  //线样式
		});
		// 再利用动画画出小车轨迹
		let passedPolyline = new AMap.Polyline({
			map: that.map,
			// path: lineArr,
			strokeColor: 'red', // 线颜色
			// strokeOpacity: 1,     //线透明度
			strokeWeight: 6 // 线宽
			// strokeStyle: "solid"  //线样式
		});

		marker.on('moving', function(e) {
			passedPolyline.setPath(e.passedPath);
		});

    that.map.setFitView();
    
		marker.moveAlong(lineArr, 200);
  };
  
	// 加载查询路线插件
	handleDriving = (data) => {
		Toast.loading('正在规划路线...', 10);
		let that = this;
    let tripType = data.tripType;
    let type = 'AMap.Transfer'; // 交通方式
		switch (tripType) {
			case '公交/地铁':
				type = 'AMap.Transfer';
				break;
			case '出租车':
				type = 'AMap.Driving';
				break;
			case '单车/电车':
				type = 'AMap.Riding';
				break;
			case '步行':
				type = 'AMap.Walking';
				break;
			default:
				type = 'AMap.Transfer';
    }
		this.map.plugin(type, function() {
			that.driving = new AMap[type.slice(5)]({
				map: that.map,
				city: '北京市',
				autoFitView: true
			});
      // 根据起终点经纬度规划驾车导航路线
      let startLngLat = data.startCode;
      let endLngLat = data.endCode;
			that.driving.search(
				new AMap.LngLat(startLngLat[0], startLngLat[1]),
				new AMap.LngLat(endLngLat[0], endLngLat[1]),
				function(status, result) {
					Toast.hide();
					console.log(status, result);
					if (status === 'complete') {
						console.log('绘制驾车路线完成');
					} else {
						console.log('获取驾车数据失败：' + result);
						Toast.fail('未检测到匹配路线', 3);
					}
				}
			);
		});
	};

	renderStartGo = ({ mark, distance, time, speed, Calorie,date,tripType }) => {
		let reMark = <p className="historyDetail_markText">备注：{mark}</p>;
		return (
			<div className="historyDetail_startGo">
        <div className="historyDetail_title">
            <span>{tripType}</span>
            <span>{date.slice(0, 10).replace(/-/g, '/')}</span>
          </div>
				<div className="historyDetail_startGoTop">
          
					<p>
						<span>{distance === 0 ? '0.00' : distance}</span> 公里
					</p>
				</div>
				<div className="historyDetail_startGoDetail">
					<p>
						<span>{time}</span>
						<br />
						<span>总计时间</span>
					</p>
					<p>
						<span>{speed}</span>
						<br />
						<span>平均配速(km/h)</span>
					</p>
					<p>
						<span>{Calorie}</span>
						<br />
						<span>消耗能量(k)</span>
					</p>
				</div>
				{reMark}
			</div>
		);
	};
}
