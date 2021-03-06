import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { Observable } from 'rxjs';

@Component({
    selector: 'app-modal',
    templateUrl: './modal.component.html',
    styleUrls: ['./modal.component.scss'],
})
export class ModalComponent implements OnInit {
    @ViewChild('modal', { static: false }) modal: NgbModal;

    openedModal?: NgbModalRef;

    @Output() onClose: EventEmitter<any> = new EventEmitter<any>();

    isModalOpen = false;

    @Input() forceClose: Observable<any> = new Observable();

    @Input() modalSize = 'lg';

    constructor(private modalService: NgbModal) {}

    ngOnInit() {
        this.forceClose.subscribe({
            next: () => {
                this.closeModal();
            },
        });
    }

    // We presently activate our modal via an *ngIf
    // when that ngIf is activated, ngAfterViewInit will be called
    // then, we can start the activation
    ngAfterViewInit() {
        setTimeout(() => {
            this.openedModal = this.modalService.open(this.modal, {
                backdrop: 'static',
                size: this.modalSize,
                windowClass: 'modal-holder',
            });

            this.openedModal.result.then(
                () => {
                    this.onClose.emit();
                },
                () => {
                    this.onClose.emit();
                }
            );
        });
    }

    closeModal() {
        if (this.openedModal) this.openedModal.dismiss('cancel click');
    }
}
