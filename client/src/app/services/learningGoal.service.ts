import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Course, LearningGoalCategory, StandardResponseInterface } from '@dynrec/common';
import { DeleteRequest, ListRequest, UpsertRequest } from '../decorators';
import { HttpFilterInterface } from '../http/httpFilter.interface';

@Injectable()
export class LearningGoalService {
    constructor(private http: HttpClient) {}

    @UpsertRequest<LearningGoalCategory>(LearningGoalCategory)
    public async upsertLearningGoalCategory(
        category: LearningGoalCategory
    ): Promise<StandardResponseInterface<LearningGoalCategory>> {
        throw new Error('Decorator Overloading Failed');
    }

    @ListRequest<LearningGoalCategory>(LearningGoalCategory)
    public async getCourseLearningGoalCategories(
        course: Course,
        args?: HttpFilterInterface
    ): Promise<StandardResponseInterface<LearningGoalCategory[]>> {
        throw new Error('Decorator Overloading Failed');
    }

    @DeleteRequest<LearningGoalCategory>(LearningGoalCategory)
    public async deleteSection(categoryID: string): Promise<StandardResponseInterface<void>> {
        throw new Error('Decorator Overloading Failed');
    }
}
