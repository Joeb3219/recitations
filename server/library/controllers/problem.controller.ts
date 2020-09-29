import * as Boom from '@hapi/boom';
import { Problem } from '@models/problem';
import { get, pickBy } from 'lodash';
import { DeleteResult } from 'typeorm';
import {
    Controller,
    DeleteRequest,
    GetRequest,
    Paginated,
    PostRequest,
    PutRequest,
    Searchable,
    Sortable,
} from '../decorators';
import { HttpArgs } from '../helpers/route.helper';

@Controller
export class ProblemController {
    @GetRequest('/course/:courseID/problems')
    @Searchable(['name'])
    @Sortable({
        course: (problem) => get(problem, 'course.name'),
        creator: (problem) =>
            get(problem, 'creator.firstName') +
            ' ' +
            get(problem, 'creator.lastName'),
    })
    @Paginated()
    static async getCourseProblems({
        params,
        repo,
    }: HttpArgs): Promise<Problem[]> {
        // we simply can query for all sections that have the given course id set as their course column
        return repo(Problem).find({ course: params.courseID });
    }

    @GetRequest('/problem/:problemID')
    static async getProblem({ params, repo }: HttpArgs): Promise<Problem> {
        const problemID = params.problemID;
        return repo(Problem).findOne({ id: problemID });
    }

    @DeleteRequest('/problem/:problemID')
    static async deleteProblem({
        params,
        repo,
    }: HttpArgs): Promise<DeleteResult> {
        const problemID = params.problemID;
        return repo(Problem).delete({ id: problemID });
    }

    @PostRequest('/problem')
    static async createProblem({
        body,
        currentUser,
        repo,
    }: HttpArgs): Promise<Problem> {
        const {
            difficulty,
            name,
            question,
            solution,
            estimatedDuration,
            course,
        } = body;

        const problem = pickBy(
            {
                difficulty,
                name,
                question,
                solution,
                estimatedDuration,
                creator: currentUser,
                course,
            },
            (item) => {
                return item !== 'undefined' && item !== undefined;
            }
        );

        // and now we can update the section
        return repo(Problem).save(problem);
    }

    @PutRequest('/problem/:problemID')
    static async updateProblem({
        params,
        repo,
        body,
    }: HttpArgs): Promise<Problem> {
        const { problemID } = params;

        const {
            difficulty,
            name,
            question,
            solution,
            estimatedDuration,
            creator,
            course,
        } = body;

        const updateableData = pickBy(
            {
                difficulty,
                name,
                question,
                solution,
                estimatedDuration,
                creator,
                course,
            },
            (item) => {
                return item !== 'undefined' && item !== undefined;
            }
        );

        // first, we find the problem that is referenced by the given ID
        let problem = await repo(Problem).findOne({ id: problemID });

        // no problem found, 404 it out
        if (!problem) throw Boom.notFound('Problem not found');

        problem = Object.assign(problem, updateableData);

        // and now we can update the problem
        return repo(Problem).save(problem);
    }
}
