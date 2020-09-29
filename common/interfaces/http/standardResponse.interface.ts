export interface StandardResponseInterface<T> {
    metadata: {
        total?: number;
    };
    data: T;
    message: string;
}
