import { Model, model, Schema, ObjectId } from 'mongoose'
import * as timestamps from 'mongoose-timestamps'

import { SectionInterface } from '@interfaces/section.interface'
import { MeetingTimeInterface } from '@interfaces/meetingTime.interface'

export const SectionSchema = new Schema({
	index: String,
	sectionNumber: String,
	students: [{
		type: ObjectId,
		ref: 'User'
	}],
	ta: {
		type: ObjectId,
		ref: 'User'
	},
	professor: {
		type: ObjectId,
		ref: 'User'
	},
	meetingTimes: [{}] as [MeetingTimeInterface],
	createdBy: {
		type: ObjectId,
		ref: 'User'
	}
});

SectionSchema.plugin(timestamps)

export const Section: Model<SectionInterface> = model('Section', SectionSchema);