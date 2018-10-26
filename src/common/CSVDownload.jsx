import React from 'react'
import Loading from './Loading.jsx'

import './CSVDownload.css'

const CSVDownload = props => {
  if (props.submission.id === null) return null
  const { institutionId, period, sequenceNumber } = props.submission.id

  return (
    <React.Fragment>
      <button
        className="CSVDownload"
        onClick={props.onDownloadClick(institutionId, period, sequenceNumber)}
      >
        {props.text || 'download the edit report.'}
      </button>
      {props.isFetching ? <Loading className="LoadingInline" /> : null}
    </React.Fragment>
  )
}

export default CSVDownload
