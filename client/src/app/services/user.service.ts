import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { BehaviorSubject, Observable } from 'rxjs';

import { environment } from '@environment';

import { User } from '@models/user';

@Injectable()
export class UserService {
    private currentUserObservable: BehaviorSubject<User> = new BehaviorSubject<
        User
    >(null);

    constructor(private http: HttpClient) {
        this.flushCurrentUser();
    }

    public flushCurrentUser() {
        if (!localStorage.getItem('jwt')) this.currentUserObservable.next(null);
        else {
            this.getMyUserObject().subscribe((result: { data: User }) => {
                if (result) this.currentUserObservable.next(result.data);
            });
        }
    }

    public signOut() {
        this.flushCurrentUser();
    }

    public getCurrentUser(): Observable<User> {
        return this.currentUserObservable.asObservable();
    }

    public getMyUserObject() {
        const url = `${environment.apiURL}/user/me`;
        return this.http.get(url);
    }

    public async getUsers(): Promise<User[]> {
        const url = `${environment.apiURL}/user`;
        return new Promise((resolve, reject) => {
            this.http.get(url).subscribe(
                (result: { data: User[] }) => {
                    if (result) resolve(result.data);
                    else reject(new Error('No result returned'));
                },
                (err) => {
                    reject(err);
                }
            );
        });
    }

    public signin(username: string, password: string) {
        const url = `${environment.apiURL}/user/signin`;
        return this.http.post(url, { username, password });
    }
}
