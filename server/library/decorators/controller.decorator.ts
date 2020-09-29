import 'reflect-metadata';

// eslint-disable-next-line @typescript-eslint/ban-types
export function Controller<T extends { new (...args: unknown[]): {} }>(
    target: T
): T {
    Reflect.defineMetadata('controllers', true, target);
    return target;
}
