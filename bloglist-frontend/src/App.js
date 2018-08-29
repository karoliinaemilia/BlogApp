import React from 'react'
import BlogForm from './components/BlogForm'
import Notification from './components/Notification'
import Blog from './components/Blog'
import Togglable from './components/Togglable'
import blogService from './services/blogs'
import loginService from './services/login'
import userService from './services/users'
import { BrowserRouter as Router, Route, Link } from 'react-router-dom'
import { Table, Container, Form, Button, Grid, Header, Menu, Loader, List, Segment } from 'semantic-ui-react'

const User = ({ user }) => {
  if (user === undefined) {
    return <Loader active inline='centered'/>
  }
  return (
    <Segment >
      <h2>{user.name}</h2>
      <h3>Added blogs</h3>
      <List as='ul'>
        {user.blogs.map(blog =>
          <List.Item as='li' key={blog._id}>{blog.title} by {blog.author}</List.Item>)}
      </List>
    </Segment>
  )
}

const Users = ({ users }) => {
  return (
    <div>
      <h2>Users</h2>
      <Table>
        <Table.Header>
          <Table.Row>
            <Table.HeaderCell></Table.HeaderCell>
            <Table.HeaderCell>blogs added</Table.HeaderCell>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {users.map(user =>
            <Table.Row key={user._id}>
              <Table.Cell>
                <Link to={`/users/${user._id}`}>{user.name}</Link>
              </Table.Cell>
              <Table.Cell>{user.blogs.length}</Table.Cell>
            </Table.Row>)}
        </Table.Body>
      </Table>
    </div>
  )
}

class App extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      blogs: [],
      users: [],
      user: null,
      username: '',
      password: '',
      title: '',
      author: '',
      url: '',
      notification: null
    }
  }

  componentWillMount() {
    blogService.getAll().then(blogs =>
      this.setState({ blogs })
    )
    userService.getAll().then(users =>
      this.setState({ users }))
    const loggedUserJSON = window.localStorage.getItem('loggedBlogAppUser')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      this.setState({ user })
      blogService.setToken(user.token)
    }
  }

  notify = (message, type = 'info') => {
    this.setState({
      notification: {
        message, type
      }
    })
    setTimeout(() => {
      this.setState({
        notification: null
      })
    }, 10000)
  }

  like = (id) => {
    const liked = this.state.blogs.find(b=>b._id===id)
    const updated = { ...liked, likes: liked.likes + 1 }
    blogService.update(id, updated)
    this.notify(`you liked '${updated.title}' by ${updated.author}`)
    this.setState({
      blogs: this.state.blogs.map(b => b._id === id ? updated : b)
    })
  }

  remove = (id) => {
    const deleted = this.state.blogs.find(b => b._id === id)
    const ok = window.confirm(`remove blog '${deleted.title}' by ${deleted.author}?`)
    if ( ok===false) {
      return
    }

    blogService.remove(id)
    this.notify(`blog '${deleted.title}' by ${deleted.author} removed`)
    this.setState({
      blogs: this.state.blogs.filter(b=>b._id!==id)
    })
  }

  addBlog = async (event) => {
    event.preventDefault()
    const blog = {
      title: this.state.title,
      author: this.state.author,
      url: this.state.url,
    }

    const result = await blogService.create(blog)
    this.notify(`blog '${blog.title}' by ${blog.author} added`)
    this.setState({
      title: '',
      url: '',
      author: '',
      blogs: this.state.blogs.concat(result)
    })
  }

  logout = () => {
    window.localStorage.removeItem('loggedBlogAppUser')
    this.notify('logged out')
    this.setState({ user: null })
  }

  login = async (event) => {
    event.preventDefault()
    try {
      const user = await loginService.login({
        username: this.state.username,
        password: this.state.password
      })

      window.localStorage.setItem('loggedBlogAppUser', JSON.stringify(user))
      blogService.setToken(user.token)
      this.notify('welcome back!')
      this.setState({ username: '', password: '', user })
    } catch (exception) {
      this.notify('käyttäjätunnus tai salasana virheellinen', 'error')
      setTimeout(() => {
        this.setState({ error: null })
      }, 5000)
    }
  }

  handleLoginChange = (event) => {
    this.setState({ [event.target.name]: event.target.value })
  }

  userById = (id) => this.state.users.find(u => u._id === id)

  blogById = (id) =>  this.state.blogs.find(b => b._id === id)

  render() {
    if (this.state.user === null) {
      return (
        <div>
          <Notification notification={this.state.notification} />
          <br/>
          <br/>
          <Grid textAlign='center' style={{ height: '100%' }} >
            <Grid.Column style={{ maxWidth: 400 }}>
              <Header as='h2' textAlign='center'>
               Kirjaudu sovellukseen
              </Header>
              <Form onSubmit={this.login}>
                <Segment>
                  <Form.Input fluid icon='user' iconPosition='left' placeholder='Username' type="text"
                    name="username"
                    value={this.state.username}
                    onChange={this.handleLoginChange}/>
                  <Form.Input fluid icon='lock' iconPosition='left' placeholder='Password' type="password"
                    name="password"
                    value={this.state.password}
                    onChange={this.handleLoginChange}
                  />
                  <Button color="black" fluid type="submit">kirjaudu</Button>
                </Segment>
              </Form>
            </Grid.Column>
          </Grid>
        </div>
      )
    }

    const byLikes = (b1, b2) => b2.likes - b1.likes

    const blogsInOrder = this.state.blogs.sort(byLikes)

    return (
      <Container>
        <Notification notification={this.state.notification} />

        <Router >
          <div>
            <Menu  inverted>
              <Menu.Item  link>
                <Link style={{ color: 'white' }} to='/'>blogs</Link> &nbsp;
              </Menu.Item>
              <Menu.Item link>
                <Link style={{ color: 'white' }}to='/users'>users</Link> &nbsp;
              </Menu.Item>
              <Menu.Item style={{ color: 'white' }}position='right'>
                {this.state.user.name} logged in &nbsp; <Button style={{ color: 'black' }} onClick={this.logout}>logout</Button>
              </Menu.Item>
            </Menu>
            <Route exact path='/' render={() =>
              <div>
                <h2>Blogs</h2>
                <List>
                  {blogsInOrder.map(blog =>
                    <List.Item key={blog._id}>
                      <Link to={`/blogs/${blog._id}`}>{blog.title} {blog.author}</Link>
                    </List.Item>
                  )}
                </List>
              </div>
            }/>
            <Route exact path='/users' render={() =>
              <div>
                <Users users={this.state.users}/>
              </div>
            }/>
            <Route path='/users/:id' render={
              ({ match }) =>
                <User user={this.userById(match.params.id)}/>
            }/>
            <Route path='/blogs/:id' render={
              ({ match }) =>
                <Blog blog={this.blogById(match.params.id)}
                  like={this.like}
                  remove={this.remove}
                  currentUser={this.state.user}
                />
            }/>
            <br/>
            <Togglable buttonLabel='uusi blogi'>
              <BlogForm
                handleChange={this.handleLoginChange}
                title={this.state.title}
                author={this.state.author}
                url={this.state.url}
                handleSubmit={this.addBlog}
              />
            </Togglable>
          </div>
        </Router>
      </Container>
    )
  }
}

export default App