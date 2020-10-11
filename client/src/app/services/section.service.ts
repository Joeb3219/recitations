import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { StandardResponseInterface } from '@interfaces/http/standardResponse.interface';
import { Course } from '@models/course';
import { Section } from '@models/section';
import { DeleteRequest, GetRequest, UpsertRequest } from '../decorators';

@Injectable()
export class SectionService {
    constructor(private http: HttpClient) {}

    @UpsertRequest<Section>(Section)
    public async upsertSection(
        section: Section
    ): Promise<StandardResponseInterface<Section>> {
        return undefined;
    }

    @GetRequest<Section>(Section)
    public async getCourseSections(
        course: Course | string
    ): Promise<StandardResponseInterface<Section[]>> {
        return undefined;
    }

    @DeleteRequest<Section>(Section)
    public async deleteSection(
        sectionID: string
    ): Promise<StandardResponseInterface<void>> {
        return undefined;
    }
}
