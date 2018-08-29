import React from 'react'
import PropTypes from 'prop-types'
import { Form, Button } from 'semantic-ui-react'

const BlogForm = ({ title, author, url, handleChange, handleSubmit }) => {
  return (
    <div>
      <h2>Luo uusi blogi</h2>

      <Form onSubmit={handleSubmit}>
        <Form.Field>
          <label>title</label>
          <input
            value={title}
            name='title'
            onChange={handleChange}
          />
        </Form.Field>
        <Form.Field>
          <label>author</label>
          <input
            value={author}
            name='author'
            onChange={handleChange}
          />
        </Form.Field>
        <Form.Field>
          <label>url</label>
          <input
            value={url}
            name='url'
            onChange={handleChange}
          />
        </Form.Field>        
        <Button color='black' type="submit">Luo</Button>
      </Form>
    </div>
  )
}

BlogForm.propTypes = {
  handleSubmit: PropTypes.func.isRequired,
  handleChange: PropTypes.func.isRequired,
  author: PropTypes.string,
  title: PropTypes.string.isRequired,
  url: PropTypes.string.isRequired
}


export default BlogForm