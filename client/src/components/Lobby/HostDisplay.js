import React, { useState } from 'react'
import { Button, Card } from 'react-bootstrap'
import styled from 'styled-components'

// components
import PlayRound from './HostDisplay/PlayRound'
import MarkRound from './HostDisplay/MarkRound'
import Leaderboard from './HostDisplay/Leaderboard'

// styles
const HostControlContainerStyle = styled.div`
  width: 100%;
  div {
    align-items: center;
    display: flex;
    justify-content: center;
    button {
      margin: 5px;
      width: 50%;
    }
  }
`

const HostDisplay = ({ triviaData }) => {
  const [currentHostActionState, setCurrentHostActionState] = useState(false)
  const [currentRoundDataState, setCurrentRoundDataState] = useState(false)
  const [currentRoundNumberState, setCurrentRoundNumberState] = useState(false)

  const hostAction = (action, target, round, roundNumber) => {
    // update checked style
    const buttons = document.getElementsByClassName('action-button')
    for (let i = 0; i < buttons.length; i++) {
      buttons[i].classList.remove('active')
    }
    target.classList.add('active')

    setCurrentHostActionState(action)
    setCurrentRoundDataState(round)
    setCurrentRoundNumberState(roundNumber)
  }

  return (
    <Card>
      <Card.Body>
        <Card.Title>Host Controls</Card.Title>
        <HostControlContainerStyle>
          {triviaData.rounds.map((round, idx) => {
            return (
              <div key={idx}>
                <Button className='action-button' onClick={(event) => { hostAction('play-round', event.target, round, idx) }}>Play Round {idx + 1}</Button>
                <Button className='action-button' onClick={(event) => { hostAction('mark-round', event.target, round, idx) }}>Mark Round {idx + 1}</Button>
              </div>
            )
          })}
          <div>
            <Button className='action-button' onClick={(event) => { hostAction('play-round', event.target, triviaData.tieBreaker, 'tieBreaker') }}>Play Tie Breaker</Button>
            <Button className='action-button' onClick={(event) => { hostAction('mark-round', event.target, triviaData.tieBreaker, 'tieBreaker') }}>Mark Tie Breaker</Button>
          </div>
          <div>
            <Button className='action-button' onClick={(event) => { hostAction('display-leaderboard', event.target) }}>Display Leaderboard</Button>
          </div>
        </HostControlContainerStyle>

        {currentHostActionState === 'play-round' && (<PlayRound roundData={currentRoundDataState} roundNumber={currentRoundNumberState} />)}
        {currentHostActionState === 'mark-round' && (<MarkRound roundNumber={currentRoundNumberState} />)}
        {currentHostActionState === 'display-leaderboard' && (<Leaderboard />)}
      </Card.Body>
    </Card>
  )
}

export default HostDisplay
