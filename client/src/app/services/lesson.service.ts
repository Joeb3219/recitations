import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Course, Lesson, StandardResponseInterface } from '@dynrec/common';
import { HttpFilterInterface } from '@http/httpFilter.interface';
import { DeleteRequest, GetRequest, ListRequest, UpsertRequest } from '../decorators';

@Injectable({
    providedIn: 'root',
})
export class LessonService {
    constructor(private http: HttpClient) {}

    @UpsertRequest<Lesson>(Lesson, 'lesson')
    public async upsertLesson(lesson: Lesson): Promise<StandardResponseInterface<Lesson>> {
        throw new Error('Decorator Overloading Failed');
    }

    @ListRequest<Lesson>(Lesson, 'lesson')
    public async getCourseLessons(
        course: Course,
        filter?: HttpFilterInterface
    ): Promise<StandardResponseInterface<Lesson[]>> {
        throw new Error('Decorator Overloading Failed');
    }

    @GetRequest<Lesson>(Lesson, 'lesson')
    public async getLesson(lessonID: string): Promise<StandardResponseInterface<Lesson>> {
        throw new Error('Decorator Overloading Failed');
    }

    @DeleteRequest<Lesson>(Lesson, 'lesson')
    public async deleteLesson(lessonID: string): Promise<StandardResponseInterface<void>> {
        throw new Error('Decorator Overloading Failed');
    }
}
