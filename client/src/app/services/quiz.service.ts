import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Course, Quiz, StandardResponseInterface } from '@dynrec/common';
import { HttpFilterInterface } from '@http/httpFilter.interface';
import { DeleteRequest, GetRequest, ListRequest, UpsertRequest } from '../decorators';

@Injectable({
    providedIn: 'root',
})
export class QuizService {
    constructor(private http: HttpClient) {}

    @UpsertRequest<Quiz>(Quiz)
    public async upsertQuiz(quiz: Quiz): Promise<StandardResponseInterface<Quiz>> {
        throw new Error('Decorator Overloading Failed');
    }

    @ListRequest<Quiz>(Quiz)
    public async getCourseQuizes(
        course: Course,
        filter?: HttpFilterInterface
    ): Promise<StandardResponseInterface<Quiz[]>> {
        throw new Error('Decorator Overloading Failed');
    }

    @GetRequest<Quiz>(Quiz)
    public async getQuiz(quizID: string): Promise<StandardResponseInterface<Quiz>> {
        throw new Error('Decorator Overloading Failed');
    }

    @DeleteRequest<Quiz>(Quiz)
    public async deleteQuiz(quizID: string): Promise<StandardResponseInterface<void>> {
        throw new Error('Decorator Overloading Failed');
    }
}
