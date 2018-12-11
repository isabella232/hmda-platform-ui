import { connect } from 'react-redux'
import Upload from './index.jsx'
import handleFile from '../../actions/handleFile.js'
import pollForProgress from '../../actions/pollForProgress.js'

export function mapStateToProps(state) {
  const lei = state.app.lei
  const code = state.app.submission.status.code
  const filename = state.app.submission.filename

  const { uploading, file, errors, errorFile, errorUpload } =
    state.app.upload[lei] || state.app.upload['__DEFAULT_UPLOAD__']

  const errorApp = state.app.error

  return {
    code,
    errorApp,
    errorFile,
    errors,
    errorUpload,
    file,
    filename,
    lei,
    uploading
  }
}

export function mapDispatchToProps(dispatch) {
  return {
    handleDrop(acceptedFiles, code, error) {
      if (!acceptedFiles) return
      dispatch(handleFile(acceptedFiles[0], code, error))
    },
    pollSubmission() {
      dispatch(pollForProgress())
    }
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Upload)
