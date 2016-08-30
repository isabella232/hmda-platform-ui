jest.dontMock('../src/js/components/UserHeading.jsx');

import UserHeading from '../src/js/components/UserHeading.jsx'
import React from 'react'
import ReactDOM from 'react-dom'
import TestUtils from 'react-addons-test-utils'

const user = 'User1'
const institution = "Wacky data";
const period = '2017';

describe('UserHeading', function() {
  describe('render without institution', function() {

    //var headingComponent = <Wrapper><UserHeading userName={user} period={period}/></Wrapper>
    const heading = TestUtils.renderIntoDocument(
      <UserHeading userName={user} period={period}/>
    )
    const headingNode = ReactDOM.findDOMNode(heading)

    it('renders the component', function(){
      expect(headingNode).toBeDefined();
    })

    it('passes through the user appropriately as props', function(){
      expect(heading.props.children.props.userName).toEqual(user);
    })

    it('renders correctly', function(){
      expect(headingNode.textContent).toEqual('Welcome to the 2017 HMDA filing, User1');
    })
  })

  /*describe('render with institution', function() {

    var headingComponent = <UserHeading institution={institution} userName={user} period={period} />

    var heading = TestUtils.renderIntoDocument(headingComponent);
    var headingNode = ReactDOM.findDOMNode(heading);

    it('renders the component', function(){
      expect(headingNode).toBeDefined();
    });

    it('passes through the institution appropriately as props', function(){
      expect(heading.props.institution).toEqual("Wacky data");
    });

    it('renders correctly', function(){
      expect(headingNode.textContent).toEqual('User1 filing on behalf of Wacky data');
    });
  });*/
});
