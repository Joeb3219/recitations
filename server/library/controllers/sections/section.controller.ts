import { Course, MeetingTime, Section, SectionSyncFormatPayload } from '@dynrec/common';
import Boom from '@hapi/boom';
import { get } from 'lodash';
import { Controller, GetRequest, Resource } from '../../decorators';
import { HttpArgs } from '../../helpers/route.helper';
import { ALL_SECTION_SYNC_TYPES } from './datasource/index';

@Controller
@Resource(Section, {
    sortable: {
        dataDictionary: {
            course: section => get(section, 'course.name'),
            ta: section => get(section, 'ta.firstName') + ' ' + get(section, 'ta.lastName'),
            instructor: section => get(section, 'instructor.firstName') + ' ' + get(section, 'instructor.lastName'),
        },
    },
    searchable: [
        'index',
        'sectionNumber',
        'ta.firstName',
        'ta.lastName',
        'ta.username',
        'instructor.firstName',
        'instructor.lastName',
        'instructor.username',
    ],
    dataDict: (args: HttpArgs<Section>) => {
        const { body } = args;
        return {
            index: body.index,
            sectionNumber: body.sectionNumber,

            ta: body.ta,
            instructor: body.instructor,
            course: body.course,
            meetingTimes: body.meetingTimes,
        };
    },
})
export class SectionController {
    @GetRequest('/section/formats')
    async getAvailableSectionSyncFormats(): Promise<SectionSyncFormatPayload[]> {
        return ALL_SECTION_SYNC_TYPES.map(Roster => {
            const instance = new Roster();
            return {
                id: instance.id,
                name: instance.name,
                description: instance.description,
            };
        });
    }

    @GetRequest('/course/:courseID/sections/sync/:syncID')
    async syncSections({ params }: HttpArgs<never, { syncID: string }>): Promise<Section[]> {
        const course = await Course.findOne({ id: params.courseID }, { relations: ['sections'] });
        if (!course) {
            throw Boom.notFound('No course found');
        }

        // Attempt to find the target sync datasource
        const datasourceInstances = ALL_SECTION_SYNC_TYPES.map(SyncFormat => new SyncFormat());
        const datasource = datasourceInstances.find(instance => instance.id === params.syncID);
        if (!datasource) {
            throw Boom.notFound('Provided sync format not found');
        }

        // Run the data source to fetch the relevant updates
        const updatedSections = await datasource.fetchSections(course);

        // And now we can apply them!
        await Promise.all(
            updatedSections.map(async updated => {
                const original = course.sections?.find(
                    section => section.index === updated.index || section.sectionNumber === updated.sectionNumber
                );

                // Couldn't find a matching section.... so we'll create one!
                if (!original) {
                    const section = new Section({
                        index: updated.index,
                        sectionNumber: updated.sectionNumber,
                        meetingTimes: updated.meetingTimes.map(
                            time =>
                                new MeetingTime({
                                    startTime: time.startTime,
                                    endTime: time.endTime,
                                    type: time.type,
                                    weekday: time.weekday,
                                    frequency: time.frequency,
                                })
                        ),
                    });

                    course.sections?.push(section);
                } else {
                    // Now we can update the existing
                    original.index = updated.index ?? original.index;
                    original.sectionNumber = updated.sectionNumber ?? original.sectionNumber;
                    original.meetingTimes = original.meetingTimes?.length
                        ? updated.meetingTimes.map(
                              time =>
                                  new MeetingTime({
                                      startTime: time.startTime,
                                      endTime: time.endTime,
                                      type: time.type,
                                      weekday: time.weekday,
                                      frequency: time.frequency,
                                  })
                          ) ?? original.meetingTimes
                        : original.meetingTimes;

                    // await original.save();
                }
            })
        );

        await course.save();

        return course.sections ?? [];
    }
}
