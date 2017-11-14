jest.mock('../../src/js/api/api')
jest.unmock('../../src/js/actions/fetchSummary.js')
jest.unmock('../../src/js/constants')
import * as types from '../../src/js/constants'
import fetchSummary from '../../src/js/actions/fetchSummary.js'

import configureMockStore from 'redux-mock-store'
import thunk from 'redux-thunk'
import { getSummary } from '../../src/js/api/api.js'

getSummary.mockImplementation(id => Promise.resolve({ respondent: 1, file: 2 }))
const mockStore = configureMockStore([thunk])

describe('fetchSummary', () => {
  it('creates a thunk that will fetch summary', done => {
    const store = mockStore({})

    store
      .dispatch(fetchSummary())
      .then(() => {
        expect(store.getActions()).toEqual([
          { type: types.REQUEST_SUMMARY },
          {
            type: types.RECEIVE_SUMMARY,
            respondent: 1,
            file: 2
          }
        ])
        done()
      })
      .catch(err => {
        console.log(err)
        done.fail()
      })
  })
  it('handles errors when introduced', done => {
    const store = mockStore({})
    console.error = jest.fn()
    getSummary.mockImplementation(id =>
      Promise.resolve({ status: 404, statusText: 'argle' })
    )

    store
      .dispatch(fetchSummary())
      .then(() => {
        expect(store.getActions()).toEqual([
          { type: types.REQUEST_SUMMARY },
          {
            type: types.RECEIVE_ERROR,
            error: { status: 404, statusText: 'argle' }
          }
        ])
        done()
      })
      .catch(err => {
        console.log(err)
        done.fail()
      })
  })
})
