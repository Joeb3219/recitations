import {User} from "../models/user";

export class helperMethods{
    public static getMinuteUnitHelper(estimatedDuration: number) {
        let unit: string;
        estimatedDuration > 1 ? unit = "minutes" : unit = "minute";
        return unit;
    }

    public static getUserFullName(user: User){
        return user.firstName + " " + user.lastName;
    }
}


