import { HttpParams } from '@angular/common/http';
import { Course, StandardResponseInterface } from '@dynrec/common';
import { environment } from '@environment';
import { HttpFilterInterface } from '@http/httpFilter.interface';
import { plainToClass } from 'class-transformer';
import { Observable } from 'rxjs';

export function getFilterParams(filter?: HttpFilterInterface) {
    let params = new HttpParams();
    if (filter) {
        params = (Object.keys(filter) as (keyof HttpFilterInterface)[]).reduce(
            (prev, curr) => (filter[curr] !== undefined ? prev.append(curr, filter[curr]?.toString() ?? '') : prev),
            params
        );
    }

    return params;
}

function getResolvedRoute(route: string, mappings: { [key: string]: string }) {
    Object.keys(mappings).forEach(key => {
        // eslint-disable-next-line no-param-reassign
        route = route.replace(key, mappings[key]);
    });

    return `${environment.apiURL}/${route}`;
}

export function ListRequest<ResourceModel>(
    BaseEntity: new (data: Partial<ResourceModel>) => ResourceModel,
    baseResourceName: string,
    route?: string
): any {
    return function (target: any, propertyKey: string, descriptor: PropertyDescriptor): any {
        const resourceName = baseResourceName ?? BaseEntity.name.toLowerCase();
        const realRoute = route || `course/:courseid/${resourceName}s`;

        // eslint-disable-next-line no-param-reassign, func-names
        descriptor.value = async function (
            course: Course,
            filter?: HttpFilterInterface
        ): Promise<StandardResponseInterface<ResourceModel[]>> {
            const url = getResolvedRoute(realRoute, {
                ':courseid': course.id,
            });

            const params = getFilterParams(filter);

            return new Promise((resolve, reject) => {
                (this as any).http.get(url, { params }).subscribe(
                    (result: StandardResponseInterface<ResourceModel[]>) => {
                        if (result) {
                            // eslint-disable-next-line no-param-reassign
                            result.data = result.data.map(item => plainToClass(BaseEntity, item));
                            resolve(result);
                        } else reject(new Error('No result returned'));
                    },
                    (err: Error) => {
                        reject(err);
                    }
                );
            });
        };

        return descriptor;
    };
}

export function GetRequest<ResourceModel>(
    BaseEntity: new (data: Partial<ResourceModel>) => ResourceModel,
    baseResourceName: string,
    route?: string
): any {
    return function (target: any, propertyKey: string, descriptor: PropertyDescriptor): any {
        Reflect.defineMetadata('GetResource', { BaseEntity, propertyKey, target }, target);
        const resourceName = baseResourceName ?? BaseEntity.name.toLowerCase();
        const realRoute = route || `${resourceName}/:resourceid`;

        // eslint-disable-next-line no-param-reassign, func-names
        descriptor.value = async function (resourceID: string): Promise<StandardResponseInterface<ResourceModel>> {
            const url = getResolvedRoute(realRoute, {
                ':resourceid': resourceID,
            });

            return new Promise((resolve, reject) => {
                (this as any).http.get(url).subscribe(
                    (result: StandardResponseInterface<ResourceModel>) => {
                        if (result) {
                            // eslint-disable-next-line no-param-reassign
                            result.data = plainToClass(BaseEntity, result.data);
                            resolve(result);
                        } else reject(new Error('No result returned'));
                    },
                    (err: Error) => {
                        reject(err);
                    }
                );
            });
        };

        return descriptor;
    };
}

export function UpsertRequest<ResourceModel extends { id: string }>(
    BaseEntity: new (data: Partial<ResourceModel>) => ResourceModel,
    baseResourceName: string,
    route?: string
): any {
    return function (target: any, propertyKey: string, descriptor: PropertyDescriptor): any {
        const resourceName = baseResourceName ?? BaseEntity.name.toLowerCase();

        // eslint-disable-next-line no-param-reassign, func-names
        descriptor.value = async function (resource: ResourceModel): Promise<StandardResponseInterface<ResourceModel>> {
            const realRoute = route || (resource.id ? `${resourceName}/:resourceid` : `${resourceName}`);

            const url = getResolvedRoute(realRoute, {
                ':resourceid': resource.id,
            });

            let action: Observable<StandardResponseInterface<ResourceModel>>;

            if (resource.id) action = (this as any).http.put(url, resource);
            else action = (this as any).http.post(url, resource);

            return new Promise((resolve, reject) => {
                action.subscribe(
                    (result: StandardResponseInterface<ResourceModel>) => {
                        if (result) {
                            // eslint-disable-next-line no-param-reassign
                            result.data = plainToClass(BaseEntity, result.data);
                            resolve(result);
                        } else reject(new Error('No result returned'));
                    },
                    (err: Error) => {
                        reject(err);
                    }
                );
            });
        };

        return descriptor;
    };
}

export function DeleteRequest<ResourceModel>(
    BaseEntity: new (data: Partial<ResourceModel>) => ResourceModel,
    baseResourceName: string,
    route?: string
): any {
    return function (target: any, propertyKey: string, descriptor: PropertyDescriptor): any {
        const resourceName = baseResourceName ?? BaseEntity.name.toLowerCase();
        const realRoute = route || `${resourceName}/:resourceid`;

        // eslint-disable-next-line no-param-reassign, func-names
        descriptor.value = async function (resourceID: string): Promise<StandardResponseInterface<void>> {
            const url = getResolvedRoute(realRoute, {
                ':resourceid': resourceID,
            });

            return new Promise((resolve, reject) => {
                (this as any).http.delete(url).subscribe(
                    (result: StandardResponseInterface<void>) => {
                        if (result) resolve(result);
                        else reject(new Error('No result returned'));
                    },
                    (err: Error) => {
                        reject(err);
                    }
                );
            });
        };

        return descriptor;
    };
}
