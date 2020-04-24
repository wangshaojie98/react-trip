import React from 'react'
import HistoryItem from '../HistoryItem';

export default function HistoryList({data}) {
  return (
    <div className="historyList">
      {
        data.map(item => {
          return <HistoryItem data={item} key={item.id}/>
        })
      }
    </div>
  )
}
