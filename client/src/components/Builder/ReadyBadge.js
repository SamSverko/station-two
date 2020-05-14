import React from 'react'
import { Badge } from 'react-bootstrap'

const ReadyBadge = ({ isReady }) => {
  if (isReady) {
    return <Badge variant='success'>Ready</Badge>
  } else {
    return <Badge variant='danger'>Not Ready</Badge>
  }
}

export default ReadyBadge
