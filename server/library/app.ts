import * as express from 'express'

const port = 3000

var app = express()

app.get("/", (req, res) => res.send("Hello World"))

app.listen(port, () => console.log(`Dynamic Recitation backend listening on port ${port}!`))