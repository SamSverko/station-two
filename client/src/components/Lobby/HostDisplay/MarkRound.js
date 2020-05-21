import React from 'react'

const MarkRound = ({ roundNumber }) => {
  const displayRound = parseInt(roundNumber) + 1

  if (roundNumber !== 'tieBreaker') {
    return (
      <>
        <hr />
        <p className='h5'>Mark Round {displayRound}</p>
      </>
    )
  } else {
    return (
      <>
        <hr />
        <p className='h5'>Mark Tie Breaker</p>
      </>
    )
  }
}

export default MarkRound
