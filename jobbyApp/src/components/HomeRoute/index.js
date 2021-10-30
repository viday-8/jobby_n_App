import {Component} from 'react'

import Cookies from 'js-cookie'

import {Link, Redirect} from 'react-router-dom'
import Header from '../header'

import './index.css'

class Home extends Component {
  render() {
    const jwtToken = Cookies.get('jwt_token')
    if (jwtToken === undefined) {
      return <Redirect to="/login" />
    }
    return (
      <div>
        <Header />
        <ul className="homeMain">
          <li>
            <h1 className="homeHeading">Find The Job That Fits Your Life</h1>
          </li>
          <li>
            <p>
              Millions of people are searching for jobs, salary information,
              company reviews. Find the job that fits your abilities and
              potential.
            </p>
          </li>
          <li>
            <Link to="/jobs">
              <button className="FindJobs" type="button">
                Find Jobs
              </button>
            </Link>
          </li>
        </ul>
      </div>
    )
  }
}

export default Home
