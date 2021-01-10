import 'reflect-metadata';

export const Unauthenticated = (): any => {
    return function (target: any, propertyKey: string, descriptor: PropertyDescriptor): any {
        Reflect.defineMetadata('unauthenticated', true, target, propertyKey);
        return descriptor;
    };
};

export const Permission = (action: string | string[]): any => {
    return function (target: any, propertyKey: string, descriptor: PropertyDescriptor): any {
        const existingMetadata = Reflect.getMetadata('permission', target, propertyKey) ?? [];
        const newMetadata = Array.isArray(action) ? action : [action];
        Reflect.defineMetadata('permission', [...existingMetadata, ...newMetadata], target);
        return descriptor;
    };
};
