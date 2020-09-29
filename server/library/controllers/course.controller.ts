import { Course } from '@models/course';
import { Controller, GetRequest, PostRequest } from '../decorators';
import { HttpArgs } from '../helpers/route.helper';

@Controller
export class CourseController {
    @PostRequest('/course')
    static async createCourse({ body, repo }: HttpArgs): Promise<Course> {
        // First, we collect all of the submitted data
        const { name, department, courseCode } = body;

        const course = {
            name,
            department,
            courseCode,
        };

        return repo(Course).save(course);
    }

    @GetRequest('/course')
    static async getCourses({ repo }: HttpArgs): Promise<Course[]> {
        return repo(Course).find({});
    }

    @GetRequest('/course/:courseID')
    static async getCourse({ repo, params }: HttpArgs): Promise<Course[]> {
        const courseID = params.courseID;

        // if(!courseID) return res.status(NOT_FOUND).json({ message: 'No courseID specified.' }).end()

        return repo(Course).findOne({ id: courseID });
    }
}
