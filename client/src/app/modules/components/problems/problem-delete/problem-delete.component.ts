import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {Problem} from "@models/problem";
import {Subject} from "rxjs";
import {ProblemService} from "@services/problem.service";
import {ToastrService} from "ngx-toastr";

@Component({
  selector: 'app-problem-delete',
  templateUrl: './problem-delete.component.html',
  styleUrls: ['./problem-delete.component.scss']
})
export class ProblemDeleteComponent implements OnInit {

  @Input() isVisible: boolean;
  @Input() problem: Problem;
  @Output() onClose: EventEmitter<{}> = new EventEmitter();
  forceClose: Subject<any> = new Subject<any>();

  constructor(private _problemService: ProblemService,
              private toastr: ToastrService) {
  }

  ngOnInit() {
  }

  handleClose() {
    this.onClose.emit(false);
  }

  handleModalSubmit() {
    try{
      // send state to the db, and obtain back the ground truth that the db produces
      let result =  this._problemService.deleteProblem(this.problem.id);
      this.toastr.success('Successfully deleted problem');
      this.onClose.emit(true);
      this.forceClose.next();
    }catch(err){
      this.toastr.error('Failed to delete problem')
    }
  }

}
