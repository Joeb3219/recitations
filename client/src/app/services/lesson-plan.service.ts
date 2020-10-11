import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { StandardResponseInterface } from '@interfaces/http/standardResponse.interface';
import { Course } from '@models/course';
import { LessonPlan } from '@models/lessonPlan';
import { LessonPlanStep } from '@models/lessonPlanStep';
import {
    DeleteRequest,
    GetRequest,
    ListRequest,
    UpsertRequest,
} from '../decorators';
import { HttpFilterInterface } from '../http/httpFilter.interface';

@Injectable({
    providedIn: 'root',
})
export class LessonPlanService {
    constructor(private http: HttpClient) {}

    @UpsertRequest<LessonPlan>(LessonPlan)
    public async upsertLessonPlan(
        lessonPlan: LessonPlan
    ): Promise<StandardResponseInterface<LessonPlan>> {
        return undefined;
    }

    @UpsertRequest<LessonPlanStep>(LessonPlanStep)
    public async upsertLessonPlanStep(
        lessonPlanStep: LessonPlanStep
    ): Promise<StandardResponseInterface<LessonPlanStep>> {
        return undefined;
    }

    @ListRequest<LessonPlan>(LessonPlan)
    public async getCourseLessonPlans(
        course: Course,
        args: HttpFilterInterface
    ): Promise<StandardResponseInterface<LessonPlan[]>> {
        return undefined;
    }

    @GetRequest<LessonPlan>(LessonPlan)
    public async getLessonPlan(
        lessonPlanID: string
    ): Promise<StandardResponseInterface<LessonPlan>> {
        return undefined;
    }

    @DeleteRequest<LessonPlan>(LessonPlan)
    public async deleteLessonPlan(
        lessonPlanID: string
    ): Promise<StandardResponseInterface<LessonPlan>> {
        return undefined;
    }
}
