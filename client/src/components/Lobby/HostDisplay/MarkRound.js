import React from 'react'

const MarkRound = ({ roundNumber }) => {
  if (roundNumber !== 'tieBreaker') {
    return (
      <>
        <hr />
        <p className='h5'>Mark Round {roundNumber + 1}</p>
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
