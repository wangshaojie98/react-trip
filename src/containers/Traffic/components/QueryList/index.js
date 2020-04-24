import React, { Component } from 'react'
import QueryItem from '../QueryItem';
import {Icon } from 'antd-mobile';
import './style.scss';

export default class QueryList extends Component {
  render() {
    const {data,id, handleClickItem,handleCloseList} = this.props;
    return (
      <div className="queryList" id={id}>
        <p style={{textAlign: 'center'}}>
				  <Icon type='down' onClick={handleCloseList} />
        </p>
        {
          data.map((item, index) => {
            return <QueryItem data={item} key={index} handleClickItem={handleClickItem}/>
          })
        }
      </div>
    )
  }
}
