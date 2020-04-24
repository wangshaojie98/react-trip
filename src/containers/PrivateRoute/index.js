import React, { Component } from 'react';
import { Route, Redirect } from 'react-router-dom';
import { connect } from 'react-redux';
import {actions as tripActions} from '../../redux/modules/trip';
import {get } from '../../utils/request';
import { Toast } from 'antd-mobile';
import {bindActionCreators} from 'redux'

class PrivateRoute extends Component {
	fetchAllDistance = () => {
    get('/trip/allDistance', {}).then(res => {
      this.props.tripActions.setDistance(res.data);
    }).catch(err => {
      Toast.fail('获取里程失败', 3);
      console.log(err);
    })
	}
	
	render() {
		let user = localStorage.getItem('user');
		let login;
		if (user != null) {
			login = JSON.parse(localStorage.getItem('user'));
			console.log('setUser');
			this.props.tripActions.setUser(login)
		}
		const { component: Component, ...rest } = this.props;
		if (login) {
			this.fetchAllDistance()
		}
		return (
			<Route
				{...rest}
				render={(props) => {
					return login ? (
						<Component {...props} />
					) : (
						<Redirect to={{ pathname: '/login', state: { from: props.location } }} />
					);
				}}
			/>
		);
	}
}


const mapDispatchtoProps = dispatch => ({
  tripActions: bindActionCreators(tripActions, dispatch)
})
export default connect(null, mapDispatchtoProps)(PrivateRoute);
