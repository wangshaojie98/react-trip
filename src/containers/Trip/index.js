import TabList from './components/TabList';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { getUserDistance } from '../../redux/modules/trip';
import './style.scss'
class Trip extends Component {
	render() {
		return (
			<div className="trip">
				{this.props.userDistance ? (
					<TabList onClickItem={this.handleClickTripItem} userDistance={this.props.userDistance} />
				) : null}
			</div>
		);
	}

	handleClickTripItem = (item) => {
		this.props.history.push({ pathname: '/trip/map', state: { type: item }, query: { type: item } });
	};
}

const mapStateToProps = (state) => ({
	userDistance: getUserDistance(state)
});

export default connect(mapStateToProps, null)(Trip);
