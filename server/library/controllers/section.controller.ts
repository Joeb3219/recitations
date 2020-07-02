import {Controller, DeleteRequest, GetRequest, PostRequest, PutRequest} from '../decorators'
import * as Boom from '@hapi/boom';
import { pickBy } from 'lodash'

import { User } from '@models/user'
import { Course } from '@models/course'
import { Section } from '@models/section'

import { MeetingTime } from '@models/meetingTime'
import { MeetingType } from '@enums/meetingType.enum';
import {Problem} from "@models/problem";

@Controller
export class SectionController{

	@GetRequest('/course/:courseID/sections')
	async getCourseSections({ repo, params }) {
		// we simply can query for all sections that have the given course id set as their course column
		return await repo(Section).find({ course: params.courseID })
	}

	@DeleteRequest('/section/:sectionID')
	async deleteSection({ params, repo }){
		const sectionID = params.sectionID;
		return await repo(Section).delete({ id: sectionID })
	}


	@PostRequest('/section')
	async createSection({ body, repo }) {
		let {
			index,
			sectionNumber,
			ta,
			instructor,
			meetingTimes,
			course,
		} = body

		let section = pickBy({
			index,
			sectionNumber,
			ta,
			instructor,
			meetingTimes,
			course,
		}, (item) => { return item != 'undefined' && item != undefined })

		// and now we can update the section
		return await repo(Section).save(section)
	}

	@PutRequest('/section/:sectionID')
	async updateSection({ params, body, repo }) {
		const { sectionID } = params

		let {
			index,
			sectionNumber,
			ta,
			instructor,
			meetingTimes,
			course
		} = body

		const updateableData = pickBy({
			index,
			sectionNumber,
			ta,
			instructor,
			meetingTimes,
			course
		}, (item) => { return item != 'undefined' && item != undefined })

		// first, we find the section that is referenced by the given ID
		let section = await repo(Section).findOne({ id: sectionID })

		// no section found, 404 it out
		if(!section) throw Boom.notFound('Failed to find specified section.');

		section = Object.assign(section, updateableData)
		
		// and now we can update the section
		return await repo(Section).save(section);
	}

}