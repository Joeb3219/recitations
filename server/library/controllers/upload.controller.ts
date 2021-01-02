import Boom from '@hapi/boom';
import { Controller, PostRequest } from '../decorators';
import { HttpArgs } from '../helpers/route.helper';

@Controller
export class UploadController {
    @PostRequest('/course/:courseID/upload')
    async uploadFile({ file }: HttpArgs): Promise<string> {
        if (!file || !file.tempFilePath) {
            throw Boom.badRequest('Bad file upload');
        }

        return file.tempFilePath;
    }
}
