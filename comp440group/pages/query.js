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
        <Grid item sx={{ mt: 5, ml: 5, mb: 3 }}>
          <Link href="/queries/1" sx={{ textTransform: 'none' }}>
            <Typography variant="h5">
              1 - List all the blogs of user X, such that all the comments are
              positive for these blogs.
            </Typography>
          </Link>
        </Grid>
        <Grid item sx={{ ml: 5, mb: 3 }}>
          <Link href="/queries/2" sx={{ textTransform: 'none' }}>
            <Typography variant="h5">
              2 - List the users who posted the most number of comments, if
              there is a tie, list all the users who have a tie.
            </Typography>
          </Link>
        </Grid>
        <Grid item sx={{ ml: 5, mb: 3 }}>
          <Link href="/queries/3" sx={{ textTransform: 'none' }}>
            <Typography variant="h5">
              3 - List the users who are followed by both users X and Y.
              Usernames X and Y are inputs from the user.
            </Typography>
          </Link>
        </Grid>
        <Grid item sx={{ ml: 5, mb: 3 }}>
          <Link href="/queries/4" sx={{ textTransform: 'none' }}>
            <Typography variant="h5">
              4 - Display all the users who never posted a blog.
            </Typography>
          </Link>
        </Grid>
        <Grid item sx={{ ml: 5, mb: 3 }}>
          <Link href="/queries/5" sx={{ textTransform: 'none' }}>
            <Typography variant="h5">
              5 - Display those users such that all the blogs they posted so far
              never received any negative comments.
            </Typography>
          </Link>
        </Grid>
        <Grid item sx={{ ml: 5, mb: 3 }}>
          <Link href="/queries/6" sx={{ textTransform: 'none' }}>
            <Typography variant="h5">
              6 - List the (pair of) users with same hobby. In each row, you
              have to display both users as well as the common hobby.
            </Typography>
          </Link>
        </Grid>
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
