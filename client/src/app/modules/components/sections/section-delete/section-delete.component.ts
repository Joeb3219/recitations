import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {Subject} from "rxjs";
import {Section} from "@models/section";
import {SectionService} from "@services/section.service";
import {ToastrService} from "ngx-toastr";
import {User} from "@models/user";

@Component({
  selector: 'app-section-delete',
  templateUrl: './section-delete.component.html',
  styleUrls: ['./section-delete.component.scss']
})
export class SectionDeleteComponent implements OnInit {

  @Input() isVisible: boolean;
  @Input() section: Section;
  @Output() onClose: EventEmitter<{}> = new EventEmitter();
  forceClose: Subject<any> = new Subject<any>();

  constructor(private _sectionService: SectionService, private toastr: ToastrService) {
  }

  ngOnInit() {
  }

  handleClose() {
    this.onClose.emit(false);
  }

  handleModalSubmit() {
    try {
      // send state to the db, and obtain back the ground truth that the db produces
      let result = this._sectionService.deleteSection(this.section.id);
      this.toastr.success('Successfully deleted section');
      this.onClose.emit(true);
      this.forceClose.next();
    } catch (err) {
      this.toastr.error('Failed to delete section')
    }
  }

  getUserFullName(user: User){
    return User.getFullName(user);
  }


}
