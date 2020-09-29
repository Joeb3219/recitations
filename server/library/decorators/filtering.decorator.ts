import 'reflect-metadata';

export const Searchable = (searchPaths: any[]): any => {
    return function (
        target: any,
        propertyKey: string,
        descriptor: PropertyDescriptor
    ): any {
        Reflect.defineMetadata('searchable', searchPaths, target);
        return descriptor;
    };
};

export const Sortable = (
    dataDictionary: any,
    defaultSortKey: string = undefined,
    defaultSortDir = 'desc'
): any => {
    return function (
        target: any,
        propertyKey: string,
        descriptor: PropertyDescriptor
    ): any {
        Reflect.defineMetadata(
            'sortable',
            { dataDictionary, defaultSortKey, defaultSortDir },
            target
        );
        return descriptor;
    };
};

export const Paginated = (): any => {
    return function (
        target: any,
        propertyKey: string,
        descriptor: PropertyDescriptor
    ): any {
        Reflect.defineMetadata('paginated', true, target);
        return descriptor;
    };
};
