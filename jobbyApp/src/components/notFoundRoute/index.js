import {Component} from 'react'

import Cookies from 'js-cookie'
import {AiFillHome} from 'react-icons/ai'
import {BsFillBagFill} from 'react-icons/bs'
import {RiLogoutBoxRFill} from 'react-icons/ri'

import {Link} from 'react-router-dom'

import './index.css'

class NotFound extends Component {
  logOut = () => {
    const {history} = this.props
    Cookies.remove('jwt_token')
    history.replace('/login')
  }

  onLogo = () => {
    const {history} = this.props
    history.replace('/')
  }

  render() {
    return (
      <div>
        <div className="nav">
          <Link style={{textDecoration: 'none'}} to="/">
            <img
              width={100}
              alt="website logo"
              src="https://assets.ccbp.in/frontend/react-js/logo-img.png  "
            />
          </Link>
          <div className="links">
            <Link style={{textDecoration: 'none'}} to="/">
              <h1 className="linkName">Home</h1>
            </Link>
            <Link style={{textDecoration: 'none'}} to="/jobs">
              <h1 className="linkName">Jobs</h1>
            </Link>
          </div>
          <button onClick={this.logOut} className="logoutBtn" type="button">
            LogOut
          </button>
          <div className="small">
            <Link style={{textDecoration: 'none'}} to="/">
              <AiFillHome fontSize="30px" color="white" />
            </Link>
            <Link style={{textDecoration: 'none'}} to="/jobs">
              <BsFillBagFill fontSize="30px" color="white" />
            </Link>
            <button onClick={this.logOut} className="logoutIcon" type="button">
              <RiLogoutBoxRFill fontSize="30px" color="white" />
            </button>
          </div>
        </div>
        <div className="notFound">
          <img
            alt="not found"
            src="https://assets.ccbp.in/frontend/react-js/jobby-app-not-found-img.png"
          />
          <h1>Page Not Found</h1>

          <p>we&#8217;re sorry, the page you requested could not be found</p>
        </div>
      </div>
    )
  }
}

export default NotFound
