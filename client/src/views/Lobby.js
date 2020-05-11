// dependencies
import React from 'react'
import { Link } from 'react-router-dom'

function Lobby () {
  return (
    <div>
      <h1>Lobby page</h1>
      <Link to='builder'>To Builder</Link>
    </div>
  )
}

export default Lobby
