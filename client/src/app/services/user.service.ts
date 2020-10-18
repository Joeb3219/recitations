import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '@environment';
import { User } from '@models/user';
import { BehaviorSubject, Observable } from 'rxjs';
import { StandardResponseInterface } from '../../../../common/interfaces/http/standardResponse.interface';

@Injectable()
export class UserService {
    private currentUserObservable: BehaviorSubject<
        User | undefined
    > = new BehaviorSubject<User | undefined>(undefined);

    constructor(private http: HttpClient) {
        this.flushCurrentUser();
    }

    public flushCurrentUser(): void {
        if (!localStorage.getItem('jwt'))
            this.currentUserObservable.next(undefined);
        else {
            this.getMyUserObject().subscribe((result: { data: User }) => {
                if (result) this.currentUserObservable.next(result.data);
            });
        }
    }

    public signOut() {
        this.flushCurrentUser();
    }

    public getCurrentUser(): Observable<User | undefined> {
        return this.currentUserObservable.asObservable();
    }

    public getMyUserObject(): Observable<StandardResponseInterface<User>> {
        const url = `${environment.apiURL}/user/me`;
        return this.http.get<StandardResponseInterface<User>>(url);
    }

    public async getUsers(): Promise<User[]> {
        const url = `${environment.apiURL}/user`;
        return new Promise((resolve, reject) => {
            this.http.get<StandardResponseInterface<User[]>>(url).subscribe(
                (result: StandardResponseInterface<User[]>) => {
                    if (result) resolve(result.data);
                    else reject(new Error('No result returned'));
                },
                (err: Error) => {
                    reject(err);
                }
            );
        });
    }

    public signin(
        username: string,
        password: string
    ): Observable<StandardResponseInterface<User>> {
        const url = `${environment.apiURL}/user/signin`;
        return this.http.post<StandardResponseInterface<User>>(url, {
            username,
            password,
        });
    }
}
