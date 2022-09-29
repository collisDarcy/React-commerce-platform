import React, { Component, Suspense } from 'react'
import { Route, Switch } from 'react-router-dom'
import Login from './pages/Login'
import Admin from './pages/Admin'
export default class App extends Component {

  render() {
    return (
      <Suspense fallback={null}>
        <Switch>
          <Route exact path="/" component={Login} />
          <Route exact path="/admin" component={Admin} />
        </Switch>
      </Suspense>
    )
  }
}
