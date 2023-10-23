const express=require("express");
const connectToMongo= require("./db");

const app = express()
const port = 5000

connectToMongo();
app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.listen(port, () => {
  console.log(`EchelonAlumniApp 2.0 app listening at http://localhost:${port}/ `)
})