import React from 'react';
import { Modal, List, Stepper, InputItem } from 'antd-mobile';
import './style.scss';
const Item = List.Item;
const Brief = Item.Brief;
function closest(el, selector) {
	const matchesSelector = el.matches || el.webkitMatchesSelector || el.mozMatchesSelector || el.msMatchesSelector;
	while (el) {
		if (matchesSelector.call(el, selector)) {
			return el;
		}
		el = el.parentElement;
	}
	return null;
}

const onWrapTouchStart = (e) => {
	// fix touch to scroll background page on iOS
	if (!/iPhone|iPod|iPad/i.test(navigator.userAgent)) {
		return;
	}
	const pNode = closest(e.target, '.am-modal-content');
	if (!pNode) {
		e.preventDefault();
	}
};

const Confirm = ({
	showConfirmModal,
	markText,
	spendValue,
	dateTime,
	transportType,
	startName,
	destinationName,
	handleConfirmModalShow,
  handleConfirmInput,
  handleConfirmSpeed,
  handleConfirm
}) => (
	<Modal
		className="confirmModal"
		visible={showConfirmModal}
		transparent
		maskClosable={false}
		onClose={handleConfirmModalShow}
		title="本次出行"
		footer={[
			{
				text: '确认保存',
				onPress: () => {
					handleConfirm();
				}
			}
		]}
		wrapProps={{ onTouchStart: onWrapTouchStart }}
		afterClose={() => {
			// alert('afterClose');
		}}
	>
		<div>
			<List className="confirmModal_list">
				<Item extra={transportType}>交通方式</Item>
				<Item extra={startName}>出发地</Item>
				<Item extra={destinationName}>目的地</Item>
				<Item extra={dateTime}>日期</Item>
        <List.Item
          wrap
          extra={
            <Stepper
              style={{ width: '50%', minWidth: '100px' }}
              showNumber
              min={0}
              value={spendValue}
              onChange={handleConfirmSpeed}
            />}
        >
        花费
        </List.Item>
				<InputItem
					type="text"
					style={{ textAlign: 'right', fontSize: 14 }}
					placeholder="点击此处备注，少于20字"
					onChange={handleConfirmInput}
          value={markText}
          maxLength={20}
				>
					备注
				</InputItem>
			</List>
		</div>
	</Modal>
);
export default Confirm;
