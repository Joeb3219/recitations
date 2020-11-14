import 'reflect-metadata';
import { BaseEntity } from 'typeorm';
import { HttpArgs } from '../helpers/route.helper';

// eslint-disable-next-line @typescript-eslint/ban-types
export function Controller<T extends { new (...args: unknown[]): {} }>(
    target: T
): T {
    Reflect.defineMetadata('controllers', true, target);
    return target;
}

export type SortableDataDictionaryType<
    ResourceModel extends BaseEntity = any
> = {
    [key: string]: (object: ResourceModel) => any;
};

export type SortableData<ResourceModel extends BaseEntity = any> = {
    dataDictionary: SortableDataDictionaryType<ResourceModel>;
    defaultSortKey?: undefined;
    defaultSortDir?: string;
};

export type SearchableData = string[];

export interface ResourceArgs<ResourceModel extends BaseEntity = any> {
    sortable?: SortableData<ResourceModel>;
    searchable?: SearchableData;
    dataDict: (args: HttpArgs<ResourceModel>) => Partial<ResourceModel>;
}

export type ResourceAction = 'create' | 'update' | 'delete' | 'get' | 'list';

export function Resource<ResourceModel extends BaseEntity>(
    // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types, @typescript-eslint/no-explicit-any
    resourceModel: new () => ResourceModel,
    args: ResourceArgs<ResourceModel>,
    generatedFunctions: ResourceAction[] = [
        'create',
        'update',
        'delete',
        'get',
        'list',
    ]
) {
    // eslint-disable-next-line @typescript-eslint/ban-types
    return function <T extends { new (...args: unknown[]): {} }>(target: T): T {
        const metadata = Reflect.getMetadata('resources', target) || [];
        metadata.push({
            target,
            resourceName: resourceModel.name.toLowerCase(),
            resourceModel,
            args,
            generatedFunctions,
        });

        Reflect.defineMetadata('resources', metadata, target);

        return target;
    };
}
