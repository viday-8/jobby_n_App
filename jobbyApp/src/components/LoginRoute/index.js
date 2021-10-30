import {Component} from 'react'

import Cookies from 'js-cookie'

import {Redirect} from 'react-router-dom'

import {RiEyeCloseLine, RiEyeLine} from 'react-icons/ri'

import './index.css'

class Login extends Component {
  state = {
    username: '',
    password: '',
    showError: false,
    errorMsg: '',
    showPassword: false,
  }

  onUserName = event => {
    this.setState({username: event.target.value})
  }

  onPassword = event => {
    this.setState({password: event.target.value})
  }

  onSubmitSuccess = jwtToken => {
    const {history} = this.props
    Cookies.set('jwt_token', jwtToken, {
      expires: 30,
      path: '/',
    })
    history.replace('/')
  }

  onSubmitFailure = errorMsg => {
    this.setState({showError: true, errorMsg})
  }

  onSubmit = async event => {
    event.preventDefault()
    const {username, password} = this.state
    const userDetails = {username, password}
    const url = 'https://apis.ccbp.in/login'
    const options = {
      method: 'POST',
      body: JSON.stringify(userDetails),
    }
    const response = await fetch(url, options)
    const data = await response.json()
    if (response.ok) {
      this.onSubmitSuccess(data.jwt_token)
      this.setState({username: '', password: ''})
    } else {
      this.onSubmitFailure(data.error_msg)
    }
  }

  onShowPassword = () => {
    const {password} = this.state
    if (password.length > 0) {
      this.setState(prevState => ({
        showPassword: !prevState.showPassword,
      }))
    }
  }

  render() {
    const {userName, password, showError, errorMsg, showPassword} = this.state
    const jwtToken = Cookies.get('jwt_token')
    if (jwtToken !== undefined) {
      return <Redirect to="/" />
    }
    return (
      <div className="mainLogin">
        <div className="loginCon">
          <form onSubmit={this.onSubmit} className="form">
            <img
              width={100}
              alt="website logo"
              src="https://assets.ccbp.in/frontend/react-js/logo-img.png "
            />
            <div className="inputCon">
              <label htmlFor="username">USERNAME</label>
              <input
                onChange={this.onUserName}
                value={userName}
                className="input"
                type="text"
                id="username"
                placeholder="Username"
              />
            </div>
            <div className="inputCon">
              <label htmlFor="password">PASSWORD</label>
              <div className="inputEl">
                <input
                  onChange={this.onPassword}
                  value={password}
                  className="input"
                  type={showPassword ? 'input' : 'password'}
                  id="password"
                  placeholder="password"
                />
              </div>
            </div>
            <div className="pass">
              <button
                className="showBtn"
                onClick={this.onShowPassword}
                type="button"
              >
                {showPassword ? (
                  <RiEyeLine className="icons" />
                ) : (
                  <RiEyeCloseLine className="icons" />
                )}
                <p style={{margin: '0'}}>ShowPassword</p>
              </button>
            </div>
            {showError ? <p className="errorMsg">{errorMsg}</p> : null}
            <button className="loginBtn" type="submit">
              Login
            </button>
          </form>
        </div>
      </div>
    )
  }
}

export default Login
