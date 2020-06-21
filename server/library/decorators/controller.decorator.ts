import "reflect-metadata";

export function Controller <T extends { new (...args: any[]): {} }> (target: T) {
	Reflect.defineMetadata("controllers", true, target);
	return target;
}