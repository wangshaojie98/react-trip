import React, { Component } from 'react';
import { AMap } from '../../utils/mapClass';
import QueryBox from './components/QueryBox';
import QueryList from './components/QueryList';
import TransportModes from './components/TransportModes';
import { Toast, Icon, Button } from 'antd-mobile';
import ConfirmModal from './components/Confirm';
import getTime from '../../utils/getTime';
import './style.scss';
import { connect } from 'react-redux';
import { actions as tripActions } from '../../redux/modules/trip';
import {bindActionCreators} from 'redux';
import {get} from '../../utils/request';
class Traffic extends Component {
	constructor(props) {
		super(props);
		this.state = {
			startName: '', // 出发地名称
			startData: {}, // 出发地数据
			destinationName: '', // 目的地名称
			destinationData: {}, // 目的地数据
			curFocusId: '0', // 1代表出发地，2 代表目的地,默认为0
			showQueryList: false, // 是否展示搜索结果列表
			queryList: [], // 搜索结果
			transportMode: 'AMap.Transfer',
			transportType: '公交/地铁',
			showTransportMode: false, // 是否展示交通方式列表
			showPanel: false, // 出行路线dom的显示与隐藏
			showPanelList: false, //是否展示出行路线
			distance: '0', // 规划路线的路程
			showConfirmModal: false, // 是否展示确认框
			dateTime: getTime().date3,
			markText: '', //备注
			spendValue: 0 // 花费
		};
	}
	render() {
		const {
			destinationName,
			startName,
			showQueryList,
			queryList,
			showTransportMode,
			transportMode,
			transportType,
			showPanelList,
			showPanel,
			showConfirmModal,
			markText,
			spendValue,
			dateTime
		} = this.state;
		return (
			<div className="traffic">
				<div id="traffic_mapContainer" />
				<QueryBox
					startName={startName}
					destinationName={destinationName}
					transportMode={transportType.slice(0, 2)}
					handleInputFocus={this.handleInputFocus}
					handleInput={this.handleInput}
					handleInputChange={this.handleInputChange}
					handleClickTransportBtn={this.handleClickTransportBtn}
					handleClickSearch={this.handleQueryRoute}
				/>
				<QueryList
					id={showQueryList === true ? 'queryList' : ''}
					data={queryList}
					handleClickItem={this.handleClickItem}
					handleCloseList={() => {
						this.setState({ showQueryList: false });
					}}
				/>
				<TransportModes
					transportMode={transportMode}
					showTransportMode={showTransportMode}
					handleSelectedTransport={this.handleSelectedTransport}
				/>
				<ConfirmModal
					showConfirmModal={showConfirmModal}
					transportType={transportType}
					markText={markText}
					startName={startName}
					destinationName={destinationName}
					spendValue={spendValue}
					dateTime={dateTime}
					handleConfirmModalShow={this.handleConfirmModalShow}
					handleConfirmInput={this.handleConfirmInput}
					handleConfirmSpeed={this.handleConfirmSpeed}
					handleConfirm={this.handleConfirm}
				/>
				<div
					id={showPanel ? 'traffic_panelContainer' : ''}
					className={showPanelList ? '' : 'traffic_panelList'}
				>
					<p className="traffic_panelTitle">
						<span className="traffic_panelLabel">请选择合适路线</span>
						<Icon type={showPanelList === true ? 'down' : 'up'} onClick={this.handleRoutePanel} />
						<Button
							type="primary"
							className="traffic_panelBtn"
							onClick={() => {
								this.setState({ showConfirmModal: true, dateTime: getTime().date3 });
							}}
						>
							确定
						</Button>
					</p>
					<div id="traffic_panel" />
				</div>
			</div>
		);
	}

	componentDidMount() {
		this.createMap();
		this.handleLocate();
	}

	// 创建地图
	createMap = () => {
		this.map = new AMap.Map('traffic_mapContainer', {
			resizeEnable: true,
			center: [ 116.397428, 39.90923 ],
			zoom: 13 // 地图显示的缩放级别
		});
	};

	// 加载地图定位
	handleLocate = () => {
		const that = this;
		this.map.plugin([ 'AMap.Geolocation', 'AMap.ControlBar' ], function() {
			var geolocation = new AMap.Geolocation({
				enableHighAccuracy: true, // 是否使用高精度定位，默认:true
				timeout: 15000, // 超过10秒后停止定位，默认：5s
				buttonPosition: 'LB', // 定位按钮的停靠位置
				buttonOffset: new AMap.Pixel(10, 20), // 定位按钮与设置的停靠位置的偏移量，默认：Pixel(10, 20)
				zoomToAccuracy: true // 定位成功后是否自动调整地图视野到定位点
			});
			// 定位插件---------------------------------------------------------
			that.map.addControl(geolocation);
			geolocation.getCurrentPosition(function(status, result) {
				// Toast.hide()
			});
			AMap.event.addListener(geolocation, 'error', function(e) {
				console.log(e);
			}); // 返回定位出错信息
		});
	};

	// 聚焦操作时，先根据关键词查询一次，然后选择聚焦id和展示列表，清空列表
	handleInputFocus = (e) => {
		const target = e.target;
		const id = target.getAttribute('data-id');
		const value = target.value;
		// 如果有值的话查询一次
		if (value) this.handleQueryForKey(value);

		this.setState({
			curFocusId: id,
			queryList: [],
			showQueryList: true,
			showPanelList: false
		});
	};

	// 添加防抖效果查询调用关键词函数
	handleInput = (e) => {
		const value = e.target.value;
		if (this.timer) clearTimeout(this.timer);

		this.timer = setTimeout(() => {
			this.handleQueryForKey(value);
		}, 500);
	};

	// 双向绑定目的地或出发地输入框
	handleInputChange = (e) => {
		const value = e.target.value;
		if (this.state.curFocusId === '1') {
			this.setState({
				startName: value
			});
		} else if (this.state.curFocusId === '2') {
			this.setState({
				destinationName: value
			});
		}
	};

	// 添加插件查询关键词
	handleQueryForKey = (keyword) => {
		Toast.loading('正在搜索...', 5);
		let that = this;
		this.map.plugin('AMap.Autocomplete', function() {
			// 实例化Autocomplete
			var autoOptions = {
				// city 限定城市，默认全国
				city: '全国'
			};
			var autoComplete = new AMap.Autocomplete(autoOptions);
			autoComplete.search(keyword, function(status, result) {
				Toast.hide();
				// 搜索成功时，result即是对应的匹配数据
				if (status !== 'complete') {
					that.setState({
						queryList: []
					});
					return;
				}
				if (result.info !== 'OK') {
					that.setState({
						queryList: []
					});
					return;
				}
				that.setState({
					queryList: result.tips
				});
			});
		});
	};

	// 选择地点
	handleClickItem = (data) => {
		if (this.timer) clearTimeout(this.timer); // 清除查询延迟计时器
		console.log(data);
		let typeName = 'start'; // 出发地或者目的地类型
		let searchData = {}; // 出发地或者目的地数据
		if (this.state.curFocusId === '1') {
			typeName = 'start';
		} else if (this.state.curFocusId === '2') {
			typeName = 'destination';
		}
		searchData = data;
		this.setState({
			[typeName + 'Name']: data.name,
			showQueryList: false,
			[typeName + 'Data']: searchData
		});
	};
	// 改变交通方式
	handleSelectedTransport = (transportMode) => {
		let value = '公交/地铁';
		switch (transportMode) {
			case 'AMap.Transfer':
				value = '公交/地铁';
				transportMode = 'AMap.Transfer';
				break;
			case 'AMap.Driving':
				value = '出租车';
				transportMode = 'AMap.Driving';
				break;
			case 'AMap.Riding':
				value = '单车/电车';
				transportMode = 'AMap.Riding';
				break;
			case 'AMap.Walking':
				value = '步行';
				transportMode = 'AMap.Walking';
				break;
			default:
				value = '步行';
				transportMode = 'AMap.Transfer';
		}
		this.setState({
			transportMode,
			transportType: value
		});
		this.handleClickTransportBtn(); // 关闭展示交通方式列表
	};

	// 关闭或展示交通方式列表
	handleClickTransportBtn = () => {
		this.setState({
			showTransportMode: !this.state.showTransportMode
		});
	};

	// 加载查询路线插件
	handleDriving = (LngLatArr) => {
		Toast.loading('正在规划路线...', 10);
		let that = this;
		let type = this.state.transportMode.slice(5, 15);
		this.map.plugin(this.state.transportMode, function() {
			that.driving = new AMap[type]({
				map: that.map,
				city: '北京市',
				panel: 'traffic_panel', // DOM id
				autoFitView: true
				//   policy: window.AMap.TransferPolicy.LEAST_TIME
			});
			// 根据起终点经纬度规划驾车导航路线
			that.driving.search(
				LngLatArr[0],
				LngLatArr[1],
				//   new window.AMap.LngLat(116.291035, 39.907899),
				//   new window.AMap.LngLat(116.427281, 39.903719),
				function(status, result) {
					// result 即是对应的驾车导航信息，相关数据结构文档请参考  https://lbs.amap.com/api/javascript-api/reference/route-search#m_DrivingResult
					Toast.hide();
					console.log(status, result);
					if (status === 'complete') {
						console.log('绘制驾车路线完成');
						// 是否展示路线
						that.setState({
							showPanel: true,
							showPanelList: true,
							showQueryList: false
						});
						// 存第一条轨迹的路程
						let distance;
						if (result.plans) {
							distance = (result.plans[0].distance / 1000).toFixed(2);
						} else {
							distance = (result.routes[0].distance / 1000).toFixed(2);
						}
						that.setState({
							distance: distance
						});
						//   that.isPanelShow = true
					} else {
						console.log('获取驾车数据失败：' + result);
						Toast.fail('未检测到匹配路线', 3);
					}
				}
			);
			// window.AMap.event.addListener(that.driving, 'complete', function (e) {
			//   console.log(e)
			// }) // 返回定位出错信息
		});
	};

	// 查询路线按钮
	handleQueryRoute = () => {
		if (this.driving) {
			this.driving.clear();
		}
		const { startData, destinationData } = this.state;
		console.log(this.state);
		let LngLatArr = [];
		if (!startData.location || !destinationData.location) {
			Toast.fail('请先在列表中确认准确地点');
			return;
		} else {
			// 把location对象推入数组
			// Q: 33.643642
			// R: 115.18052
			// lng: 115.18052
			// lat: 33.643642
			LngLatArr.push(startData.location, destinationData.location);
		}
		this.handleDriving(LngLatArr);
	};
	// 控制路线规划的显示
	handleRoutePanel = () => {
		this.setState({
			showPanelList: !this.state.showPanelList
		});
	};
	// 关闭确认框
	handleConfirmModalShow = () => {
		console.log(this.state);
		this.setState({
			showConfirmModal: false
		});
	};
	// 处理确认框的备注信息
	handleConfirmInput = (val) => {
		this.setState({
			markText: val
		});
	};
	// 处理确认框的花费
	handleConfirmSpeed = (val) => {
		this.setState({
			spendValue: val
		});
	};
	// 点击确认框确认保存
	handleConfirm = () => {
		// 关闭确认框
		this.handleConfirmModalShow();
		// 存入后台
		this.saveTripDataAjax();
		// 清除信息
		this.driving.clear();
		this.setState({
			startName: '',
			startData: {},
			destinationName: '',
			destinationData: {},
			curFocusId: '0',
			showQueryList: false,
			showPanel: false,
			spendValue: 0,
			markText: ''
		});
	};

	saveTripDataAjax = () => {
		const {
			startName,
			startData,
			destinationName,
			destinationData,
			transportType,
			distance,
			markText,
			spendValue
		} = this.state;
		console.log('确认');
		let startCode = `${startData.location.lng}, ${startData.location.lat}`;
		let endCode = `${destinationData.location.lng}, ${destinationData.location.lat}`;
		let params = {
			type: 'traffic',
			tripType: transportType,
			distance,
			date: getTime().date2,
			time: getTime().date4,
			price: spendValue,
			startPlace: startName,
			endPlace: destinationName,
			startCode: startCode,
			endCode: endCode,
			mark: markText || '未备注'
		};
		get('/trip/addTraffic', params).then(res => {
			this.props.tripActions.setUser(res.data);
			Toast.success('本次记录上传成功')
		}).catch(err => {
			Toast.fail('本次记录上传失败');
			console.log(err);
		})
		console.log(params);
		Toast.success('数据成功上传', 3)
	};
}

const mapDispatchToProps = dispatch => ({
	tripActions: bindActionCreators(tripActions, dispatch)
})
export default connect(null, mapDispatchToProps)(Traffic)