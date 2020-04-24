import MapLocation from '../../components/MapLocation'
import {BrowserRouter as Router, Route, Switch, Redirect } from 'react-router-dom'
import TarBar from '../TabBar';
import Trip from '../Trip'
import Traffic from '../Traffic'
import History from '../History'
import User from '../User'
import HistoryDetail from '../HistoryDetail'
import Login from '../Login'
import Trend from '../Trend'
import UserDetail from '../UserDetail'
import Analysis from '../Analysis'
import React, { Component } from 'react';
import {get} from '../../utils/request';
import {Toast} from 'antd-mobile'
import PrivateRoute from '../PrivateRoute';

export default class App extends Component {
  fetchAllDistance = () => {
    get('/trip/allDistance', {}).then(res => {
      console.log(res);
      this.props.tripActions.setDistance(res.data);
    }).catch(err => {
      Toast.fail('获取里程失败', 3);
      console.log(err);
    })
  }
  render() {
    return (
      <div className="App" style={{backgroundColor: '#FFF'}}>
      <Router>
        <Switch>
          <PrivateRoute path="/trip" component={Trip} exact></PrivateRoute>
          <PrivateRoute path="/trip/map" component={MapLocation}></PrivateRoute>
          <PrivateRoute path="/traffic" component={Traffic}></PrivateRoute>
          <PrivateRoute path="/history" component={History} exact></PrivateRoute>
          <PrivateRoute path="/history/details" component={HistoryDetail} exact></PrivateRoute>
          <PrivateRoute path="/user" component={User} exact></PrivateRoute>
          <PrivateRoute path="/user/userDetail" component={UserDetail} exact></PrivateRoute>
          <PrivateRoute path="/user/trend" component={Trend}></PrivateRoute>
          <PrivateRoute path="/user/analysis" component={Analysis}></PrivateRoute>
          <Route path="/login" component={Login}></Route>
          <Redirect from="/" to="/trip" />
        </Switch>
        <TarBar />
      </Router>
    </div>
    )
  }
}