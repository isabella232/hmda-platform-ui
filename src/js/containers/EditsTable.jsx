import React from 'react'

import EditsTableRow from '../components/EditsTableRow.jsx'

const rowForEachLarTypes = ['synactical', 'validity', 'quality']

const rowForEachLar = (val) => rowForEachLarTypes.indexOf(val) !== -1

const renderHeader = (props) => {
  let row = props.data[0]
  if (rowForEachLar(props)) row = row.lar

  return (
    <tr>
      {
        Object.keys(row).map((header, i) => {
          return <td className="table-header" key={i}>{header}</td>
        })
      }
    </tr>
  )
}

const renderBody = (props) => {
  return props.data.map((row, i) => {
    if(row.lar) row = row.lar
    return <EditsTableRow row={row} key={i}/>
  })
}

const EditsTable = (props) => {
  if(!props.data || !props.data.length){
    return (
      <div className="EditsGrouped">
        <h4><span className="cf-icon cf-icon-approved"></span>No edits found</h4>
      </div>
    )
  }

  return (
    <div className="EditsTable">
      {props.label ? props.label : null}
      <table width="100%">
        <thead>
          {renderHeader(props)}
        </thead>
        <tbody>
          {renderBody(props)}
        </tbody>
      </table>
    </div>
  )
}

export default EditsTable
