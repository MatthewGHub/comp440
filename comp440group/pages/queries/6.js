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
  const [userQuery2, setUserQuery2] = React.useState('')

  const [pairs, setPairs] = React.useState([])

  const [gotUsers, setGotUsers] = React.useState([])

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
    setUserQuery2(data.data.users[1].username)
  }, [])

  const onClick1 = async () => {
    const res = await fetch(`${process.env.NEXTAUTH_URL}/api/query/6`, {
      method: 'GET',
    })
    console.log('lolo')
    const finished = await res.json()
    console.log('hi finshed')
    console.log(finished)

    if (finished.message === 'Success!') {
      setLoading(false)
      console.log(finished.data.pairs)
      setPairs(finished.data.pairs)
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
            6 - List the (pair of) users with same hobby. In each row, you have
            to display both users as well as the common hobby.
          </Typography>
          <Button onClick={onClick1} variant="contained" sx={{ mt: 1, mb: 3 }}>
            Search
          </Button>
        </Grid>

        {pairs.map((e) => {
          return (
            <Box sx={{ width: 300 }}>
              <Grid item sx={{ border: 1, ml: 5, mb: 1 }}>
                {e.User_One} - {e.User_Two} - {e.Common_Hobby}
              </Grid>
            </Box>
          )
        })}

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
