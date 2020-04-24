import React, { Component } from 'react';
import { Button } from 'antd-mobile';
import './style.scss';

export default class QueryBox extends Component {
	render() {
		const {startName, destinationName, transportMode, handleInputFocus, handleInput, handleInputChange, handleClickTransportBtn, handleClickSearch} = this.props;
		return (
			<div className="queryBox">
				<div className="queryBox_box">
					<input 
						type="text" 
						value={startName} 
						className="queryBox_search" 
						data-id="1" 
						placeholder="请输入出发地" 
						onInput={handleInput} 
						onFocus={handleInputFocus}
						onChange={handleInputChange}
					/>
					<Button type="ghost" className="queryBox_btn" onClick={handleClickTransportBtn}>
						{transportMode}
					</Button>
				</div>
				<div className="queryBox_box">
					<input 
						type="text" 
						value={destinationName} 
						className="queryBox_search" 
						data-id="2" 
						placeholder="请输入目的地" 
						onInput={handleInput} 
						onFocus={handleInputFocus}
						onChange={handleInputChange}
						/>
					<Button type="primary" className="queryBox_btn" onClick={handleClickSearch}>
						搜索
					</Button>
				</div>
			</div>
		);
	}
}
