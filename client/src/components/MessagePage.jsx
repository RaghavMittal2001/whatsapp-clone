import React from 'react'
import { useSelector } from 'react-redux'

const MessagePage=()=> {
  const d= useSelector((state)=>state.user)
  return (
    <div>
      Message
      <button>{d.email}</button>
    </div>
  )
}

export default MessagePage
