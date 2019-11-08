import { Request, Response } from 'express'
import { OK, NOT_FOUND, BAD_REQUEST } from 'http-status-codes'

import { Course } from '@models/course.model'
import { Section } from '@models/section.model'

export class SectionController{

	getCourseSections = async (req: Request, res: Response) => {
		try{
			// first, we fetch the course
			// this course will contain an array of all section IDs
			let course = await Course.find({ _id: req.params.courseID })

			if(!course){
				return res.status(NOT_FOUND).json({ message: 'Failed to find course provided' })
			}

			// now we can fetch all of the sections that have an id within the found course's sections array
			let sections = await Section.find({ _id: { $in: course.sections }})

			return res.status(OK).json({ data: sections, message: `Successfully fetched sections in course.` })
		}catch(err){
			console.error(err);
			return res.status(BAD_REQUEST).json({ error: err, message: `Failed to fetch sections in course.` })
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