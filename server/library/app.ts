import * as express from 'express'

import { registerUserRoutes } from '@routes/user.routes'

const port = 3000

var app = express()

app.get("/", (req, res) => res.send("Hello World"))

registerUserRoutes(app)

app.listen(port, () => console.log(`Dynamic Recitation backend listening on port ${port}!`))