import React from 'react';
import './style.scss';

export default function UserHeader({imgAddress, name, username}) {
  return (
    <div className="userHeader">
      <div className="userHeader_avatarBox">
        <img src={imgAddress} alt="avatar"></img>
      </div>
      <div className="userHeader_basic">
        <p className="userHeader_name">{name}</p>
        <p className="userHeader_username">账号：{username}</p>
      </div>
    </div>
  )
}
