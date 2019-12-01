import { MeetingType } from '@enums/meetingType.enum'
import { UserInterface } from '@interfaces/user.interface'

export interface MeetingTimeInterface {

	id: string;
	startTime: string;
	endTime: string;
	weekday: string;
	type: MeetingType;
	frequency: number;
	leader?: UserInterface;

}