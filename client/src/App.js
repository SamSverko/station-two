// dependencies
import React from 'react'
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom'

// views
import IndexView from './views/Index'
import LobbyView from './views/Lobby'
import TriviaBuilderView from './views/TriviaBuilder'
import Error404 from './views/Error404'

const routes = [
  {
    title: 'Home',
    path: '/',
    component: IndexView,
    exact: true
  },
  {
    title: 'Lobby',
    path: '/lobby',
    component: LobbyView,
    exact: true
  },
  {
    title: 'Trivia Builder',
    path: '/builder',
    component: TriviaBuilderView,
    exact: true
  }
]

function App () {
  return (
    <Router>
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
    </Router>
  )
}

export default App
