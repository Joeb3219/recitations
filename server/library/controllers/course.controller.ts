import { Course } from '@models/course';
import { Controller, GetRequest, Resource } from '../decorators';
import { HttpArgs } from '../helpers/route.helper';

@Controller
@Resource<Course>(
    Course,
    {
        dataDict: (args: HttpArgs<Course>) => {
            const { body } = args;
            return {
                name: body.name,
                department: body.department,
                courseCode: body.courseCode,
                settings: body.settings,
            };
        },
    },
    ['create', 'get', 'update', 'delete']
)
export class CourseController {
    @GetRequest('/course')
    async getCourses({ repo }: HttpArgs<Course>): Promise<Course[]> {
        return repo(Course).find({});
    }
}
