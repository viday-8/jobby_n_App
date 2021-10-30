import {Component} from 'react'

import Loader from 'react-loader-spinner'

import Cookies from 'js-cookie'

const apiStatusConstants = {
  initial: 'INITIAL',
  success: 'SUCCESS',
  failure: 'FAILURE',
  inProgress: 'IN_PROGRESS',
}

class ProfileCard extends Component {
  state = {
    profileApiStatus: apiStatusConstants.initial,
    userDetails: [],
  }

  componentDidMount() {
    this.getUserProfile()
  }

  getUserProfile = async () => {
    this.setState({profileApiStatus: apiStatusConstants.inProgress})
    const jwtToken = Cookies.get('jwt_token')
    const apiUrl = 'https://apis.ccbp.in/profile'
    const options = {
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
      method: 'Get',
    }

    const response = await fetch(apiUrl, options)

    if (response.ok === true) {
      const data = await response.json()
      const formattedData = {
        name: data.profile_details.name,
        profileImageUrl: data.profile_details.profile_image_url,
        shortBio: data.profile_details.short_bio,
      }
      this.setState({
        userDetails: formattedData,
        profileApiStatus: apiStatusConstants.success,
      })
    } else {
      this.setState({profileApiStatus: apiStatusConstants.failure})
    }
  }

  userProfile = () => {
    const {userDetails} = this.state
    return (
      <div className="userProfile">
        <img alt="profile" src={userDetails.profileImageUrl} />
        <h1>{userDetails.name}</h1>
        <p>{userDetails.shortBio}</p>
      </div>
    )
  }

  onReTryProfile = () => {
    this.getUserProfile()
  }

  renderProfileFailure = () => (
    <div>
      <button onClick={this.onReTryProfile} type="button">
        Retry
      </button>
    </div>
  )

  renderProfile = () => {
    const {profileApiStatus} = this.state
    switch (profileApiStatus) {
      case apiStatusConstants.success:
        return this.userProfile()
      case apiStatusConstants.inProgress:
        return (
          <div className="loader-container" testid="loader">
            <Loader type="ThreeDots" color="#ffff" height="50" width="50" />
          </div>
        )
      case apiStatusConstants.failure:
        return this.renderProfileFailure()
      default:
        return null
    }
  }

  render() {
    return <div>{this.renderProfile()}</div>
  }
}

export default ProfileCard
