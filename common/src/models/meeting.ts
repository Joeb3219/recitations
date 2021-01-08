import { Type } from 'class-transformer';
import { MeetingType } from '../enums';
import { MeetingTime } from '../models';

export class Meeting<Type extends MeetingType = MeetingType> {
    @Type(() => MeetingTime)
    meetingTime: MeetingTime;

    meetingType: Type;

    date: Date;

    getAccessCode() {
        const baseStr = JSON.stringify({
            meetingTime: this.meetingTime.id,
            meetingType: this.meetingType,
            date: this.date,
        });

        // Based loosely on the Java hash function.
        const hash = baseStr.split('').reduce<number>((hash, char) => {
            const charCode = char.charCodeAt(0);
            // eslint-disable-next-line no-bitwise
            const firstStep = (hash << 5) - hash + charCode;
            // eslint-disable-next-line no-bitwise
            return Math.abs(firstStep | 0);
        }, 0);

        const randomData: string[] = [
            '5',
            '1',
            'U',
            '8',
            'F',
            'H',
            'T',
            '4',
            'V',
            'Y',
            'S',
            'B',
            '7',
            'Q',
            'Z',
            'E',
            'G',
            '6',
            '9',
            'D',
            'P',
            'N',
            'R',
            'X',
            'A',
            'C',
            'I',
            'J',
            '3',
            'W',
            'M',
            'L',
            '2',
            'K',
        ];
        return [1, 0.5, 0.25, 0.125].reduce<string>(
            (str, divisor) => str + randomData[Math.ceil(Math.abs(hash / divisor)) % randomData.length ?? 0],
            ''
        );
    }

    constructor(args: Partial<Meeting> = {}) {
        Object.assign(this, args);
    }
}
