const express=require("express");
const connectToMongo= require("./db");
var cors = require('cors')
const app = express()
const port = 5000

connectToMongo();
app.use(cors())

app.use(express.json())

//Available Routes
app.use('/api/auth',require('./routes/Auth'))
// app.use('/api/post',require('./routes/Post'))
app.use('/api/notes',require('./routes/Notes'))
// app.use(require('./routes/User'))
app.listen(port, () => {
  console.log(`EchelonAlumniApp 2.0 app listening at http://localhost:${port}/ `)
})