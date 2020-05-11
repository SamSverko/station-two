// dependencies
import React from 'react'
import { Link } from 'react-router-dom'

function Index () {
  return (
    <div>
      <h1>Index page</h1>
      <Link to='lobby'>To Lobby</Link>
    </div>
  )
}

export default Index
