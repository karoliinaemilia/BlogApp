import React from 'react'
import { Button, Segment, List } from 'semantic-ui-react'
import PropTypes from 'prop-types'

const Blog = (props) => {

  const { blog, like, currentUser, remove } = props

  if (blog === undefined) {
    return null
  }

  const deletable = blog.user === undefined || blog.user.username === currentUser.username

  const adder = blog.user ? blog.user.name : 'anonymous'

  return (
    <Segment>
      <h2>
        {blog.title} {blog.author}
      </h2>
      <List divided relaxed>
        <List.Item>
          <a href={blog.url}>{blog.url}</a>
        </List.Item>
        <List.Item>
          {blog.likes} likes <Button color='black' onClick={() => like(blog._id)}>like</Button>
        </List.Item>
        <List.Item>
          added by {adder}
        </List.Item>
        <List.Item>
          {deletable && <div><Button color='black' onClick={() =>
            remove(blog._id)}>delete</Button></div>}
        </List.Item>
      </List>
    </Segment>
  )
}

Blog.propTypes = {
  blog: PropTypes.object.isRequired,
  like: PropTypes.func.isRequired,
  remove: PropTypes.func.isRequired
}

export default Blog