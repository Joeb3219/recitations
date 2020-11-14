import 'reflect-metadata';
import { HttpMethods } from '../helpers/route.helper';

const Request = (method: HttpMethods) => (route: string): any => {
    return function (
        target: any,
        propertyKey: string,
        descriptor: PropertyDescriptor
    ): any {
        const metadata = Reflect.getMetadata('routes', target) || [];

        metadata.push({
            target,
            method,
            route,
            propertyKey,
        });

        Reflect.defineMetadata('routes', metadata, target);

        return descriptor;
    };
};

export const GetRequest = Request('get');
export const PostRequest = Request('post');
export const PutRequest = Request('put');
export const DeleteRequest = Request('delete');
