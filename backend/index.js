const express = require('express')
const connectMongoose = require('./db.js')

connectMongoose();

const app = express()
const port = 5000

app.use(express.json());
//AVAILBLE ROUTES

const auth = require('./routes/auth.js')
const notes = require('./routes/notes')

app.use('/api/auth', auth)
app.use('/api/notes', notes)
// app.use('/api/notes', notes)




app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})