import { Provider } from '@angular/core';
import 'reflect-metadata';

export function LoadedArg<ResourceModel>(service: Provider, resource: new () => ResourceModel, stub: string) {
    // eslint-disable-next-line func-names,  @typescript-eslint/ban-types
    return function (target: Object, propertyKey: string): void {
        const currentMetadata = Reflect.getMetadata('loadedArgs', target) || [];

        currentMetadata.push({
            service,
            propertyKey,
            target,
            resource,
            stub,
        });

        Reflect.defineMetadata('loadedArgs', currentMetadata, target);

        Object.defineProperty(target, propertyKey, {
            configurable: true,
            writable: true,
        });
    };
}

export function LoadedStringArg<ResourceModel>(stub: string) {
    // eslint-disable-next-line func-names,  @typescript-eslint/ban-types
    return function (target: Object, propertyKey: string): void {
        const currentMetadata = Reflect.getMetadata('loadedStringArgs', target) || [];

        currentMetadata.push({
            propertyKey,
            target,
            stub,
        });

        Reflect.defineMetadata('loadedStringArgs', currentMetadata, target);

        Object.defineProperty(target, propertyKey, {
            configurable: true,
            writable: true,
        });
    };
}
