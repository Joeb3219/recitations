import { Controller, PostRequest } from '../decorators';

import { MeetingTime } from '@models/meetingTime'

@Controller
export class MeetingTimeController{

	@PostRequest('/meetingTime')
	async createMeetingTime({ body, repo }) {
		// First, we collect all of the submitted data
		let { 
			startTime,
			endTime,
			weekday,
			type,
			frequency,
			leader
		} = body

		let meetingTime = new MeetingTime({
			startTime,
			endTime,
			weekday,
			type,
			frequency,
			leader
		})

		return await repo(MeetingTime).save(meetingTime)
	}


}