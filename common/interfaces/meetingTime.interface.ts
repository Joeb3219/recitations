import { MeetingType } from '@enums/meetingType.enum'

export interface MeetingTimeInterface {

	id: string;
	startTime: Date;
	endTime: Date;
	weekday: string;
	type: MeetingType;
	frequency: number;

}