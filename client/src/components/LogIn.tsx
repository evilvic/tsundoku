import * as React from 'react'
import Auth from '../auth/Auth'
import { Button } from 'semantic-ui-react'

interface LogInProps {
  auth: Auth
}

interface LogInState {}

export class LogIn extends React.PureComponent<LogInProps, LogInState> {
  onLogin = () => {
    this.props.auth.login()
  }

  render() {
    return (
      <div className='login_screen'>
        <h1>TSUNDOKU</h1>
        <p>Stack your books!</p>
        <img 
          src='https://sls-tsundoku-images-dev.s3.amazonaws.com/app/start.jpg'
          className='login_screen-img'
        />
        <Button onClick={this.onLogin} size="huge" color="purple">
          START
        </Button>
      </div>
    )
  }
}
