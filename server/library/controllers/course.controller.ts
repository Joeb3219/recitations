import { Request, Response } from 'express'

import { Controller, GetRequest, PostRequest } from '../decorators';

import { Course } from '@models/course'

@Controller
export class CourseController{

	@PostRequest('/course')
	async createCourse({ body, repo }) {
		// First, we collect all of the submitted data
		let { 
			name,
			department,
			courseCode,
		} = body

		let course = new Course({
			name,
			department,
			courseCode,
		})

		return await repo(Course).save(course);
	}

	@GetRequest('/course')
	async getCourses({ repo }) {
		return  await repo(Course).find({ })
	}

	@GetRequest('/course/:courseID')
	async getCourse({ repo, params }) {
		const courseID = params.courseID

		// if(!courseID) return res.status(NOT_FOUND).json({ message: 'No courseID specified.' }).end()

		return await repo(Course).findOne({ id: courseID })
	}


}