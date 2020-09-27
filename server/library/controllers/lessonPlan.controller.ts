import { Controller, GetRequest, PostRequest, PutRequest } from '../decorators';
import { pickBy } from 'lodash'
import * as Boom from '@hapi/boom';

import { User } from '@models/user'
import { Course } from '@models/course'
import { LessonPlan } from '@models/lessonPlan'
import { LessonPlanStep } from '@models/lessonPlanStep';

@Controller
export class LessonPlanController{

	@GetRequest('/course/:courseID/lessonplans')
	async getCourseLessonPlans({ params, repo }) {
		return await repo(LessonPlan).find({ course: params.courseID })
	}

	@GetRequest('/lessonplan/:lessonPlanID')
	async getLessonPlan({ params, repo }) {
		const { lessonPlanID } = params;
		return await repo(LessonPlan).findOne({ id: lessonPlanID })
	}

	@PostRequest('/lessonplan')
	async createLessonPlan({ body, currentUser, repo }) {
		let {
			name,
			steps,
			course,
			difficulty,
		} = body

		let lessonPlan = pickBy({
			name,
			steps,
			creator: currentUser,
			course,
			difficulty
		}, (item) => { return item != 'undefined' && item != undefined })

		// and now we can update the section
		return await repo(LessonPlan).save({ ...lessonPlan })
	}

	@PutRequest('/lessonplan/:lessonplanID')
	async updateLessonPlan({ params, repo, body }) {
		const { lessonplanID } = params

		let {
			name,
			steps,
			creator,
			course,
			difficulty,
		} = body

		const updateableData = pickBy({
			name,
			steps,
			creator,
			course,
			difficulty
		}, (item) => { return item != 'undefined' && item != undefined })

		// first, we find the Lesson Plan that is referenced by the given ID
		let lessonPlan = await repo(LessonPlan).findOne({ id: lessonplanID })

		// no Lesson Plan found, 404 it out
		if(!lessonPlan) throw Boom.notFound('Lesson Plan not found')

		lessonPlan = Object.assign(lessonPlan, updateableData)
		
		// and now we can update the Lesson Plan
		return await repo(LessonPlan).save(lessonPlan)
	}

	@PostRequest('/lessonplanstep')
	async createLessonPlanStep({ body, currentUser, repo }) {
		let {
			type,
			title,
			description,		
			estimatedDuration,
			problem,
			course,
		} = body

		let lessonPlanStep = pickBy({
			type,
			title,
			description,		
			estimatedDuration,
			problem,
			course,
			creator: currentUser,
		}, (item) => { return item != 'undefined' && item != undefined })

		// and now we can update the section
		return await repo(LessonPlanStep).save(lessonPlanStep);
	}

	@PutRequest('/lessonplanstep/:lessonplanstepID')
	async updateLessonPlanStepStep({ params, repo, body }) {
		const { lessonplanstepID } = params

		let {
			type,
			title,
			description,		
			estimatedDuration,
			problem,
			course,
			creator
		} = body

		const updateableData = pickBy({
			type,
			title,
			description,		
			estimatedDuration,
			problem,
			course,
			creator
		}, (item) => { return item != 'undefined' && item != undefined })

		// first, we find the step that is referenced by the given ID
		let lessonPlanStep = await repo(LessonPlan).findOne({ id: lessonplanstepID })

		// no step found, 404 it out
		if(!lessonPlanStep) throw Boom.notFound('Lesson Plan Step not found')

		lessonPlanStep = Object.assign(lessonPlanStep, updateableData)
		
		// and now we can update the step
		return await repo(LessonPlanStep).save(lessonPlanStep)
	}

}