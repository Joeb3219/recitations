import { Request, Response } from 'express'
import { OK, NOT_FOUND, BAD_REQUEST } from 'http-status-codes'
import { pickBy } from 'lodash'

import { User } from '@models/user'
import { Course } from '@models/course'
import { Section } from '@models/section'

import { MeetingTime } from '@models/meetingTime'
import { MeetingType } from '@enums/meetingType.enum';

export class SectionController{

	getCourseSections = async (req: Request, res: Response) => {
		try{
			// we simply can query for all sections that have the given course id set as their course column
			let sections = await res.locals.repo(Section).find({ course: req.params.courseID })

			return res.status(OK).json({ data: sections, message: `Successfully fetched sections in course.` })
		}catch(err){
			console.error(err);
			return res.status(BAD_REQUEST).json({ error: err, message: `Failed to fetch sections in course.` })
		}
	}

	createSection = async (req: Request, res: Response) => {
		try{
			let {
				index,
				sectionNumber,
				ta,
				professor,
				meetingTimes,
				course
			} = req.body

			let section = pickBy({
				index,
				sectionNumber,
				ta,
				professor,
				meetingTimes,
				course
			}, (item) => { return item != 'undefined' && item != undefined })

			// and now we can update the section
			section = (await res.locals.repo(Section).save(section))[0]

			return res.status(OK).json({ data: section, message: `Successfully updated section.` })
		}catch(err){
			console.error(err);
			return res.status(BAD_REQUEST).json({ error: err, message: `Failed updated section.` })
		}
	}

	updateSection = async (req: Request, res: Response) => {
		try{
			const { sectionID } = req.params

			let {
				index,
				sectionNumber,
				ta,
				professor,
				meetingTimes,
				course
			} = req.body

			const updateableData = pickBy({
				index,
				sectionNumber,
				ta,
				professor,
				meetingTimes,
				course
			}, (item) => { return item != 'undefined' && item != undefined })

			// first, we find the section that is referenced by the given ID
			let section = await res.locals.repo(Section).find({ id: sectionID })

			// no section found, 404 it out
			if(!section){
				return res.status(NOT_FOUND).json('Failed to find specified section.')
			}

			section = Object.assign(section, updateableData)
			
			// and now we can update the section
			section = (await res.locals.repo(Section).save(section))[0]

			return res.status(OK).json({ data: section, message: `Successfully updated section.` })
		}catch(err){
			console.error(err);
			return res.status(BAD_REQUEST).json({ error: err, message: `Failed updated section.` })
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