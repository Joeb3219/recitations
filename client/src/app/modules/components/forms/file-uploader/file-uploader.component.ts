import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { Course } from '@dynrec/common';
import { environment } from '@environment';
import { FileUploader } from 'ng2-file-upload';

@Component({
    selector: 'app-file-uploader',
    templateUrl: './file-uploader.component.html',
    styleUrls: ['./file-uploader.component.scss'],
})
export class FileUploaderComponent implements OnInit, OnChanges {
    @Input() course: Course;
    @Input() hidden: boolean = false;

    uploader?: FileUploader = undefined;

    @Output() onChange = new EventEmitter<string | undefined>();

    ngOnInit(): void {}

    ngOnChanges(changes: SimpleChanges) {
        if (this.course) {
            const token = localStorage.getItem('jwt');
            this.uploader = new FileUploader({
                url: `${environment.apiURL}/course/${this.course.id}/upload`,
                autoUpload: true,
                authToken: token ? `Bearer ${token}` : undefined,
            });
            this.uploader.onBeforeUploadItem = item => {
                // eslint-disable-next-line no-param-reassign
                item.withCredentials = false;
            };
            this.uploader.onCompleteItem = (item, response: string, status: any) => {
                if (status !== 200) {
                    this.onChange.emit(undefined);
                    return;
                }

                const parsedResponse = JSON.parse(response);
                if (parsedResponse.data) {
                    this.onChange.emit(parsedResponse.data);
                }
            };
        }
    }
}
