import * as express from 'express'
import * as dotenv from 'dotenv'
import * as bodyParser from 'body-parser'
import * as mongoose from 'mongoose'
import * as jwt from 'jsonwebtoken'

import { registerUserRoutes } from '@routes/user.routes'

import { User } from '@models/user.model'

dotenv.config()

const port = 3000

var app = express()

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

mongoose.connect(process.env.MONGO_URI, {
	useNewUrlParser: true,
	useUnifiedTopology: true
})

app.use(async function (req, res, next) {
	const headers = req.headers

	// 
	if(headers && headers.authorization){
		const auth = headers.authorization;

		// The user passed us authorization headers
		// The typical format for this header is: Bearer token
		// thus, we will split the token to remove the "Bearer " string, and assuming there is a right piece,
		// grab out just the token
		let parts = auth.split("Bearer ")

		if(parts.length == 2){
			const token = parts[1]
			// now we decode the token!
			const decoded = jwt.verify(token, process.env.JWT_SECRET)
			if(decoded && decoded.userid){
				res.locals.currentUser = await User.findOne({ _id: decoded.userid })
			}
		}
	}
	next();
})


app.use(function (req, res, next) {
	res.setHeader('Access-Control-Allow-Origin', '*');
	res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
	res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
	res.setHeader('Access-Control-Allow-Credentials', true);
	next();
});

app.get("/", (req, res) => res.send("Hello World"))

registerUserRoutes(app)

app.listen(port, () => console.log(`Dynamic Recitation backend listening on port ${port}!`))