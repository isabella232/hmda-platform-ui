import React, { Component } from 'react'
import PropTypes from 'prop-types'
import {Link} from 'react-router'
import LoadingIcon from './LoadingIcon.jsx'
import ErrorWarning from './ErrorWarning.jsx'
import RefileButton from '../containers/RefileButton.jsx'
import moment from 'moment'
import * as STATUS from '../constants/statusCodes.js'
import 'uswds'
//require('uswds')

export const renderStatus = (submissionStatus, start, end) => {
  if(!submissionStatus || !submissionStatus.code) return

  const statusCode = submissionStatus.code
  let messageClass
  let timing = null

  if(statusCode === STATUS.CREATED) {
    messageClass = 'text-secondary'
  }

  if(statusCode > STATUS.CREATED) {
    messageClass = 'text-primary'
    if(start) timing = `Started ${moment(start).utcOffset(-5).fromNow()}`
  }

  if(statusCode === STATUS.PARSED_WITH_ERRORS ||
     statusCode === STATUS.VALIDATED_WITH_ERRORS) {
       messageClass = 'text-secondary'
  }

  if(statusCode === STATUS.SIGNED) {
    messageClass = 'text-green'
    if(end) timing = `Completed ${moment(end).utcOffset(-5).format('MMMM Do')}`
  }

  // failed submission
  if(statusCode === STATUS.FAILED) {
    messageClass = 'text-secondary'
    if(start) timing = `Submission failed ${moment(start).utcOffset(-5).fromNow()}`
  }

  return (
    <div className="status">
      <p><strong className={`${messageClass} text-uppercase`}>{submissionStatus.message}</strong></p>
      <p className="timing usa-text-small">{timing}</p>
      <p className="status-desc">{submissionStatus.description}</p>
    </div>
  )
}

export const renderViewButton = (code, institutionId, period) => {
  let buttonText

  switch (code) {
    // not-started
    case 1:
      buttonText = 'Begin filing'
      break
    // in progress
    case 2:
      buttonText = 'View current filing'
      break
    // completed
    case 3:
      buttonText = 'View completed filing'
      break
    // cancelled
    case 4:
      buttonText = 'Begin filing'
      break
    default:
      buttonText = 'Begin filing'
  }

  return <Link className="status-button usa-button" to={`/${institutionId}/${period}`}>{buttonText}</Link>
}

export const renderRefileButton = (latestSubmissionStatus, filing) => {
  if(!latestSubmissionStatus) return null
  if(latestSubmissionStatus.code === STATUS.PARSED_WITH_ERRORS ||
     latestSubmissionStatus.code > STATUS.VALIDATING) {
    return <RefileButton
            id={filing.institutionId}
            filing={filing.period}
            code={latestSubmissionStatus.code}
            isLink={true}
            isSmall={true}
          />
  } else {
    return null
  }
}

export const renderPreviousSubmissions = (submissions, onDownloadClick, institutionId, period) => {
  if(!submissions.length) return
  const previousSubmissions = submissions.slice(1)
  if(!previousSubmissions.length) return
  return (
  <div className="previous-submissions">
    <ul className="usa-accordion-bordered">
      <li>
        <button className="usa-accordion-button"
      aria-expanded="false" aria-controls="submissions">Previous filings for current filing period</button>
        <div id="submissions" className="usa-accordion-content">
          <ol reversed className="usa-text-small">
            {previousSubmissions.map((submission, i) => {
              // render the end date if it was signed
              const date = (submission.status.code === STATUS.SIGNED) ? moment(submission.end).utcOffset(-5).format('MMMM Do, YYYY') : moment(submission.start).utcOffset(-5).format('MMMM Do, YYYY')

              // render a link if validted with errors
              if(submission.status.code === STATUS.VALIDATED_WITH_ERRORS) {
                return (
                  <li className="edit-report" key={i}>
                    <strong>{submission.status.message}</strong> on {date}.{'\u00a0'}
                    <a href="#"
                      onClick={(e) => {
                        e.preventDefault()
                        onDownloadClick(
                          institutionId,
                          period,
                          submission.id.sequenceNumber
                        )
                      }
                    }>Download edit report</a>
                  </li>
                )
              }

              // other statuses contain no edits
              return (
                <li className="edit-report" key={i}>
                  <strong>{submission.status.message}</strong> on {date}.
                </li>
              )
            })}
          </ol>
        </div>
      </li>
    </ul>
  </div>
  )
}

export const getInstitutionFromFiling = (institutions, filing) => {
  for(let i=0; i<institutions.length; i++){
    if(institutions[i].id === filing.institutionId) return institutions[i]
  }
  return null
}

export default class Institution extends Component {
  render() {
    const institutions = this.props.institutions
    const makeNewSubmission = this.props.makeNewSubmission
    return (
    <main id="main-content" className="usa-grid Institutions">
      {this.props.error ? <ErrorWarning error={this.props.error}/> : null}
      <div className="usa-width-one-half">
        <div className="InstitutionsHeader">
          <h1>Institutions</h1>
          {this.props.filingPeriod ? <h2>Filing Period {this.props.filingPeriod}</h2> : null}
        </div>
        {this.props.isFetching ?
          <div className="usa-grid-full">
            <LoadingIcon/>
          </div>
        : !this.props.filings ?
          <div className="usa-grid-full">
            <p>There is a problem with your filing. Please contact <a href="mailto:hmdahelp@cfpb.gov">HMDA Help</a>.</p>
          </div>
          : this.props.filings.map((filingObj, i) => {
              const filing = filingObj.filing
              const latestSubmissionStatus = filingObj.submissions[0] && filingObj.submissions[0].status || null
              const institution = getInstitutionFromFiling(institutions, filing)

              if(!institution) return
              return (
                <div key={i} className="usa-grid-full">
                  <div className="institution">
                    <div className="current-status">
                      <h3>{institution.name} - {institution.id}</h3>
                      {renderStatus(
                        latestSubmissionStatus,
                        filing.start,
                        filing.end
                      )}

                      {renderViewButton(
                        filing.status.code,
                        filing.institutionId,
                        filing.period
                      )}

                      {renderRefileButton(
                        latestSubmissionStatus,
                        filing
                      )}
                    </div>

                    {renderPreviousSubmissions(
                      filingObj.submissions,
                      this.props.onDownloadClick,
                      institution.id,
                      filing.period
                    )}
                  </div>
                </div>
              )
          })
        }

        <div className="usa-alert usa-alert-info">
          <div className="usa-alert-body">
            <p className="usa-alert-text">If you are planning to file on behalf of more than one financial institution, contact <a href="mailto:hmdahelp@cfpb.gov">hmdahelp@cfpb.gov</a></p>
          </div>
        </div>
      </div>
      <aside className="usa-width-one-half">
        <p>The Institutions page provides a summary of institutions for which you are authorized to file HMDA data. The filing status is displayed under the institution name.</p>
        <p>Select the &quot;Begin filing&quot; button to begin your HMDA filing. Your work will be saved as you progress through the various edit categories. If you need to complete the filing at a later time, logout of the HMDA Platform prior to reviewing the next category of edits. When you are ready to continue with the filing process, login and select the &quot;View Current Filing&quot; button for your institution.</p>
        <p>If you already started or submitted a HMDA filing and need to upload a new HMDA file, select the &quot;Upload a new file&quot; button. You will restart the process beginning with file format analysis. Any previously completed filings will not be overridden until all edits have been cleared and/or verified and the HMDA file has been submitted.</p>
        <p>The edit report for previous submissions can be downloaded in csv format. Please note that an edit report will not be available if the HMDA file did not have any outstanding quality edits or macro quality edits.</p>
      </aside>
    </main>
    )
  }
}

Institution.propTypes = {
  params: PropTypes.object,
  filings: PropTypes.array,
  institutions: PropTypes.array,
  makeNewSubmission: PropTypes.func,
  onDownloadClick: PropTypes.func
}
