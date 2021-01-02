export interface UpdateRosterStudentPayload {
    user: string;
    destination?: string;
    moveType: 'moved' | 'created' | 'deleted';
}

export class UpdateRosterPayload {
    updates: UpdateRosterStudentPayload[];
}
