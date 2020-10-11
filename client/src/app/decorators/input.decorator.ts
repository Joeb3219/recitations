import { Provider } from '@angular/core';
import 'reflect-metadata';

export function LoadedArg<ResourceModel>(
    service: Provider,
    resource: new () => ResourceModel,
    stub: string
) {
    // eslint-disable-next-line func-names, @typescript-eslint/explicit-module-boundary-types
    return function (target, propertyKey: string) {
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

        return target;
    };
}
