import { Course } from '@dynrec/common';
import Boom from '@hapi/boom';
import _ from 'lodash';
import { Controller, GetRequest, PostRequest, Resource } from '../decorators';
import { RolesHelper } from '../helpers/roles.helper';
import { HttpArgs } from '../helpers/route.helper';

const dataDict = (args: HttpArgs<Course>) => {
    const { body } = args;
    return {
        name: body.name,
        department: body.department,
        courseCode: body.courseCode,
        settings: body.settings,
    };
};

@Controller
@Resource<Course>(
    Course,
    {
        dataDict,
    },
    ['get', 'update', 'delete']
)
export class CourseController {
    @GetRequest('/course')
    async getCourses({ ability }: HttpArgs): Promise<Course[]> {
        const courses = await Course.find();
        return _.sortBy(
            courses.filter(course => ability.can('view', course)),
            course => course.id
        );
    }

    @PostRequest('/course')
    async createCourse(args: HttpArgs): Promise<Course> {
        const { ability } = args;
        const data = await dataDict(args);

        if (!ability.can('create', data as Course)) {
            throw Boom.unauthorized('Unauthorized to create courses');
        }

        const course = await Course.save(data as Course);
        await RolesHelper.upsertCourseRoles(course);

        return course;
    }
}
