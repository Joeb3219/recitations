import "reflect-metadata";

export const Unauthenticated = () : any => {
	return function(target: any, propertyKey: string, descriptor: PropertyDescriptor) : any {
		Reflect.defineMetadata("unauthenticated", true, target);
		return descriptor;
	}
}