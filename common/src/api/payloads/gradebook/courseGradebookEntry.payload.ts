export class CourseGradebookEntryScorePayload {
    date: Date;
    score: number;
}

export class CourseGradebookEntryPayload {
    studentId: string;
    scores: CourseGradebookEntryScorePayload[];
}
