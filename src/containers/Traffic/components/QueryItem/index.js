import React, { Component } from 'react';
import './style.scss';

export default class QueryItem extends Component {
  render() {
    const {data, handleClickItem} = this.props;
    return (
      <div className="queryItem" onClick={() => {handleClickItem(data)}}>
        <p className="queryItem_name">{data.name}</p>
        <p className="queryItem_address">{typeof data.address === 'string' ? data.address : data.district}</p>
      </div>
    )
  }
}
