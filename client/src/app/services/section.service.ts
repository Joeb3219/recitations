import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Course, Section, StandardResponseInterface } from '@dynrec/common';
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
