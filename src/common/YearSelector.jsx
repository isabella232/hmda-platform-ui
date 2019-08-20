import React from 'react'
import { FILING_PERIODS } from '../constants/dates.js'

import './YearSelector.css'

const SORTED_PERIODS = Object.keys(FILING_PERIODS).sort((a,b) => b-a)

const YearSelector = props => {

  const currentYear = props.filingPeriod
  return (
    <div className="YearSelector">
      <h4>Select a filing period</h4>
      {SORTED_PERIODS.map((year, i) => {
        const className = year === currentYear ? 'active' : ''
        return (
          <a href={props.pathname.replace(currentYear, year)} className={className} key={i}>
            {year}
          </a>
        )
      })}
    </div>
  )
}

export default YearSelector