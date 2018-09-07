//@flow

import React from 'react'
import { Message } from 'semantic-ui-react'

const Notification = ({ notification }) => {
  if (notification === null) {
    return null
  }

  if (notification.type === 'info') {
    return (
      <Message success>
        {notification.message}
      </Message>
    )
  } 

  return (
    <Message negative>
      {notification.message}
    </Message>
  )
}

export default Notification