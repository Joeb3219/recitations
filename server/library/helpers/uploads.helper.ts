import multer from 'multer';

export class UploadsHelper {
    static getMulter() {
        return multer({ storage: multer.memoryStorage() });
    }
}
