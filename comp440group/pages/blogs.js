import { getSession, signOut, useSession } from 'next-auth/client'
import React from 'react'
import { Grid, Button, Typography, Box, TextField } from '@mui/material'
import { useTheme } from '@mui/material/styles'
// import excuteQuery from '../lib/db.js'
import CircularProgress from '@mui/material/CircularProgress'
import Alert from '@mui/material/Alert'
import Link from '@mui/material/Link'
const axios = require('axios')
import Divider from '@mui/material/Divider'
import Radio from '@mui/material/Radio'
import RadioGroup from '@mui/material/RadioGroup'
import FormControlLabel from '@mui/material/FormControlLabel'
import FormControl from '@mui/material/FormControl'
import FormLabel from '@mui/material/FormLabel'

function Homepage({ data, user }) {
  const theme = useTheme()
  // const { data: session, status } = useSession()

  const [goodAlert, setGoodAlert] = React.useState('')
  const [badAlert, setBadAlert] = React.useState('')
  const [loading, setLoading] = React.useState('')
  const [disableButton, setDisableButton] = React.useState(false)
  const [user23, setUser23] = React.useState({})
  const [data23, setData23] = React.useState([])
  const [comments23, setComments23] = React.useState([])

  React.useState(() => {
    let user1 = user
    let data1 = []
    if (data) {
      console.log('DATA')
      data1 = data.blogs
    }
    data1.map((e) => {
      e.showDescription = false
      e.showComment = false
      e.comment = ''
      e.sentiment = ''
    })
    setUser23(user1)
    setData23(data1)
    setComments23(data.comments)
  }, [])

  const onClick = async (e) => {
    const sentiment = e.sentiment
    const description = e.comment
    const blogid = e.blogid
    const posted_by = user.username
    const body = {
      sentiment,
      description,
      blogid,
      posted_by,
    }
    setDisableButton(true)
    setLoading(true)
    const res = await fetch(`${process.env.NEXTAUTH_URL}/api/createComment`, {
      method: 'POST',
      body: JSON.stringify(body),
    })

    const finished = await res.json()
    console.log('hi finshed')
    console.log(finished)

    if (finished.message === 'Success!') {
      setLoading(false)
      setDisableButton(false)
      setGoodAlert(true)
      await new Promise(() => {
        setTimeout(() => {
          setGoodAlert(false)
        }, 3500)
      })
    } else {
      setLoading(false)
      setDisableButton(false)
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
      {!user23 && (
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
      {user23 && (
        <Grid
          container
          direction="row"
          justifyContent="center"
          alignItems="center"
          style={{ paddingBottom: '2.5rem' }}
        >
          <Grid item sx={{ marginLeft: 'auto', marginTop: 2, marginRight: 2 }}>
            <Link href="/createblog">
              <Button variant="contained">Create Blog</Button>
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
        alignItems="center"
        style={{ paddingBottom: '2.5rem' }}
      >
        <Grid item>
          <h1>Blogs </h1>
        </Grid>
        {data23.map((e, i) => {
          return (
            <Grid item key={i} sx={{ m: 1 }}>
              <Box sx={{ width: 700, border: 1 }}>
                <Grid
                  item
                  onClick={() => {
                    const newState = data23.map((obj, l) => {
                      if (obj.blogid === e.blogid) {
                        return {
                          ...obj,
                          showDescription: !e.showDescription,
                          showComment: false,
                        }
                      }
                      return obj
                    })
                    setData23(newState)
                  }}
                >
                  <Typography variant="h4" color="mediumseagreen" sx={{ m: 1 }}>
                    {e.subject}
                  </Typography>
                  <Typography variant="body1" color="tomato" sx={{ m: 1 }}>
                    {e.created_by}
                  </Typography>
                </Grid>
                {e.showDescription && (
                  <>
                    <Divider flexItem sx={{ my: 1 }} />

                    <Typography
                      variant="h6"
                      sx={{ textOverflow: 'ellipsis', m: 1 }}
                    >
                      {e.description}
                    </Typography>
                    <Button
                      sx={{ ml: 2, mb: 2, mt: 2 }}
                      variant="outlined"
                      onClick={() => {
                        const newState = data23.map((obj, l) => {
                          if (obj.blogid === e.blogid) {
                            return { ...obj, showComment: !e.showComment }
                          }
                          return obj
                        })
                        setData23(newState)
                      }}
                    >
                      Comment
                    </Button>
                  </>
                )}
                {e.showComment && (
                  <>
                    <Grid container direction="row">
                      <Grid item>
                        <Box sx={{ width: 300, ml: 3, mb: 3 }}>
                          <FormControl
                            // onClick={(e) => console.log(e.target.value)}
                            onChange={(p) => {
                              const newState = data23.map((obj, l) => {
                                if (obj.blogid === e.blogid) {
                                  return { ...obj, sentiment: p.target.value }
                                }
                                return obj
                              })
                              setData23(newState)
                            }}
                          >
                            <FormLabel id="demo-row-radio-buttons-group-label">
                              Setiment
                            </FormLabel>
                            <RadioGroup
                              row
                              aria-labelledby="demo-row-radio-buttons-group-label"
                              name="row-radio-buttons-group"
                            >
                              <FormControlLabel
                                value="negative"
                                control={<Radio />}
                                label="Negative"
                              />
                              <FormControlLabel
                                value="positive"
                                control={<Radio />}
                                label="Positive"
                              />
                            </RadioGroup>
                          </FormControl>
                        </Box>
                      </Grid>
                    </Grid>
                    <Grid container direction="row">
                      <Box sx={{ width: 600, ml: 3, mb: 3 }}>
                        <TextField
                          fullWidth
                          multiline
                          rows={2}
                          defaultValue={e.comment}
                          // onChange={(e) =>
                          //   setNewBlogStuff((prevState) => ({
                          //     ...prevState,
                          //     description: e.target.value,
                          //   }))
                          // }
                          onChange={(p) => {
                            const newState = data23.map((obj, l) => {
                              if (obj.blogid === e.blogid) {
                                return { ...obj, comment: p.target.value }
                              }
                              return obj
                            })
                            setData23(newState)
                          }}
                        />
                      </Box>
                    </Grid>
                    <Grid
                      container
                      direction="row"
                      alignItems="center"
                      justifyContent="center"
                    >
                      <Button
                        variant="contained"
                        color="warning"
                        sx={{ mb: 2 }}
                        disabled={e.comment === '' || e.setiment === ''}
                        onClick={() => onClick(e)}
                      >
                        Submit Comment
                      </Button>
                    </Grid>
                    <Typography variant="h4" sx={{ ml: 3 }}>
                      Comments
                    </Typography>
                    {comments23.map((obj, k) => {
                      if (obj.blogid === e.blogid) {
                        return (
                          <Box sx={{ width: 600, ml: 3, mb: 3, border: 1 }}>
                            <Typography sx={{ m: 2 }} variant="h6">
                              {obj.description}
                            </Typography>
                            <Typography
                              sx={{ m: 2 }}
                              color="blueviolet"
                              variant="body2"
                            >
                              {obj.posted_by}
                            </Typography>
                          </Box>
                        )
                      }
                    })}
                  </>
                )}
              </Box>
            </Grid>
          )
        })}
      </Grid>

      <Grid
        container
        direction="column"
        justifyContent="flex-start"
        alignItems="center"
      >
        {loading && (
          <Grid item sx={{ mt: 1 }}>
            <CircularProgress />
          </Grid>
        )}

        {badAlert && (
          <Grid sx={{ m: 1 }} item>
            <Alert severity="error">There was an error!</Alert>
          </Grid>
        )}
        {goodAlert && (
          <Grid sx={{ m: 1 }} item>
            <Alert severity="success">DB initiated!</Alert>
          </Grid>
        )}
      </Grid>
    </>
  )
}

export default Homepage

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
  console.log(session)

  let data
  const res = await axios
    .get('http://localhost:3000/api/getBlogs')
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

  return {
    props: {
      user: session.user,
      data: data.data,
    },
  }
}
