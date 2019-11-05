import { Request, Response } from 'express'
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

			return res.status(200).json({ data: res.locals.currentUser, message: `Successfully created course.` })
		}catch(err){
			console.error(err);
			return res.status(400).json({ error: err, message: `Failed to create course.` })
		}
	}

	getCourses = async (req: Request, res: Response) => {
		try{
			// First, we collect all of the submitted data
			let courses = await Course.find({ createdBy: res.locals.currentUser._id })

			return res.status(200).json({ data: courses, message: `Successfully fetched courses.` })
		}catch(err){
			console.error(err);
			return res.status(400).json({ error: err, message: `Failed to fetch courses.` })
		}
	}


}