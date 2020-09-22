import { Controller, GetRequest, PostRequest, PutRequest } from '../decorators';
import { pickBy } from 'lodash'
import * as Boom from '@hapi/boom';

import { User } from '@models/user'
import { Course } from '@models/course'
import { LessonPlan } from '@models/lessonPlan'

@Controller
export class LessonPlanController{

	@GetRequest('/course/:courseID/lessonplans')
	async getCourseLessonPlans({ params, repo }) {
		return await repo(LessonPlan).find({ course: params.courseID })
	}

	@PostRequest('/lessonplan')
	async createLessonPlan({ body, currentUser, repo }) {
		let {
			name,
			steps,
			course
		} = body

		let lessonPlan = pickBy({
			name,
			steps,
			creator: currentUser,
			course
		}, (item) => { return item != 'undefined' && item != undefined })

		// and now we can update the section
		return await repo(LessonPlan).save(lessonPlan)
	}

	@PutRequest('/lessonplan/:lessonplanID')
	async updateLessonPlan({ params, repo, body }) {
		const { lessonplanID } = params

		let {
			name,
			steps,
			creator,
			course
		} = body

		const updateableData = pickBy({
			name,
			steps,
			creator,
			course
		}, (item) => { return item != 'undefined' && item != undefined })

		// first, we find the problem that is referenced by the given ID
		let lessonPlan = await repo(LessonPlan).findOne({ id: lessonplanID })

		// no problem found, 404 it out
		if(!lessonPlan) throw Boom.notFound('Problem not found')

		lessonPlan = Object.assign(lessonPlan, updateableData)
		
		// and now we can update the problem
		return await repo(LessonPlan).save(lessonPlan)
	}

}