import { Request, Response } from 'express'
import { OK, NOT_FOUND, BAD_REQUEST } from 'http-status-codes'

import { Course } from '@models/course.model'

export class CourseController{

	createCourse = async (req: Request, res: Response) => {
		try{
			// First, we collect all of the submitted data
			let { 
				name,
				department,
				courseCode,
				sections
			} = req.body

			let course = new Course({
				name,
				department,
				courseCode,
				sections,
				createdBy: res.locals.currentUser
			})

			course = await course.save()

			return res.status(OK).json({ data: res.locals.currentUser, message: `Successfully created course.` })
		}catch(err){
			console.error(err);
			return res.status(BAD_REQUEST).json({ error: err, message: `Failed to create course.` })
		}
	}

	getCourses = async (req: Request, res: Response) => {
		try{
			// First, we collect all of the submitted data
			let courses = await Course.find({ createdBy: res.locals.currentUser._id })

			return res.status(OK).json({ data: courses, message: `Successfully fetched courses.` })
		}catch(err){
			console.error(err);
			return res.status(BAD_REQUEST).json({ error: err, message: `Failed to fetch courses.` })
		}
	}

	getCourse = async (req: Request, res: Response) => {
		try{
			const courseID = req.params.courseID

			if(!courseID) return res.status(NOT_FOUND).json({ message: 'No courseID specified.' }).end()

			const course = await Course.findOne({ _id: courseID })

			if(course) return res.status(OK).json({ data: course, message: `Successfully fetched course.` })
			else res.status(NOT_FOUND).json({ message: 'Failed to find specified course.' })
		}catch(err){
			console.error(err);
			return res.status(BAD_REQUEST).json({ error: err, message: `Failed to fetch courses.` })
		}
	}


}