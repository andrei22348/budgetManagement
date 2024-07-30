const express = require('express')
const app = express()
const cors = require('cors');
const cookieParser = require('cookie-parser')
const { PORT, CLIENT_URL } = require('./constants')
const passport = require('passport')

require('./middlewares/passport-midleware');

app.use(express.json())
app.use(cors({ origin: CLIENT_URL, credentials: true }))
app.use(passport.initialize())
app.use(cookieParser())

const routes = require('./routes/routes')

app.use('/api', routes)

const appStart = () => {
  try {
    app.listen(PORT, () => {
      console.log(`The app is running at http://localhost:${PORT}`)
    })
  } catch (error) {
    console.log(`Error: ${error.message}`)
  }
}

appStart()