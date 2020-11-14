import { Meeting } from '@dynrec/common';
import { Controller, GetRequest } from '../decorators';

@Controller
export class MeetingController {
    @GetRequest('/meeting')
    async getMeetings(): Promise<Meeting[]> {
        return [];
    }
}
