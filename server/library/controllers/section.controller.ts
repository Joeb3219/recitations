import * as Boom from '@hapi/boom';
import { Section } from '@models/section';
import { pickBy } from 'lodash';
import { DeleteResult } from 'typeorm';
import {
    Controller,
    DeleteRequest,
    GetRequest,
    PostRequest,
    PutRequest,
} from '../decorators';
import { HttpArgs } from '../helpers/route.helper';

@Controller
export class SectionController {
    @GetRequest('/course/:courseID/sections')
    async getCourseSections({ repo, params }: HttpArgs): Promise<Section[]> {
        // we simply can query for all sections that have the given course id set as their course column
        return repo(Section).find({ course: params.courseID });
    }

    @DeleteRequest('/section/:sectionID')
    async deleteSection({ params, repo }: HttpArgs): Promise<DeleteResult> {
        const sectionID = params.sectionID;
        return repo(Section).delete({ id: sectionID });
    }

    @PostRequest('/section')
    async createSection({ body, repo }: HttpArgs): Promise<Section> {
        const {
            index,
            sectionNumber,
            ta,
            instructor,
            meetingTimes,
            course,
        } = body;

        const section = pickBy(
            {
                index,
                sectionNumber,
                ta,
                instructor,
                meetingTimes,
                course,
            },
            (item) => {
                return item !== 'undefined' && item !== undefined;
            }
        );

        // and now we can update the section
        return repo(Section).save(section);
    }

    @PutRequest('/section/:sectionID')
    async updateSection({ params, body, repo }: HttpArgs): Promise<Section> {
        const { sectionID } = params;

        const {
            index,
            sectionNumber,
            ta,
            instructor,
            meetingTimes,
            course,
        } = body;

        const updateableData = pickBy(
            {
                index,
                sectionNumber,
                ta,
                instructor,
                meetingTimes,
                course,
            },
            (item) => {
                return item !== 'undefined' && item !== undefined;
            }
        );

        // first, we find the section that is referenced by the given ID
        let section = await repo(Section).findOne({ id: sectionID });

        // no section found, 404 it out
        if (!section) throw Boom.notFound('Failed to find specified section.');

        section = Object.assign(section, updateableData);

        // and now we can update the section
        return repo(Section).save(section);
    }
}
