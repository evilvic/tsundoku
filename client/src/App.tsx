import React, { Component } from 'react'
import { Route, Router, Switch } from 'react-router-dom'
import { Menu } from 'semantic-ui-react'
import Auth from './auth/Auth'
import { EditBook } from './components/EditBook'
import { LogIn } from './components/LogIn'
import { NotFound } from './components/NotFound'
import { Books } from './components/Books'

export interface AppProps {}

export interface AppProps {
  auth: Auth
  history: any
}

export interface AppState {}

export default class App extends Component<AppProps, AppState> {
  constructor(props: AppProps) {
    super(props)
    this.handleLogin = this.handleLogin.bind(this)
    this.handleLogout = this.handleLogout.bind(this)
  }

  handleLogin() {
    this.props.auth.login()
  }

  handleLogout() {
    this.props.auth.logout()
  }

  render() {
    return (
      <div className='app'>
        <Router history={this.props.history}>
          {this.logOutButton()}
          {this.generateCurrentPage()}
        </Router>
      </div>
    )
  }

  logOutButton() {
    if (this.props.auth.isAuthenticated()) {
      return (
        <Menu className='logout'>
          <Menu.Item name="logout" onClick={this.handleLogout}>
            Log Out
          </Menu.Item>
        </Menu>
      )
    } else {
      return null
    }
  }

  generateCurrentPage() {
    if (!this.props.auth.isAuthenticated()) {
      return <LogIn auth={this.props.auth} />
    }

    return (
      <Switch>
        <Route
          path="/"
          exact
          render={props => {
            return <Books {...props} auth={this.props.auth} />
          }}
        />
        <Route
          path="/books/:bookId/edit"
          exact
          render={props => {
            return <EditBook {...props} auth={this.props.auth} />
          }}
        />
        <Route component={NotFound} />
      </Switch>
    )
  }
}
