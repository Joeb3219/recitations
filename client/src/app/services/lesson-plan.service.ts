import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { environment } from '@environment';

import { Course } from '@models/course';
import { LessonPlan } from '@models/lessonPlan';
import { LessonPlanStep } from '@models/lessonPlanStep';

@Injectable({
    providedIn: 'root',
})
export class LessonPlanService {
    constructor(private http: HttpClient) {}

    public async upsertLessonPlan(lessonPlan: LessonPlan): Promise<LessonPlan> {
        const lessonPlanID = lessonPlan.id;
        const url = lessonPlanID
            ? `${environment.apiURL}/lessonplan/${lessonPlanID}`
            : `${environment.apiURL}/lessonplan`;
        let action;

        if (lessonPlanID) action = this.http.put(url, lessonPlan);
        else action = this.http.post(url, lessonPlan);

        return new Promise((resolve, reject) => {
            action.subscribe(
                (result: { data: any }) => {
                    if (result) resolve(new LessonPlan(result.data));
                    else reject(new Error('No result returned'));
                },
                (err) => {
                    reject(err);
                }
            );
        });
    }

    public async upsertLessonPlanStep(
        lessonPlanStep: LessonPlanStep
    ): Promise<LessonPlanStep> {
        const lessonPlanStepID = lessonPlanStep.id;
        const url = lessonPlanStepID
            ? `${environment.apiURL}/lessonplanstep/${lessonPlanStepID}`
            : `${environment.apiURL}/lessonplanstep`;
        let action;

        if (lessonPlanStepID) action = this.http.put(url, lessonPlanStep);
        else action = this.http.post(url, lessonPlanStep);

        return new Promise((resolve, reject) => {
            action.subscribe(
                (result: { data: any }) => {
                    if (result) resolve(new LessonPlanStep(result.data));
                    else reject(new Error('No result returned'));
                },
                (err) => {
                    reject(err);
                }
            );
        });
    }

    public async getCourseLessonPlans(
        course: Course | string
    ): Promise<LessonPlan[]> {
        // if course is an object, we will grab its id
        // otherwise, we assume course is a string representing the id
        const courseID = course instanceof String ? course : course.id;

        const url = `${environment.apiURL}/course/${courseID}/lessonplans`;

        return new Promise((resolve, reject) => {
            this.http.get(url).subscribe(
                (result: { data: any[] }) => {
                    if (result)
                        resolve(
                            (result.data || []).map(
                                (data) => new LessonPlan(data)
                            )
                        );
                    else reject(new Error('No result returned'));
                },
                (err) => {
                    reject(err);
                }
            );
        });
    }

    public async getLessonPlan(lessonPlanID: string): Promise<LessonPlan> {
        const url = `${environment.apiURL}/lessonplan/${lessonPlanID}`;

        return new Promise((resolve, reject) => {
            this.http.get(url).subscribe(
                (result: { data: any }) => {
                    if (result) resolve(new LessonPlan(result.data));
                    else reject(new Error('No result returned'));
                },
                (err) => {
                    reject(err);
                }
            );
        });
    }

    public async deleteLessonPlan(lessonPlanID: string): Promise<LessonPlan> {
        const url = `${environment.apiURL}/lessonplan/${lessonPlanID}`;

        return new Promise((resolve, reject) => {
            this.http.delete(url).subscribe(
                (result: { data: any }) => {
                    if (result) resolve(new LessonPlan(result.data));
                    else reject(new Error('No result returned'));
                },
                (err) => {
                    reject(err);
                }
            );
        });
    }
}
