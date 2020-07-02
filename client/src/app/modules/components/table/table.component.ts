import {
  AfterViewInit,
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
  ViewChild,
  ViewEncapsulation
} from '@angular/core';
import {DatatableComponent} from "@swimlane/ngx-datatable";
import {fromEvent} from "rxjs";
import {debounceTime, map} from "rxjs/operators";


@Component({
  selector: 'app-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class TableComponent implements OnInit, AfterViewInit {

  @ViewChild('search', {static: false}) search: any;
  @ViewChild(DatatableComponent, {static: false}) table: DatatableComponent;
  @Input() rows: Array<any>;
  @Input() columns: Array<any>;

  temp: Array<any> = [];
  hasActionsColumn: boolean = false;
  actions: Array<any>;


  @Output() onDelete: EventEmitter<any> = new EventEmitter<any>();
  @Output() onView: EventEmitter<any> = new EventEmitter<any>();
  @Output() onModify: EventEmitter<any> = new EventEmitter<any>();



  constructor() {
  }

  ngOnInit() {
    this.temp = this.rows;
    if (this.rows) {
      this.hasActionsColumn = !!this.columns.find(column => column.prop === "id");
      this.actions = this.columns.find(column => column.prop === "id");
      this.columns=this.columns.filter(column=>column!=this.actions)
      // console.log("COLUMNS");
      // console.log(this.columns)
      // console.log("ACTIONS")
      // console.log(this.actions)

      // console.log(this.hasActionsColumn);
    }

  }

  ngAfterViewInit(): void {
    // Called after ngAfterContentInit when the component's view has been initialized. Applies to components only.
    // Add 'implements AfterViewInit' to the class.
    fromEvent(this.search.nativeElement, 'keydown')
      .pipe(
        debounceTime(150),
        map(x => x['target']['value'])
      )
      .subscribe(value => {
        this.updateFilter(value);
      });
  }

  updateFilter(val: any) {

    const value = val.toString().toLowerCase().trim();
    // get the amount of columns in the table
    const count = this.columns.length;
    // get the key names of each column in the dataset
    const keys = Object.keys(this.temp[0]);

    this.rows = this.temp.filter(function (item) {
      // iterate through each row's column data
      for (let i = 0; i < count; i++) {
        // check for a match
        if (
          (item[keys[i]] &&
            item[keys[i]]
              .toString()
              .toLowerCase()
              .indexOf(value) !== -1) ||
          !value
        ) {
          // found match, return true to add to result set
          return true;
        }
      }
    });

    // Whenever the filter changes, always go back to the first page
    this.table.offset = 0;
  }


  view(row) {
    console.log("view\n" + row.id)
    this.onView.emit(row.id)
  }

  edit(row) {
    console.log("edit\n" + row.id)
    this.onModify.emit()
  }

  delete(row) {
    console.log("delete\n" + row.id)
    this.onDelete.emit(row.id)
  }

  hasAction(act: string) {
    return (this.actions['actions'].indexOf(act)!=-1)
  }
}
