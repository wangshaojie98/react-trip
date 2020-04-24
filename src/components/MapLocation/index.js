import React, { Component } from 'react';
import { AMap } from '../../utils/mapClass';
import { Toast } from 'antd-mobile';
import { setInterval, clearInterval } from 'timers';
import getTime from '../../utils/getTime';
import get from '../../utils/request'
import './style.scss';
import {connect} from 'react-redux'
import {actions as tripActions} from '../../redux/modules/trip'
import {bindActionCreators} from 'redux'

class MapLocation extends Component {
	constructor(props) {
		super(props);
		this.state = {
			map: null,
			address: {
				addressComponent: null,
				formattedAddress: null
			},
			startBtn: '开始',
			locationSucess: false, // 定位成功
			distance: 0,
			timerNow: '00:00', //时间
			speedNow: '0.00',
			kcalNow: '0.0',
			markText: '',
			isStartGo: false, // 表示是否开始
			startShow: false, //是否开始展示速度页，默认不展示
			timer: [ 0, 0, 0 ], // 时间计时器的时分秒
			timeAll: 0,
			geolocationData: [
				[126.567402, 43.923187],
        [126.567402, 43.923129],
        [126.56744, 43.923098],
        [126.56759, 43.923024],
        [126.567794, 43.923024],
        [126.567928, 43.922912],
        [126.568169, 43.922819],
        [126.568486, 43.922723],
        [126.568598, 43.922881],
        [126.568727, 43.923074],
        [126.56884, 43.92319],
        [126.569274, 43.923055],
        [126.569564, 43.92348],
        [126.569859, 43.923944],
        [126.569172, 43.924199]
			], // 记录定位
			tripType: '徒步'
		};
	}

	render() {
		const { distance, timerNow, speedNow, kcalNow, markText, isStartGo, startShow, startBtn } = this.state;
		return (
			<div id="mapLocation">
				<div id="mapLocation_container" />
				<div className="mapLocation_startBox">
					<div className="mapLocation_startBtn" onClick={this.handleStartGo}>
						{startBtn}
					</div>
				</div>
				{startShow ? this.renderStartGo({ distance, timerNow, speedNow, kcalNow, markText, isStartGo }) : false}
			</div>
		);
	}

	componentDidMount() {
		let tripType = this.props.location.query ? this.props.location.query.type : '';
		if (!tripType) {
			this.props.history.push("/trip")
			return;
		}
		this.setState({
			tripType: this.props.location.query.type
		})
		this.createMap();
	}

	componentWillUnmount() {
		// 销毁地图
		console.log('销毁地图');
		if (this.map) {
			this.map.destroy(); // 不是destory 是destroy
		}
	}

	createMap = () => {
		// 全局提示加载默认加载失败，如果成功则利用toastHide
		Toast.loading('Loading...', 10);

		// 创建地图
		this.map = new AMap.Map('mapLocation_container', {
			resizeEnable: true,
			zoom: 11,
			center: [ 116.397428, 39.90923 ] //中心点坐标
		});
		const map = this.map;
		// 保存react实例引用
		const that = this;
		// 插件
		AMap.plugin([ 'AMap.Geolocation', 'AMap.ControlBar' ], function() {
			// 创建定位插件
			var geolocation = new AMap.Geolocation({
				// 是否使用高精度定位，默认：true
				enableHighAccuracy: true,
				// 设置定位超时时间，默认：无穷大
				timeout: 10000,
				// 定位按钮的停靠位置的偏移量，默认：Pixel(10, 20)
				buttonOffset: new AMap.Pixel(10, 20),
				//  定位成功后调整地图视野范围使定位位置及精度范围视野内可见，默认：false
				zoomToAccuracy: true,
				//  定位按钮的排放位置,  RB表示右下,LB
				buttonPosition: 'LB'
			});
			map.addControl(geolocation);
			// 添加定位插件---------------------------------------------------------
			geolocation.getCurrentPosition();
			AMap.event.addListener(geolocation, 'complete', that.handleLocateComplete);
			AMap.event.addListener(geolocation, 'error', that.handleLocateError);
			// 罗盘插件---------------------------------------------------------
			map.addControl(new AMap.ControlBar());
		});
	};

	handleLocateComplete = (data) => {
		console.log(data);
		Toast.hide();

		// Edge无法使用展开运算符---------------------------------------------------------
		// this.setState({
		// 	address: {
		// 		...this.state.address,
		// 		addressComponent: data.addressComponent,
		// 		formattedAddress: data.formattedAddress
		// 	},
		// 	locationSucess: true
		// });

		this.setState({
			address: Object.assign({}, this.state.address, {
				addressComponent: data.addressComponent,
				formattedAddress: data.formattedAddress
			}),
			locationSucess: true
		});
	};

	handleLocateError = (err) => {
		Toast.hide();
		Toast.fail('定位失败请检查权限或尝试刷新', 3);
		this.setState({
			locationSucess: false
		});
		// 组件提示框出错信息
		console.log(err);
	};

	// 监听手机浏览器设备的地理位置发生
	handleWatchPosition = () => {
		console.log('开始实时定位========');
		let that = this;
		this.watchID = navigator.geolocation.watchPosition(
			function(position) {
				let gps = [ position.coords.longitude, position.coords.latitude ];
				console.log('实时定位中---');
				console.log('gps', gps);
				console.log('geolocationData', that.state.geolocationData);
				let p1 =
					that.state.geolocationData.length > 0
						? that.state.geolocationData[that.state.geolocationData.length - 1].toString()
						: '';
				let p2 = gps.toString();
				if (p1 === p2) {
					console.log('定位距离过近');
				} else {
					// 存放轨迹经纬度坐标，gps坐标转换高德地图经纬坐标
					AMap.convertFrom(gps, 'gps', function(status, result) {
						if (result.info === 'ok') {
							console.log('result', result);
							let tmpGps = [ result.locations[0].R, result.locations[0].Q ];
							console.log('tmpGps', tmpGps);
							// 每次定位发生变化都把转换后的高德坐标推入到数组中
							that.setState({
								geolocationData: that.state.geolocationData.concat([ tmpGps ])
							});
							// 每次定位发生变化都计算距离，为了算出当前的配速和行走的距离
							that.handleLocateDistance(that.state.geolocationData);
						} else {
							console.log('轨迹路径经纬度转换失败！！');
						}
					});
					// that.geolocationData.push(gps)
					// that.mapLoactionDistance(that.geolocationData)
				}
			},
			function() {
				Toast.failed('实时定位出错，请尝试刷新', 3);
				// // 销毁地图
				// that.map.destroy()
			}
		);
	};
	// 清除监听定位
	handleClearLocate = () => {
		navigator.geolocation.clearWatch(this.watchID);
		console.log(this.watchID);
	};

	// 计算距离
	handleLocateDistance = (locationArr) => {
		let tmpArr = [];
		locationArr.forEach((item) => {
			let tmpItem = new window.AMap.LngLat(item[0], item[1]);
			tmpArr.push(tmpItem);
		});
		// 计算距离。除以1000代表公里
		this.setState({
			distance: (window.AMap.GeometryUtil.distanceOfLine(tmpArr) / 1000).toFixed(2)
		});
		console.log(this.state.distance + '公里');
	};
	// 时间计时器
	timeSwitch = () => {
		let that = this;
		this.timerObj = setInterval(function() {
			let timer = that.state.timer;
			let timerNow = that.state.timerNow;
			let timeAll = that.state.timeAll + 1;
			let speedNow = that.state.speedNow;
			let kcalNow = that.state.kcalNow;
			let [ h, m, s ] = that.state.timer;
			if (m === 59) {
				timer = [ h + 1, 0, s ];
			} else if (s === 59) {
				timer = [ h, m + 1, 0 ];
			} else {
				timer = [ h, m, s + 1 ];
			}
			// 更新时间
			timerNow = that.handleTimeNow(timer);
			// 更新速度
			speedNow = that.handleSpeedNow(timeAll);
			// 更新卡路里
			kcalNow = that.handleKcalNow();
			that.setState({
				timer: timer,
				timeAll: timeAll,
				timerNow: timerNow,
				speedNow: speedNow,
				kcalNow: kcalNow
			});
		}, 1000);
	};

	// 处理当前显示的时间
	handleTimeNow = (timer) => {
		let tmpArr = [];
		timer.forEach((item, index) => {
			if (item < 10) {
				tmpArr[index] = `0${item}`;
			} else {
				tmpArr[index] = item;
			}
		});
		if (tmpArr[0] === '00') {
			return `${tmpArr[1]}:${tmpArr[2]}`;
		}
		return `${tmpArr[0]}:${tmpArr[1]}:${tmpArr[2]}`;
	};

	// 处理当前显示的速度
	handleSpeedNow = (timeAll) => {
		let tmpTimer = timeAll / 3600;
		let speed = (this.state.distance / tmpTimer).toFixed(2);
		if (isNaN(speed) || speed > 1000000) {
			speed = 0;
		}
		return `${speed}`;
	};

	// 处理当前显示的卡路里
	handleKcalNow = () => {
		return (this.state.distance * 95.2).toFixed(1);
	};

	// 创建行程路径
	createPathTrajectory = () => {
		let that = this
		let lineArr = this.state.geolocationData.slice() // 监听定位发生变化时，记录的经纬数据
		let marker = new AMap.Marker({
			map: that.map,
			position: lineArr[0], // 起始点
			icon: 'https://webapi.amap.com/images/car.png',
			offset: new AMap.Pixel(-26, -13), // 图标大小带来的偏移
			autoRotation: true, // 路径方向变化，图标是否自动旋转
			angle: -90 //点标记的旋转角度，广泛用于改变车辆行驶方向
		})

		// 绘制轨迹。利用折线先画出路线
		let polyline = new AMap.Polyline({
			map: that.map,
			path: lineArr,
			showDir: true,
			strokeColor: '#28F', // 线颜色
			// strokeOpacity: 1,     //线透明度
			strokeWeight: 6 // 线宽
			// strokeStyle: "solid"  //线样式
		})
		// 再利用动画画出小车轨迹
		let passedPolyline = new AMap.Polyline({
			map: that.map,
			// path: lineArr,
			strokeColor: 'red', // 线颜色
			// strokeOpacity: 1,     //线透明度
			strokeWeight: 6 // 线宽
			// strokeStyle: "solid"  //线样式
		})

		//点标记在执行moveTo，moveAlong动画时触发事件，Object对象的格式是{passedPath:Array.<LngLat>}。其中passedPath为Marker对象在moveAlong或者moveTo过程中已经走过的路径。
		marker.on('moving', function (e) {
			//setPath设置组成该折线的节点数组
			//其中passedPath为Marker对象在moveAlong或者moveTo过程中已经走过的路径。
			passedPolyline.setPath(e.passedPath)
		})

		// 将地图调整到合适的缩放等级和中心点，我们可以调用setFitView()
		that.map.setFitView()
		// 执行动画
		marker.moveAlong(lineArr, 200)
	}

	handleStartGo = () => {
		if (!this.state.locationSucess) {
			Toast.fail('定位失败请检查权限或尝试刷新', 3);
			return;
		}
		if (this.state.startBtn === '开始') {
			this.setState({
				startBtn: '结束',
				isStartGo: true,
				startShow: true
			});
			this.handleWatchPosition();
			this.timeSwitch();
		} else if (this.state.startBtn === '结束') {
			clearInterval(this.timerObj);
			// 清除监听定位
			this.handleClearLocate();
			// 绘制轨迹
			this.createPathTrajectory();
			// 更新数据
			this.setState({
				startBtn: '退出',
				isStartGo: false
			});
			if (this.state.distance == 0) {
				Toast.fail('当前移动距离为0，数据不被上传', 3);
				return;
			}
			// saveTripDataAjax保存数据
			this.saveTripDataFetch()
		} else {
			this.map.destroy()
			this.props.history.push('/trip');
		}
	};

	handleRemark = (e) => {
		if (e.target.value.length > 40) {
			Toast.fail('备注不能超过40个字');
			return;
		}
		this.setState({
			markText: e.target.value
		});
	};

	renderStartGo = ({ markText, distance, timerNow, speedNow, kcalNow, isStartGo }) => {
		let reMark = <p className="mapLocation_markText">备注：{markText}</p>;
		if (isStartGo) {
			reMark = (
				<p className="mapLocation_markText">
					<label>备注</label>
					<input value={markText} onChange={this.handleRemark} placeholder="输入此次行程备注，不超过40字" />
				</p>
			);
		}
		return (
			<div className="mapLocation_startGo" id={isStartGo ? '' : 'mapLocation_startGo'}>
				<div className="mapLocation_startGoTop">
					<p>
						<span>{distance === 0 ? '0.00' : distance}</span> 公里
					</p>
				</div>
				<div className="mapLocation_startGoDetail">
					<p>
						<span>{timerNow}</span>
						<br />
						<span>总计时间</span>
					</p>
					<p>
						<span>{speedNow}</span>
						<br />
						<span>平均配速(km/h)</span>
					</p>
					<p>
						<span>{kcalNow}</span>
						<br />
						<span>消耗能量(k)</span>
					</p>
				</div>
				{reMark}
			</div>
		);
	};

	saveTripDataFetch = () => {
		let params = {
			type: 'trip',
			tripType: `${this.state.tripType}出行`,
			distance: this.state.distance,
			date: getTime().date2,
			time: this.state.timerNow,
			trajectory: JSON.stringify(this.state.geolocationData),
			Calorie: this.state.kcalNow,
			speed: this.state.speedNow,
			mark: this.state.markText || '未备注'
		}
		console.log(params);
		// fetch()
		// 待完成登录页之后，获取用户userId存到store中
		// 获取到的res.data中是行程数据存到store中
		get('/trip/addTrip', params).then(res => {
			Toast.success('本次出行记录已上传')
			this.props.tripActions.setUser(res.data);
			console.log(res);
		}).catch(err => {
			console.log(err);
			Toast.fail('记录上传失败');
		})
	}
}
const mapDispatchToProps = dispatch => ({
	tripActions: bindActionCreators(tripActions, dispatch)
})
export default connect(null, mapDispatchToProps)(MapLocation)