import * as reflectMetadata from "reflect-metadata";

import * as express from 'express'
import * as dotenv from 'dotenv'
import * as bodyParser from 'body-parser'
import * as jwt from 'jsonwebtoken'

import { registerUserRoutes } from '@routes/user.routes'
import { registerCourseRoutes } from '@routes/course.routes'
import { registerSectionRoutes } from '@routes/section.routes'
import { registerMeetingTimeRoutes } from '@routes/meetingTime.routes'

import { createConnection, getRepository, getConnection } from 'typeorm';

import { User } from '@models/user';

class AppWrapper {
	port: number = 3000
	app = null
	connection = null

	constructor() {
		this.init().then(() => {
			console.log("App initialization finished!")
		})
	}

	async init() {
		await this.initDB()
		await this.initExpress()
		await this.initJWTParser()
		await this.initAccessControl()
		await this.registerRoutes()
		await this.listen()
	}

	async listen() {
		this.app.listen(this.port, () => console.log(`Dynamic Recitation backend listening on port ${this.port}!`))
	}

	async initAccessControl() { 
		this.app.use(function (req, res, next) {
			res.setHeader('Access-Control-Allow-Origin', '*');
			res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
			res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
			res.setHeader('Access-Control-Allow-Credentials', true);
			next();
		});
	}

	async registerRoutes() {
		this.app.get("/", (req, res) => res.send("Hello World"))

		registerUserRoutes(this.app)
		registerCourseRoutes(this.app)
		registerSectionRoutes(this.app)
		registerMeetingTimeRoutes(this.app)
	}

	async initJWTParser() {
		this.app.use(async function (req, res, next) {
			const headers = req.headers

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
						res.locals.currentUser = await res.locals.repo(User).findOne({ id: decoded.userid })
					}
				}
			}
			next();
		})
	}

	async initDB() {
		this.connection = await createConnection()
	}

	async initExpress() {
		this.app = express()
		this.app.use(bodyParser.urlencoded({ extended: false }));
		this.app.use(bodyParser.json());
		this.app.use(async function (req, res, next) {
			res.locals.repo = (entity) => {
				return getConnection().getRepository(entity)
			}
			next();
		})
	}

}

dotenv.config()
const app = new AppWrapper()