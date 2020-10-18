import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { StandardResponseInterface } from '@interfaces/http/standardResponse.interface';
import { Course } from '@models/course';
import { Section } from '@models/section';
import { DeleteRequest, ListRequest, UpsertRequest } from '../decorators';
import { HttpFilterInterface } from '../http/httpFilter.interface';

@Injectable()
export class SectionService {
    constructor(private http: HttpClient) {}

    @UpsertRequest<Section>(Section)
    public async upsertSection(
        section: Section
    ): Promise<StandardResponseInterface<Section>> {
        throw new Error('Decorator Overloading Failed');
    }

    @ListRequest<Section>(Section)
    public async getCourseSections(
        course: Course,
        args?: HttpFilterInterface
    ): Promise<StandardResponseInterface<Section[]>> {
        throw new Error('Decorator Overloading Failed');
    }

    @DeleteRequest<Section>(Section)
    public async deleteSection(
        sectionID: string
    ): Promise<StandardResponseInterface<void>> {
        throw new Error('Decorator Overloading Failed');
    }
}
