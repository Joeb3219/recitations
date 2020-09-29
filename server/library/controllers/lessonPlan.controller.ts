import * as Boom from '@hapi/boom';
import { LessonPlan } from '@models/lessonPlan';
import { LessonPlanStep, LessonPlanStepType } from '@models/lessonPlanStep';
import { pickBy } from 'lodash';
import { Controller, GetRequest, PostRequest, PutRequest } from '../decorators';
import { HttpArgs } from '../helpers/route.helper';

@Controller
export class LessonPlanController {
    @GetRequest('/course/:courseID/lessonplans')
    async getCourseLessonPlans({
        params,
        repo,
    }: HttpArgs): Promise<LessonPlan[]> {
        return repo(LessonPlan).find({ course: params.courseID });
    }

    @GetRequest('/lessonplan/:lessonPlanID')
    async getLessonPlan({ params, repo }: HttpArgs): Promise<LessonPlan> {
        const { lessonPlanID } = params;
        return repo(LessonPlan).findOne({ id: lessonPlanID });
    }

    @PostRequest('/lessonplan')
    async createLessonPlan({
        body,
        currentUser,
        repo,
    }: HttpArgs): Promise<LessonPlan> {
        const { name, steps, course, difficulty } = body;

        const lessonPlan = pickBy(
            {
                name,
                steps,
                creator: currentUser,
                course,
                difficulty,
            },
            (item) => {
                return item !== 'undefined' && item !== undefined;
            }
        );

        // and now we can update the section
        return repo(LessonPlan).save({ ...lessonPlan });
    }

    @PutRequest('/lessonplan/:lessonplanID')
    async updateLessonPlan({
        params,
        repo,
        body,
    }: HttpArgs): Promise<LessonPlan> {
        const { lessonplanID } = params;

        const { name, steps, creator, course, difficulty } = body;

        const updateableData = pickBy(
            {
                name,
                steps,
                creator,
                course,
                difficulty,
            },
            (item) => {
                return item !== 'undefined' && item !== undefined;
            }
        );

        // first, we find the Lesson Plan that is referenced by the given ID
        let lessonPlan = await repo(LessonPlan).findOne({ id: lessonplanID });

        // no Lesson Plan found, 404 it out
        if (!lessonPlan) throw Boom.notFound('Lesson Plan not found');

        lessonPlan = Object.assign(lessonPlan, updateableData);

        // and now we can update the Lesson Plan
        return repo(LessonPlan).save(lessonPlan);
    }

    @PostRequest('/lessonplanstep')
    async createLessonPlanStep({
        body,
        currentUser,
        repo,
    }: HttpArgs): Promise<LessonPlanStepType> {
        const {
            type,
            title,
            description,
            estimatedDuration,
            problem,
            course,
        } = body;

        const lessonPlanStep = pickBy(
            {
                type,
                title,
                description,
                estimatedDuration,
                problem,
                course,
                creator: currentUser,
            },
            (item) => {
                return item !== 'undefined' && item !== undefined;
            }
        );

        // and now we can update the section
        return repo(LessonPlanStep).save(lessonPlanStep);
    }

    @PutRequest('/lessonplanstep/:lessonplanstepID')
    async updateLessonPlanStepStep({
        params,
        repo,
        body,
    }: HttpArgs): Promise<LessonPlanStep> {
        const { lessonplanstepID } = params;

        const {
            type,
            title,
            description,
            estimatedDuration,
            problem,
            course,
            creator,
        } = body;

        const updateableData = pickBy(
            {
                type,
                title,
                description,
                estimatedDuration,
                problem,
                course,
                creator,
            },
            (item) => {
                return item !== 'undefined' && item !== undefined;
            }
        );

        // first, we find the step that is referenced by the given ID
        let lessonPlanStep = await repo(LessonPlan).findOne({
            id: lessonplanstepID,
        });

        // no step found, 404 it out
        if (!lessonPlanStep) throw Boom.notFound('Lesson Plan Step not found');

        lessonPlanStep = Object.assign(lessonPlanStep, updateableData);

        // and now we can update the step
        return repo(LessonPlanStep).save(lessonPlanStep);
    }
}
