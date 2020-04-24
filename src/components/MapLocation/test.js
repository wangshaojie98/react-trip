import React, { Component } from 'react';
import { AMap } from '../../utils/mapClass';
import './style.css';
export default class MapLocation extends Component {
	constructor(props) {
		super(props);
		this.state = {
			map: null
		};
	}
	componentDidMount() {
		this.map = new AMap.Map('mapLocation_container', {
			// zoom: 11, //级别
			center: [ 116.397428, 39.90923 ], //中心点坐标
			layers: [
				// 在地图初始化的时候通过layers属性为地图设置多个图层
				// new AMap.TileLayer.Satellite(),
				// new AMap.TileLayer.RoadNet()
			],
			zooms: [ 4, 18 ],
			zoom: 13
			// viewMode: '3D' //使用3D视图
		});
		const that = this;
		const map = this.map
		// map.on('complete', function() {
		// 	// 地图图块加载完成后触发
		// 	that.setState({map: map})
		// });
		// JS API 提供了在地图之上绘制覆盖物的能力
		// 添加点标记
		const marker = new AMap.Marker({
			position: [ 116.39, 39.9 ] //位置
		});
		map.add(marker);
		// 矢量图形也提供了绘制圆Circle、折线 Polyline
		const lineArr = [
			[ 116.368904, 39.913423 ],
			[ 116.382122, 39.901176 ],
			[ 116.387271, 39.912501 ],
			[ 116.398258, 39.9046 ]
		];
		const polyline = new AMap.Polyline({
			path: lineArr,
			strokeColor: '#3366FF',
			strokeStyle: 'solid',
			strokeWeight: 5
		});
		map.add(polyline);

		// JS API 提供的Map、点标记、矢量图形的实例均支持事件，鼠标或者触摸操作均会触发相应的事件。我们通过给点标记绑定click事件来简单了解事件系统和信息窗体的基本使用
		const infoWindow = new AMap.InfoWindow({
			//创建信息窗体
			isCustom: true, //使用自定义窗体
			content: '<div>信息窗体</div>', //信息窗体的内容可以是任意html片段
			offset: new AMap.Pixel(16, -45)
		});

		const onMarkerClick = function(e) {
			infoWindow.open(map, e.target.getPosition()); //打开信息窗体
			//e.target就是被点击的Marker
		};
		marker.on('click', onMarkerClick);
		// 添加实时路况图层
		// const trafficLayer = new AMap.TileLayer.Traffic({
		// 	zIndex: 10
		// });
		// map.add(trafficLayer);

		// 插件
		AMap.plugin([ 'AMap.ToolBar', 'AMap.Geolocation', 'AMap.Driving', 'AMap.Geolocation' ], function() {
			//异步加载插件
			// var toolbar = new AMap.ToolBar();
			map.addControl(new AMap.ToolBar());
			map.addControl(new AMap.Geolocation());

			// 路线规划插件
			var driving = new AMap.Driving({
				map: map,
				panel: 'mapLocation_panel',
				// 驾车路线规划策略，AMap.DrivingPolicy.LEAST_TIME是最快捷模式
				policy: AMap.DrivingPolicy.LEAST_TIME
			});

			var startLngLat = [ 116.379028, 39.865042 ];
			var endLngLat = [ 116.427281, 39.903719 ];

			driving.search(startLngLat, endLngLat, function(status, result) {
				// 未出错时，result即是对应的路线规划方案
			});

			// 定位插件
			var geolocation = new AMap.Geolocation({
				// 是否使用高精度定位，默认：true
				enableHighAccuracy: true,
				// 设置定位超时时间，默认：无穷大
				timeout: 10000,
				// 定位按钮的停靠位置的偏移量，默认：Pixel(10, 20)
				buttonOffset: new AMap.Pixel(10, 20),
				//  定位成功后调整地图视野范围使定位位置及精度范围视野内可见，默认：false
				zoomToAccuracy: true,
				//  定位按钮的排放位置,  RB表示右下
				buttonPosition: 'RB'
			});

			geolocation.getCurrentPosition();
			AMap.event.addListener(geolocation, 'complete', onComplete);
			AMap.event.addListener(geolocation, 'error', onError);

			function onComplete(data) {
				// data是具体的定位信息
				// map.setFitView()
			}

			function onError(data) {
				// 定位出错
			}
		});

		// 计算两个点之间的实际距离 m
		const lnglat1 = new AMap.LngLat(116.368904, 39.913423);
		const lnglat2 = new AMap.LngLat(116.382122, 39.901176);
		const distance = lnglat1.distance(lnglat2);
		console.log('distance', distance);

		// 事件
		var clickHandler = function(ev) {
			alert('您在[ ' + ev.lnglat.getLng() + ',' + ev.lnglat.getLat() + ' ]的位置点击了地图！');
			// 触发事件的对象
			var target = ev.target;

			// 触发事件的地理坐标，AMap.LngLat 类型
			var lnglat = ev.lnglat;

			// 触发事件的像素坐标，AMap.Pixel 类型
			var pixel = ev.pixel;

			// 触发事件类型
			// var type = ev.type; // click事件
			console.log(target, lnglat, pixel);
		};

		// 绑定事件
		map.on('click', clickHandler);
		// 解绑事件
		// map.off('click', clickHandler);
		// map.setFitView()
	}
	componentWillUnmount() {
		// 销毁地图
		console.log('销毁地图');
		if (this.map) {
			this.map.destroy() // 不是destory 是destroy
		}
		// this.state.map.destory();
	}
	render() {
		return (
			<div id="mapLocation">
				<div id="mapLocation_container" />
				<div id="mapLocation_panel" />
			</div>
		);
	}
}
