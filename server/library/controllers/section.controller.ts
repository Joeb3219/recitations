import { Request, Response } from 'express'
import { OK, NOT_FOUND, BAD_REQUEST } from 'http-status-codes'

import { User } from '@models/user'
import { Course } from '@models/course'
import { Section } from '@models/section'

import { MeetingTime } from '@models/meetingTime'
import { MeetingType } from '@enums/meetingType.enum';

export class SectionController{

	getCourseSections = async (req: Request, res: Response) => {
		try{
			// first, we fetch the course
			// this course will contain an array of all section IDs
			let sections = await res.locals.repo(Section).find({ course: req.params.courseID })
			// let sections = []
			// if(!sections.length){
			// 	// const meetingTime = new MeetingTime({
			// 	// 	startTime: new Date(0, 0, 0, 8, 0, 0),
			// 	// 	endTime: new Date(0, 0, 0, 9, 30, 0),
			// 	// 	weekday: 'Monday',
			// 	// 	type: MeetingType.RECITATION,
			// 	// 	frequency: 1
			// 	// })

			// 	// console.log(meetingTime)
			// 	// const sv = await res.locals.repo(MeetingTime).save(meetingTime)
			// 	// console.log(sv)

			// 	const meetingTime = await res.locals.repo(MeetingTime).findOne({})

			// 	const section = new Section({ 
			// 		index: '11111',
			// 		sectionNumber: '01',
			// 		course: await res.locals.repo(Course).findOne({}),
			// 		students: [],
			// 		ta: await res.locals.repo(User).findOne({}),
			// 		professor: await res.locals.repo(User).findOne({}),
			// 		meetingTimes: [ meetingTime ]
			// 	})

			// 	console.log(section)

			// 	const result = await res.locals.repo(Section).save(section)
			// 	console.log(result)
			// }

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

			const course = await Course.findOne({ id: courseID })

			if(course) return res.status(OK).json({ data: course, message: `Successfully fetched course.` })
			else res.status(NOT_FOUND).json({ message: 'Failed to find specified course.' })
		}catch(err){
			console.error(err);
			return res.status(BAD_REQUEST).json({ error: err, message: `Failed to fetch courses.` })
		}
	}


}