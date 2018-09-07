import React from 'react'
import Notification from '../components/Notification'
import Togglable from '../components/Togglable'
import renderer from 'react-test-renderer'


const notification = {
  type: 'info',
  message: 'hello'
}

it('renders correctly', () => {
  const tree = renderer
    .create(<Notification notification={notification}/>)
    .toJSON()
  expect(tree).toMatchSnapshot()
})

it('renders correctly', () => {
  const tree = renderer
    .create(<Togglable buttonLabel={'definitely a label'}/>)
    .toJSON()
  expect(tree).toMatchSnapshot()
})