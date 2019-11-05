import { Model, model, Schema, ObjectId } from 'mongoose'
import * as timestamps from 'mongoose-timestamps'

import { CourseInterface } from '@interfaces/course.interface'

export const CourseSchema = new Schema({
	name: String, 			// name of the course
	department: String,		// department of the course
	courseCode: String, 	// an identifier for the course, either a number or code of some sort

	sections: [{
		type: ObjectId,
		ref: 'Section'
	}],	// All of the sections in the course

	createdBy: {
		type: ObjectId,
		ref: 'User'
	},		// The user who created the course
});

CourseSchema.plugin(timestamps)

export const Course: Model<CourseInterface> = model('Course', CourseSchema);