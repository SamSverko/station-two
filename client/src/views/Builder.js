// dependencies
import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'

function Builder () {
  const urlParams = new URLSearchParams(window.location.search)
  const [triviaId] = useState(urlParams.get('triviaId') || false)

  useEffect(() => {
    console.log(triviaId)
  })

  return (
    <div>
      <h1>Trivia builder page</h1>
      <Link to='/'>To Index</Link>
    </div>
  )
}

export default Builder
