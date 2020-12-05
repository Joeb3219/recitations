import {
    ApplicationRef,
    Component,
    EventEmitter,
    Input,
    OnInit,
    TemplateRef,
    ViewChild,
    ViewEncapsulation,
} from '@angular/core';
import { FormFieldUpdated, FormInput, ProblemDifficulty, StandardResponseInterface, User } from '@dynrec/common';
import { HttpFilterInterface } from '@http/httpFilter.interface';
import { ColumnMode } from '@swimlane/ngx-datatable';
import _, { get } from 'lodash';
import { Subject } from 'rxjs';
import { debounceTime } from 'rxjs/operators';

export type DatatableColumnCellTemplateName = 'difficultyCell' | 'userCell' | 'actionsCell' | 'editCell' | 'toggleCell';

export interface DatatableAction {
    text: string;
    action?: 'edit' | 'save' | undefined;
    click?: () => Promise<unknown> | void;
    href?: string;
}

export type DatatableColumn<
    ResourceModel = any,
    CellTemplateName extends DatatableColumnCellTemplateName = DatatableColumnCellTemplateName
> = {
    name: string;
    cellTemplate?: DatatableColumnCellTemplateName | TemplateRef<unknown>;
    prop?: keyof ResourceModel;
    actions?: (row: ResourceModel, isEditing: boolean) => DatatableAction[];
    cellTemplateName?: CellTemplateName;
} & (CellTemplateName extends 'editCell'
    ? {
          edit: (object: ResourceModel) => Omit<FormInput, 'row' | 'col' | 'group' | 'hidden'>;
      }
    : {
          edit?: undefined;
      });

type Datatable<T> = {
    rowDetail: {
        toggleExpandRow: (data: T) => void;
    };
};

@Component({
    selector: 'app-datatable',
    templateUrl: './datatable.component.html',
    styleUrls: ['./datatable.component.scss'],
    encapsulation: ViewEncapsulation.None,
})
export class DatatableComponent<T extends { id?: string }> implements OnInit {
    @ViewChild('datatable') table: Datatable<T>;

    @ViewChild('difficultyCellTemplate', { static: true })
    difficultyCellTemplate: TemplateRef<unknown>;

    @ViewChild('detailToggleCellTemplate', { static: true })
    detailToggleCellTemplate: TemplateRef<unknown>;

    @ViewChild('userCellTemplate', { static: true })
    userCellTemplate: TemplateRef<unknown>;

    @ViewChild('actionsCellTemplate', { static: true })
    actionsCellTemplate: TemplateRef<unknown>;

    @ViewChild('editCellTemplate', { static: true })
    editCellTemplate: TemplateRef<unknown>;

    @Input() detailTemplate?: TemplateRef<unknown>;

    @Input() dataFunction: (args: HttpFilterInterface) => StandardResponseInterface<T[]>;

    @Input() createNewRow: () => T;

    @Input() reload: Subject<void> = new Subject<void>();

    @Input() columns: DatatableColumn<T>[] = [];

    @Input() pageSize = 25;

    @Input() enableSearching = true;

    @Input() enableExporting = true;

    // an object where each key is a template, and its value is a function
    // these functions are used to signify what happens when a CSV is created with the template
    // these will override the defaults provided by the datatable, or create new ones if there isn't one.
    @Input() csvTemplateOverrides: any = {};

    @Input() csvFileName?: () => string = undefined;

    // Rows fetched from the database
    fetchedRows: T[] = [];
    // Rows added or edited by the user
    editedRows: T[] = [];
    // All of the rows, merged.
    rows: T[] = [];

    editedIndices: number[] = [];

    reorderable = true;

    // Number of results in the database
    numFetchedResults = 0;
    // Number of total results.
    numResults = 0;

    offset = 0;

    sortDirection: 'desc' | 'asc' = 'desc';

    sort?: string = undefined;

    search?: string = undefined;

    searchDebouncer: EventEmitter<string> = new EventEmitter<string>();

    ColumnMode = ColumnMode;

    ProblemDifficulty = ProblemDifficulty;

    constructor(private applicationRef: ApplicationRef) {}

    ngAfterViewInit(): void {
        this.updateColumnDefs();
    }

    ngOnInit(): void {
        this.reload.subscribe({
            next: () => {
                this.loadData();
            },
        });

        this.searchDebouncer
            .pipe(debounceTime(200)) // Debounce the inputs so we don't constantly hit the API if the user is still typing
            .subscribe(() => {
                this.loadData();
            });

        this.loadData();
    }

    async handleActionClicked(index: number, action: DatatableAction) {
        const result = await action.click?.();

        switch (action.action) {
            case 'save':
                if (!result) return;
                if (this.rows[index].id) {
                    const editedIndex = this.editedRows.findIndex(row => row.id === this.rows[index].id);
                    if (editedIndex === -1) return;

                    this.editedRows.splice(editedIndex, 1);
                } else {
                    this.editedRows.splice(index, 1);
                }

                this.loadData();
                break;
            case 'edit':
                if (this.editedIndices.includes(index)) return;
                this.editedRows.push(this.rows[index]);
                this.refreshDataCharacteristics();
                break;
            default:
                break;
        }
    }

    handleNewRowCreated() {
        if (!this.createNewRow) {
            throw new Error('No row creation function provided.');
        }

        this.editedRows.push(this.createNewRow());
        this.refreshDataCharacteristics();
    }

    onFieldChange(index: number, data: FormFieldUpdated) {
        // This is a real row, so we can simply find it and update.
        if (this.rows[index].id) {
            const editedIndex = this.editedRows.findIndex(row => row.id === this.rows[index].id);
            if (editedIndex === -1) return;

            this.editedRows[editedIndex] = { ...this.editedRows[editedIndex], [data.name]: data.value };
        } else {
            this.editedRows[index] = { ...this.editedRows[index], [data.name]: data.value };
        }

        this.refreshDataCharacteristics();
    }

    // Returns all of the templates in our system, arranged by key.
    // Each object contains a template identifying the viewchild template to render,
    // as well as possibly other values, like a csv function to use when generating a csv
    getTemplates(): {
        [K in DatatableColumnCellTemplateName]: {
            template: TemplateRef<any>;
            csv?: (prop: any | undefined, row: unknown) => unknown;
        };
    } {
        return {
            difficultyCell: {
                template: this.difficultyCellTemplate,
                csv: difficulty => difficulty,
            },
            userCell: {
                template: this.userCellTemplate,
                csv: (user: User | undefined) =>
                    user ? `${user.firstName} ${user.lastName} (${user.username})` : undefined,
            },
            actionsCell: {
                template: this.actionsCellTemplate,
            },
            editCell: {
                template: this.editCellTemplate,
                csv: val => val,
            },
            toggleCell: {
                template: this.detailToggleCellTemplate,
            },
        };
    }

    // Returns a list of CSV formats, potentially modified
    getCSVFormats(): {
        [K in DatatableColumnCellTemplateName]: {
            template: TemplateRef<any>;
            csv?: (prop: unknown, row: unknown) => unknown;
        };
    } {
        const allFormats = this.getTemplates();

        // Now we go through the overrides provided and redefine (or define) any key => functions.
        if (this.csvTemplateOverrides) {
            Object.keys(this.csvTemplateOverrides).forEach((templateKey: string) => {
                allFormats[templateKey as DatatableColumnCellTemplateName].csv = this.csvTemplateOverrides[templateKey];
            });
        }

        return allFormats;
    }

    // Generates and downloads a CSV for the datatable
    async handleCSVExport(): Promise<void> {
        const csvStringWrap = (str: string) => {
            const escapedStr = `${str}`.replace(/"/g, '""');
            return `"${escapedStr}"`;
        };

        // We first must generate a listing of all rows in the system + their respective column displays
        const excludedTemplates: DatatableColumnCellTemplateName[] = ['actionsCell', 'toggleCell'];

        const csvFormats = this.getCSVFormats();

        // Remove any columns from our mapping in which the cell template should never be printed to CSV
        // the most obvious case here is the actions cell, which should really never be printed.
        const includedColumns = this.columns.filter(
            ({ cellTemplateName }) => cellTemplateName && !excludedTemplates.includes(cellTemplateName)
        );

        // Now we fetch _every_ row, as the CSV should not just show the local table, but rather all data.
        const allData = await this.dataFunction({
            limit: -1,
        });

        const headers = includedColumns.map(({ name }) => csvStringWrap(name)).join(',');

        const csvRows = allData.data.map((row: unknown) => {
            const rowCells = includedColumns.map(({ cellTemplateName, prop }) => {
                const value = get(row, prop ?? '');

                return cellTemplateName ? csvFormats[cellTemplateName]?.csv?.(value, row) ?? value : value;
            });

            // Join all cells within the row w/ a comma, as they're already escaped
            return rowCells.join(',');
        });

        const csv = [headers, ...csvRows].join('\r\n');
        this.downloadFile(csv);
    }

    // Adapted from https://stackoverflow.com/questions/51806464/how-to-create-and-download-text-json-file-with-dynamic-content-using-angular-2
    downloadFile(contents: string): void {
        const element = document.createElement('a');
        const fileType = 'text/csv';
        const fileName = this.csvFileName ? this.csvFileName() : `csv_export.csv`;

        element.setAttribute('href', `data:${fileType};charset=utf-8,${encodeURIComponent(contents)}`);
        element.setAttribute('download', fileName);

        const event = new MouseEvent('click');
        element.dispatchEvent(event);
    }

    handleRowToggle(row: T) {
        this.table.rowDetail.toggleExpandRow(row);
    }

    handleSort(sort: { sorts: { prop: string; dir: 'asc' | 'desc' }[] }) {
        const sorts = sort?.sorts;
        if (!sorts || !sorts.length) return;

        this.sort = sorts[0].prop;
        this.sortDirection = sorts[0].dir;

        this.loadData();
    }

    handleSearchTextUpdated(): void {
        this.searchDebouncer.next(this.search);
    }

    handlePageChange(page: { offset: number }): void {
        this.offset = page.offset;
        this.loadData();
    }

    updateColumnDefs(): void {
        if (!this.columns) return;

        const allTemplates = this.getTemplates();

        this.columns.forEach(column => {
            // Sets cell template to the defined one in our map if it is in the map, or uses the already set one otherwise.
            if (!column.cellTemplateName && typeof column.cellTemplate === 'string') {
                // eslint-disable-next-line no-param-reassign
                column.cellTemplateName = column.cellTemplate;
            }

            if (!column.cellTemplateName) return;

            // eslint-disable-next-line no-param-reassign
            column.cellTemplate = allTemplates[column.cellTemplateName].template ?? column.cellTemplate;
        });
    }

    mergedRows() {
        const editedById = _.keyBy(this.editedRows, 'id');
        const overwrittenIds = _.intersectionBy(this.fetchedRows, this.editedRows, 'id');

        const newRows = this.editedRows.filter(row => !overwrittenIds.find(subRow => subRow.id === row.id));

        this.rows = [
            ...newRows,
            ...this.fetchedRows.map(row => ({ ...row, ...(row.id ? editedById[row.id] ?? {} : {}) })),
        ];

        const fetchedEditedIndicex = this.fetchedRows.reduce<number[]>((state, row, index) => {
            if (!row.id || !editedById[row.id]) return state;
            state.push(index);
            return state;
        }, []);

        this.editedIndices = [..._.range(newRows.length), ...fetchedEditedIndicex];
    }

    refreshDataCharacteristics() {
        this.mergedRows();

        const overwritten = _.intersectionBy(this.fetchedRows, this.editedRows, 'id');
        this.numResults = this.numFetchedResults + this.editedRows.length - overwritten.length;

        this.applicationRef.tick();
    }

    async loadData(): Promise<void> {
        // First, we update columns to have correct data
        this.updateColumnDefs();

        const { data, metadata } = await this.dataFunction({
            limit: this.pageSize,
            offset: this.offset,
            sort: this.sort,
            sortDirection: this.sortDirection,
            search: this.search,
        });

        this.fetchedRows = data;
        this.numFetchedResults = metadata.total || 0;

        this.refreshDataCharacteristics();
    }
}
