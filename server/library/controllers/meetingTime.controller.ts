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

			return res.status(OK).json({ data: meetingTime, message: `Successfully created meeting time.` })
		}catch(err){
			console.error(err);
			return res.status(BAD_REQUEST).json({ error: err, message: `Failed to create meeting time.` })
		}
	}


}