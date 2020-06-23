import { Controller, GetRequest, PostRequest, PutRequest } from '../decorators';
import { pickBy } from 'lodash'
import * as Boom from '@hapi/boom';

import { User } from '@models/user'
import { Course } from '@models/course'
import { Problem } from '@models/problem'

@Controller
export class ProblemController{

	@GetRequest('/course/:courseID/problems')
	async getCourseProblems({ params, repo }) {
		// we simply can query for all sections that have the given course id set as their course column
		return await repo(Problem).find({ course: params.courseID })
	}

	@GetRequest('/problem/:problemID')
	async getProblem({ params, repo }) {
		const problemID = params.problemID;
		return await repo(Problem).findOne({ id: problemID })
	}


	@PostRequest('/problem')
	async createProblem({ body, currentUser, repo }) {
		let {
			difficulty,
			name,
			question,
			solution,
			estimatedDuration,
			course
		} = body

		let problem = pickBy({
			difficulty,
			name,
			question,
			solution,
			estimatedDuration,
			creator: currentUser,
			course
		}, (item) => { return item != 'undefined' && item != undefined })

		// and now we can update the section
		return await repo(Problem).save(problem)
	}

	@PutRequest('/problem/:problemID')
	async updateProblem({ params, repo, body }) {
		const { problemID } = params

		let {
			difficulty,
			name,
			question,
			solution,
			estimatedDuration,
			creator,
			course
		} = body

		const updateableData = pickBy({
			difficulty,
			name,
			question,
			solution,
			estimatedDuration,
			creator,
			course
		}, (item) => { return item != 'undefined' && item != undefined })

		// first, we find the problem that is referenced by the given ID
		let problem = await repo(Problem).findOne({ id: problemID })

		// no problem found, 404 it out
		if(!problem) throw Boom.notFound('Problem not found')

		problem = Object.assign(problem, updateableData)
		
		// and now we can update the problem
		return await repo(Problem).save(problem)
	}

}