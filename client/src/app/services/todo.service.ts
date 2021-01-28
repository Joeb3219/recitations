import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { StandardResponseInterface, Todo } from '@dynrec/common';
import { environment } from '@environment';
import { plainToClass } from 'class-transformer';

@Injectable({
    providedIn: 'root',
})
export class TodoService {
    constructor(private http: HttpClient) {}

    public async getTodos(): Promise<StandardResponseInterface<Todo[]>> {
        const url = `${environment.apiURL}/todos`;
        return new Promise((resolve, reject) => {
            this.http.get<StandardResponseInterface<Todo[]>>(url).subscribe(
                result => {
                    if (result) {
                        // eslint-disable-next-line no-param-reassign
                        result.data = result.data.map(todo => plainToClass(Todo, todo));
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
