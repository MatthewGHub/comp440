import { getSession, signOut, useSession } from 'next-auth/client'
import React from 'react'
import { Grid, Button, Typography } from '@mui/material'
import { useTheme } from '@mui/material/styles'
// import excuteQuery from '../lib/db.js'
import CircularProgress from '@mui/material/CircularProgress'
import Alert from '@mui/material/Alert'
import Link from '@mui/material/Link'
import Box from '@mui/material/Box'
import TextField from '@mui/material/TextField'
import { useRouter } from 'next/router'
const axios = require('axios')
import InputLabel from '@mui/material/InputLabel'
import MenuItem from '@mui/material/MenuItem'
import FormControl from '@mui/material/FormControl'
import Select from '@mui/material/Select'

function Query({ user }) {
  const [users, setUsers] = React.useState([])
  const [userQuery1, setUserQuery1] = React.useState('')
  const [blogs, setBlogs] = React.useState([])
  const [comments, setComments] = React.useState([])

  const [goodAlert, setGoodAlert] = React.useState('')
  const [badAlert, setBadAlert] = React.useState('')
  const [loading, setLoading] = React.useState('')

  React.useEffect(async () => {
    // GET ALL USERS
    let data
    const res = await axios
      .get('http://localhost:3000/api/getUsers')
      .then(function (response) {
        // handle success
        data = response.data
      })
      .catch(function (error) {
        // handle error
        // console.log(error)
      })
      .finally(function () {
        // always executed
      })
    console.log(data)
    setUsers(data.data.users)
    setUserQuery1(data.data.users[0].username)
  }, [])

  const onClick1 = async () => {
    const res = await fetch(`${process.env.NEXTAUTH_URL}/api/query/1`, {
      method: 'POST',
      body: JSON.stringify(userQuery1),
    })

    const finished = await res.json()
    console.log('hi finshed')
    console.log(finished)

    if (finished.message === 'Success!') {
      setLoading(false)
      setBlogs(finished.data.blogs)
    } else {
      setLoading(false)
      setBadAlert(true)
      await new Promise(() => {
        setTimeout(() => {
          setBadAlert(false)
        }, 3500)
      })
    }
  }

  return (
    <>
      {!user && (
        <Grid
          container
          direction="row"
          justifyContent="center"
          alignItems="center"
          style={{ paddingBottom: '2.5rem' }}
        >
          <Grid item sx={{ marginLeft: 'auto', marginTop: 2, marginRight: 2 }}>
            <Link href="/login">
              <Button variant="contained">Sign In</Button>
            </Link>
          </Grid>
          <Grid item sx={{ marginTop: 2, marginRight: 2 }}>
            <Link href="/register">
              <Button variant="contained">Register</Button>
            </Link>
          </Grid>
        </Grid>
      )}
      {user && (
        <Grid
          container
          direction="row"
          justifyContent="center"
          alignItems="center"
          style={{ paddingBottom: '2.5rem' }}
        >
          <Grid item sx={{ ml: 'auto', marginTop: 2, marginRight: 2 }}>
            <Link href="/query">
              <Button variant="contained">Query</Button>
            </Link>
          </Grid>
          <Grid item sx={{ marginTop: 2, marginRight: 2 }}>
            <Link href="/createblog">
              <Button variant="contained">Create Blog</Button>
            </Link>
          </Grid>
          <Grid item sx={{ marginTop: 2, marginRight: 2 }}>
            <Link href="/blogs">
              <Button variant="contained">Blogs</Button>
            </Link>
          </Grid>

          <Grid item sx={{ marginTop: 2, marginRight: 2 }}>
            <Button
              variant="contained"
              onClick={() =>
                signOut({
                  callbackUrl: `${process.env.NEXTAUTH_URL}`,
                })
              }
            >
              Sign out
            </Button>
          </Grid>
        </Grid>
      )}
      <Grid
        container
        direction="column"
        justifyContent="center"
        alignItems="flex-start"
      >
        <Grid item sx={{ mt: 5, ml: 5, mb: 2 }}>
          <Typography variant="h5">
            - List all the blogs of user X, such that all the comments are
            positive for these blogs.
          </Typography>
          <Box sx={{ minWidth: 120, mt: 1 }}>
            <FormControl fullWidth>
              <InputLabel id="demo-simple-select-label">User</InputLabel>
              <Select
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                value={userQuery1}
                label="User"
                onChange={(e) => {
                  setUserQuery1(e.target.value)
                }}
              >
                {users &&
                  users.map((e, i) => {
                    return (
                      <MenuItem key={i} value={e.username}>
                        {e.username}
                      </MenuItem>
                    )
                  })}
              </Select>
            </FormControl>
          </Box>
          <Button onClick={onClick1} variant="contained" sx={{ mt: 1 }}>
            Search
          </Button>
        </Grid>
        {blogs.length > 0 && (
          <>
            {blogs.map((e) => {
              return (
                <Box sx={{ width: 600 }}>
                  <Grid sx={{ border: 1, m: 3 }}>
                    <Grid item sx={{ border: 1 }}>
                      <Typography variant="h6" sx={{ borderBottom: 1 }}>
                        SUBJECT
                      </Typography>
                      <Typography>{e.subject}</Typography>
                    </Grid>
                    <Grid item sx={{ border: 1 }}>
                      <Typography variant="h6" sx={{ borderBottom: 1 }}>
                        DESCRIPTION
                      </Typography>
                      <Typography>{e.description}</Typography>
                    </Grid>
                  </Grid>
                </Box>
              )
            })}
          </>
        )}
        {loading && (
          <Grid item sx={{ mt: 1 }}>
            <CircularProgress />
          </Grid>
        )}

        {badAlert && (
          <Grid sx={{ m: 1 }} item>
            <Alert severity="error">Something went wrong!</Alert>
          </Grid>
        )}
      </Grid>
    </>
  )
}

export async function getServerSideProps(context) {
  const session = await getSession({ req: context.req })

  if (!session) {
    return {
      redirect: {
        destination: '/',
        permanent: false,
      },
    }
  }

  return {
    props: { user: JSON.stringify(session.user) },
  }
}

export default Query
