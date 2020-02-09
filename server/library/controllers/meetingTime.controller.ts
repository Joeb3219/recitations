import { Request, Response } from 'express'
import { OK, NOT_FOUND, BAD_REQUEST } from 'http-status-codes'

import { MeetingTime } from '@models/meetingTime'

export class MeetingTimeController{

	createMeetingTime = async (req: Request, res: Response) => {
		try{
			// First, we collect all of the submitted data
			let { 
				startTime,
				endTime,
				weekday,
				type,
				frequency,
				leader
			} = req.body

			let meetingTime = new MeetingTime({
				startTime,
				endTime,
				weekday,
				type,
				frequency,
				leader
			})

			meetingTime = await res.locals.repo(MeetingTime).save(meetingTime)

			return req.ok(`Successfully created meeting time.`, meetingTime)
		}catch(err){
			return req.error(`Failed to create meeting time.`, err)
		}
	}


}