import { Request, Response } from 'express'
import { OK, NOT_FOUND, BAD_REQUEST } from 'http-status-codes'
import { pickBy } from 'lodash'

import { User } from '@models/user'
import { Course } from '@models/course'
import { Problem } from '@models/problem'

export class ProblemController{

	getCourseProblems = async (req: Request, res: Response) => {
		try{
			// we simply can query for all sections that have the given course id set as their course column
			let problems = await res.locals.repo(Problem).find({ course: req.params.courseID })

			return req.ok(`Successfully fetched problems in course.`, problems)
		}catch(err){
			return req.error(`Failed to fetch problems in course.`, err)
		}
	}

	createProblem = async (req: Request, res: Response) => {
		try{
			let {
				difficulty,
				name,
				question,
				solution,
				estimatedDuration,
				course
			} = req.body

			let problem = pickBy({
				difficulty,
				name,
				question,
				solution,
				estimatedDuration,
				creator: res.locals.currentUser,
				course
			}, (item) => { return item != 'undefined' && item != undefined })

			// and now we can update the section
			problem = await res.locals.repo(Problem).save(problem)

			return req.ok(`Successfully updated problem.`, problem)
		}catch(err){
			return req.error(`Failed updated problem.`, err)
		}
	}

	updateProblem = async (req: Request, res: Response) => {
		try{
			const { problemID } = req.params

			let {
				difficulty,
				name,
				question,
				solution,
				estimatedDuration,
				creator,
				course
			} = req.body

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
			let problem = await res.locals.repo(Problem).findOne({ id: problemID })

			// no problem found, 404 it out
			if(!problem){
				return res.status(NOT_FOUND).json('Failed to find specified problem.')
			}

			problem = Object.assign(problem, updateableData)
			
			// and now we can update the problem
			problem = await res.locals.repo(Problem).save(problem)

			return req.ok(`Successfully updated problem.`, problem)
		}catch(err){
			return req.error(`Failed to update problem.`, err)
		}
	}

}