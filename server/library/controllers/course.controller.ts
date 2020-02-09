import { Request, Response } from 'express'
import { OK, NOT_FOUND, BAD_REQUEST } from 'http-status-codes'

import { Course } from '@models/course'

export class CourseController{

	createCourse = async (req: Request, res: Response) => {
		try{
			// First, we collect all of the submitted data
			let { 
				name,
				department,
				courseCode,
			} = req.body

			let course = new Course({
				name,
				department,
				courseCode,
			})

			course = await res.locals.repo(Course).save(course)

			return req.ok(`Successfully created course.`, course)
		}catch(err){
			return req.error(`Failed to create course.`, err)
		}
	}

	getCourses = async (req: Request, res: Response) => {
		try{
			// First, we collect all of the submitted data
			let courses = await res.locals.repo(Course).find({ })

			return req.ok(`Successfully fetched courses.`, courses)
		}catch(err){
			return req.error(`Failed to fetch courses.`, err)
		}
	}

	getCourse = async (req: Request, res: Response) => {
		try{
			const courseID = req.params.courseID

			if(!courseID) return res.status(NOT_FOUND).json({ message: 'No courseID specified.' }).end()

			const course = await res.locals.repo(Course).findOne({ id: courseID })

			if(course) return req.ok(`Successfully fetched course.`, course)
			else return req.notFound(`Failed to find specified course.`)
		}catch(err){
			return req.error(`Failed to fetch course.`, err)
		}
	}


}