import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Course, Email, Section, StandardResponseInterface } from '@dynrec/common';
import { environment } from '@environment';
import { HttpFilterInterface } from '@http/httpFilter.interface';
import { ListRequest } from 'app/decorators';
import { plainToClass } from 'class-transformer';

@Injectable({
    providedIn: 'root',
})
export class EmailService {
    constructor(private http: HttpClient) {}

    public async emailSection(
        section: Section,
        subject: string,
        body: string
    ): Promise<StandardResponseInterface<Email>> {
        const url = `${environment.apiURL}/section/${section.id}/email`;
        return new Promise((resolve, reject) => {
            this.http
                .post<StandardResponseInterface<Email>>(url, { subject, body })
                .subscribe(
                    result => {
                        if (result) {
                            // eslint-disable-next-line no-param-reassign
                            result.data = plainToClass(Email, result.data);
                            resolve(result);
                        } else reject(new Error('No result returned'));
                    },
                    (err: Error) => {
                        reject(err);
                    }
                );
        });
    }

    @ListRequest<Email>(Email, 'email')
    public async getCourseEmails(
        course: Course,
        filter?: HttpFilterInterface
    ): Promise<StandardResponseInterface<Email[]>> {
        throw new Error('Decorator Overloading Failed');
    }
}
