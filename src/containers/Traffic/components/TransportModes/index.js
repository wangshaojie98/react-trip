/* eslint global-require:0, no-nested-ternary:0 */
import { Menu } from 'antd-mobile';
import React from 'react';
import './style.scss';
const transports = [
	{
		value: 'AMap.Transfer',
		label: '公交/地铁'
	},
	{
		value: 'AMap.Driving',
		label: '出租车'
	},
	{
		value: 'AMap.Riding',
		label: '单车/电车'
	},
	{
		value: 'AMap.Walking',
		label: '步行'
	}
];
export default function TransportModes({ showTransportMode: show, transportMode, handleSelectedTransport }) {
  const menuEl = (
    <Menu
      className="single-foo-menu"
      data={transports}
      value={[ transportMode ]}
      level={1}
      onChange={(valueArr) => {handleSelectedTransport(valueArr[0])}}
      // height={document.documentElement.clientHeight * 0.6}
    />
  );
  return (
    <div className={`transportModes ${show ? 'single-menu-active' : ''}`}>
				{show ? menuEl : null}
		</div>
  )
}
