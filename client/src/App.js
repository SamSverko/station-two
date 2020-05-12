// dependencies
import React from 'react'
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom'
import { Container } from 'react-bootstrap'
import styled, { createGlobalStyle } from 'styled-components'

// views
import IndexView from './views/Index'
import LobbyView from './views/Lobby'
import BuilderView from './views/Builder'
import Error404 from './views/Error404'

// styles
const GlobalStyle = createGlobalStyle`
  .card {
    margin: 0 0 15px 0;
  }
`

const PageStyle = styled(Container)`
  max-width: 400px;
  padding: 15px;
  text-align: center;
`

// routes
const routes = [
  {
    title: 'Home',
    path: '/',
    component: IndexView,
    exact: true
  },
  {
    title: 'Lobby',
    path: '/lobby/:triviaId',
    component: LobbyView,
    exact: true
  },
  {
    title: 'Builder',
    path: '/builder/:triviaId',
    component: BuilderView,
    exact: true
  }
]

const App = () => {
  return (
    <Router>
      <PageStyle fluid>
        <GlobalStyle />
        <Route render={(props) => {
          // update page title
          routes.forEach((route) => {
            if (route.path === props.location.pathname) {
              document.title = `${route.title} | Station Two`
            }
          })

          // display view, or if no view found, display 404 page
          return (
            <Switch>
              {routes.map((route, i) => (
                <Route key={i} {...route} />
              ))}
              <Route component={Error404} />
            </Switch>
          )
        }}
        />
      </PageStyle>
    </Router>
  )
}

export default App
