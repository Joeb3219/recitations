import { Course } from '@dynrec/common';
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
    async getCourses(): Promise<Course[]> {
        return Course.find({});
    }

    @PostRequest('/course')
    async createCourse(args: HttpArgs): Promise<Course> {
        const data = await dataDict(args);

        const course = await Course.save(data as Course);
        await RolesHelper.createCourseRoles(course);

        return course;
    }
}
