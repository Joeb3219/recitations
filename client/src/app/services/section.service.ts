import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Course, Section, SectionSyncFormatPayload, StandardResponseInterface } from '@dynrec/common';
import { environment } from '@environment';
import { plainToClass } from 'class-transformer';
import { DeleteRequest, GetRequest, ListRequest, UpsertRequest } from '../decorators';
import { HttpFilterInterface } from '../http/httpFilter.interface';

@Injectable({
    providedIn: 'root',
})
export class SectionService {
    constructor(private http: HttpClient) {}

    @UpsertRequest<Section>(Section)
    public async upsertSection(section: Section): Promise<StandardResponseInterface<Section>> {
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
    public async deleteSection(sectionID: string): Promise<StandardResponseInterface<void>> {
        throw new Error('Decorator Overloading Failed');
    }

    @GetRequest<Section>(Section)
    public async getSection(sectionID: string): Promise<StandardResponseInterface<Section>> {
        throw new Error('Decorator Overloading Failed');
    }

    public getSyncFormats(): Promise<StandardResponseInterface<SectionSyncFormatPayload[]>> {
        const url = `${environment.apiURL}/section/formats`;
        return new Promise((resolve, reject) => {
            this.http.get<StandardResponseInterface<SectionSyncFormatPayload[]>>(url).subscribe(
                result => {
                    if (result) {
                        // eslint-disable-next-line no-param-reassign
                        result.data = result.data.map(item => plainToClass(SectionSyncFormatPayload, item));
                        resolve(result);
                    } else reject(new Error('No result returned'));
                },
                (err: Error) => {
                    reject(err);
                }
            );
        });
    }

    public syncSections(course: Course, syncFormat: string): Promise<StandardResponseInterface<Section[]>> {
        const url = `${environment.apiURL}/course/${course.id}/sections/sync/${syncFormat}`;
        return new Promise((resolve, reject) => {
            this.http.get<StandardResponseInterface<Section[]>>(url).subscribe(
                result => {
                    if (result) {
                        // eslint-disable-next-line no-param-reassign
                        result.data = result.data.map(item => plainToClass(Section, item));
                        resolve(result);
                    } else reject(new Error('No result returned'));
                },
                (err: Error) => {
                    reject(err);
                }
            );
        });
    }
}
