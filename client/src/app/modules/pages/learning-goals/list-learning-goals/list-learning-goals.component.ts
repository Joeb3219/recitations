import { Component, EventEmitter, OnChanges, SimpleChanges } from '@angular/core';
import { DatatableColumn } from '@components/datatable/datatable.component';
import { Course, LearningGoal, LearningGoalCategory, StandardResponseInterface } from '@dynrec/common';
import { HttpFilterInterface } from '@http/httpFilter.interface';
import { CourseService } from '@services/course.service';
import { LearningGoalService } from '@services/learningGoal.service';
import { LoadedArg } from '../../../../decorators';

@Component({
    selector: 'app-list-learning-goals',
    templateUrl: './list-learning-goals.component.html',
    styleUrls: ['./list-learning-goals.component.scss'],
})
export class ListLearningGoalsComponent implements OnChanges {
    @LoadedArg(CourseService, Course, 'courseID')
    course: Course;

    categories?: LearningGoalCategory[];

    refreshData: EventEmitter<void> = new EventEmitter();

    columns: DatatableColumn<LearningGoalCategory>[] = [
        {
            name: 'Toggle Sub Goals',
            cellTemplateName: 'toggleCell',
        },
        {
            name: 'Number',
            cellTemplateName: 'editCell',
            prop: 'number',
            edit: category => ({
                type: 'number',
                value: category.number,
                name: 'number',
            }),
        },
        {
            name: 'Name',
            prop: 'name',
            cellTemplateName: 'editCell',
            edit: category => ({
                type: 'text',
                value: category.name,
                name: 'name',
            }),
        },
        {
            name: 'Actions',
            cellTemplate: 'actionsCell',
            actions: (row: LearningGoalCategory, isEditing) =>
                isEditing
                    ? [
                          {
                              text: 'Save',
                              action: 'save',
                              can: { action: 'update', subject: new LearningGoalCategory(row) },
                              click: async () => this.handleCategorySaved(row),
                          },
                      ]
                    : [
                          {
                              text: 'Modify',
                              action: 'edit',
                              can: { action: 'update', subject: new LearningGoalCategory(row) },
                          },
                          {
                              text: 'Delete',
                              can: { action: 'delete', subject: new LearningGoalCategory(row) },
                              click: () => this.handleOpenDeleteModal(row),
                          },
                      ],
        },
    ];

    selectedCategory?: LearningGoalCategory = undefined;

    isDeleteModalOpen = false;

    constructor(private readonly learningGoalsService: LearningGoalService) {
        this.fetchCategories = this.fetchCategories.bind(this);
        this.createNewCategory = this.createNewCategory.bind(this);
    }

    ngOnChanges(changes: SimpleChanges): void {
        if (changes) {
            this.refreshData.next();
        }
    }

    async handleCategorySaved(category: LearningGoalCategory) {
        return this.learningGoalsService.upsertLearningGoalCategory(category);
    }

    async fetchCategories(args: HttpFilterInterface): Promise<StandardResponseInterface<LearningGoalCategory[]>> {
        return this.learningGoalsService.getCourseLearningGoalCategories(this.course, args);
    }

    getLearningGoal(row: LearningGoalCategory) {
        return new LearningGoalCategory(row);
    }

    createNewCategory() {
        return new LearningGoalCategory({ course: this.course, goals: [] });
    }

    handleOpenDeleteModal(category: LearningGoalCategory) {
        this.isDeleteModalOpen = true;
        this.selectedCategory = category;
    }

    handleCloseDeleteModal() {
        this.isDeleteModalOpen = false;
        this.refreshData.emit();
    }

    handleNewLearningGoal(category: LearningGoalCategory) {
        category.goals.push(new LearningGoal());
    }

    handleDeleteLearningGoal(category: LearningGoalCategory, index: number) {
        if (index < category.goals.length) {
            category.goals.splice(index, 1);
        }
    }

    handleLearningGoalUpdated(
        category: LearningGoalCategory,
        goalIndex: number,
        field: keyof LearningGoal,
        data: { target?: { value: string } } | any
    ) {
        // eslint-disable-next-line no-param-reassign
        category.goals[goalIndex][field] = data.target?.value ?? data;
    }
}
