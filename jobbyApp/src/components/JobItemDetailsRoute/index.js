import {Component} from 'react'

import {Redirect} from 'react-router-dom'
import {AiFillStar} from 'react-icons/ai'
import {BsFillBagFill} from 'react-icons/bs'
import {ImLocation} from 'react-icons/im'
import {HiOutlineExternalLink} from 'react-icons/hi'

import Loader from 'react-loader-spinner'

import Cookies from 'js-cookie'
import Header from '../header'

import './index.css'

const apiStatusConstants = {
  initial: 'INITIAL',
  success: 'SUCCESS',
  failure: 'FAILURE',
  inProgress: 'IN_PROGRESS',
}

class JobItemDetails extends Component {
  state = {
    apiStatus: apiStatusConstants.initial,
    jobDetails: [],
    similarJobs: [],
  }

  componentDidMount() {
    this.getItemDetails()
  }

  getItemDetails = async () => {
    this.setState({apiStatus: apiStatusConstants.inProgress})
    const {match} = this.props
    const {params} = match
    const {id} = params
    const jwtToken = Cookies.get('jwt_token')
    const apiUrl = `https://apis.ccbp.in/jobs/${id}`
    const options = {
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
      method: 'GET',
    }
    const response = await fetch(apiUrl, options)

    if (response.ok === true) {
      const data = await response.json()
      const formattedJobDetails = [data.job_details].map(each => ({
        companyLogoUrl: each.company_logo_url,
        companyWebsiteUrl: each.company_website_url,
        employmentType: each.employment_type,
        id: each.id,
        jobDescription: each.job_description,
        lifeAtCompanyDescription: each.life_at_company.description,
        lifeAtCompanyImageUrl: each.life_at_company.image_url,
        location: each.location,
        packagePerAnnum: each.package_per_annum,
        rating: each.rating,
        skills: each.skills,
        title: each.title,
      }))

      const formattedSimilarJobs = [data.similar_jobs].map(each => ({
        similarJob: each.map(item => ({
          id: item.id,
          companyImageUrl: item.company_logo_url,
          employmentType: item.employment_type,
          jobDescription: item.job_description,
          location: item.location,
          rating: item.rating,
          title: item.title,
        })),
      }))
      this.setState({
        jobDetails: formattedJobDetails,
        similarJobs: formattedSimilarJobs,
        apiStatus: apiStatusConstants.success,
      })
    } else {
      this.setState({
        apiStatus: apiStatusConstants.failure,
      })
    }
  }

  renderItem = () => {
    const {jobDetails, similarJobs} = this.state
    return (
      <div>
        <div className="item">
          <div className="itemTop">
            <img
              width={50}
              alt="job details company logo"
              src={jobDetails[0].companyLogoUrl}
            />
            <div className="details">
              <h1>{jobDetails[0].title}</h1>
              <p>
                <AiFillStar color="gold" />
                {jobDetails[0].rating}
              </p>
            </div>
          </div>
          <div className="itemMore">
            <div className="itemLoc">
              <p>
                <ImLocation />
                {jobDetails[0].location}
              </p>
              <p>
                <BsFillBagFill />
                {jobDetails[0].employmentType}
              </p>
            </div>
            <p>{jobDetails[0].packagePerAnnum}</p>
          </div>
          <hr />
          <div className="visit">
            <h1>Description</h1>
            <a
              rel="noreferrer"
              target="_blank"
              className="ALink"
              href={jobDetails[0].companyWebsiteUrl}
            >
              <HiOutlineExternalLink />
              Visit
            </a>
          </div>
          <p>{jobDetails[0].jobDescription}</p>
          <h1>Skills</h1>
          <ul className="skillCon">
            {jobDetails[0].skills.map(each => (
              <li className="skillItem" key={each.name}>
                <img className="logoI" alt={each.name} src={each.image_url} />
                <p>{each.name}</p>
              </li>
            ))}
          </ul>
          <h1>Life at Company</h1>
          <div className="lifeCon">
            <p>{jobDetails[0].lifeAtCompanyDescription}</p>
            <img
              alt="life at company"
              src={jobDetails[0].lifeAtCompanyImageUrl}
            />
          </div>
        </div>
        <h1>Similar Jobs</h1>
        <ul className="similarList">
          {similarJobs[0].similarJob.map(each => (
            <li className="similarItem" key={each.id}>
              <div className="itemTop">
                <img
                  width={50}
                  alt="similar job company logo"
                  src={each.companyImageUrl}
                />
                <div className="details">
                  <h1>{each.title}</h1>
                  <p>
                    <AiFillStar color="gold" />
                    {each.rating}
                  </p>
                </div>
              </div>
              <h1 className="details">Description</h1>
              <p>{each.jobDescription}</p>
              <div>
                <p>{each.location}</p>
                <p>{each.employmentType}</p>
              </div>
            </li>
          ))}
        </ul>
      </div>
    )
  }

  onReTryJobDetails = () => {
    this.getItemDetails()
  }

  renderJobDetailsFailure = () => (
    <div className="jobFailure">
      <img
        alt="failure view"
        src="https://assets.ccbp.in/frontend/react-js/failure-img.png"
      />
      <h1>Oops! Something Went Wrong</h1>
      <p>We cannot seem to find the page you are looking for</p>
      <button
        className="RetryBtn"
        type="button"
        onClick={this.onReTryJobDetails}
      >
        Retry
      </button>
    </div>
  )

  renderItemDetails = () => {
    const {apiStatus} = this.state
    switch (apiStatus) {
      case apiStatusConstants.success:
        return this.renderItem()
      case apiStatusConstants.inProgress:
        return (
          <div className="loader-container" testid="loader">
            <Loader type="ThreeDots" color="#ffff" height="50" width="50" />
          </div>
        )
      case apiStatusConstants.failure:
        return this.renderJobDetailsFailure()

      default:
        return null
    }
  }

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
    const jwtToken = Cookies.get('jwt_token')
    if (jwtToken === undefined) {
      return <Redirect to="/login" />
    }
    return (
      <div className="itemHead">
        <Header />
        <div className="itemMain">{this.renderItemDetails()}</div>
      </div>
    )
  }
}

export default JobItemDetails
