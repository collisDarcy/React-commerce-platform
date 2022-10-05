import React, { Component, Suspense } from 'react'
import { Route, Switch } from 'react-router-dom'
import Login from './pages/Login'
import Admin from './pages/Admin'
export default class App extends Component {

  render() {
    return (
<<<<<<< HEAD
      <Suspense>
        <Switch>
          <Route exact path="/" component={Login} />
          <Route path="/admin" component={Admin} />
        </Switch>
      </Suspense>

=======
      <Suspense fallback={null}>
        <Switch>
          <Route exact path="/" component={Login} />
          <Route exact path="/admin" component={Admin} />
        </Switch>
      </Suspense>
>>>>>>> e64e3c433881778a2b51e839f3370a68ad95763f
    )
  }
}
