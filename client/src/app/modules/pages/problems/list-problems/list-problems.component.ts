import {ActivatedRoute, Router} from '@angular/router';
import { Component, OnInit, ViewEncapsulation, EventEmitter } from '@angular/core';
import {BehaviorSubject} from 'rxjs';

import {CourseService} from '@services/course.service';
import {ProblemService} from '@services/problem.service';

import {Course} from '@models/course'
import {Problem} from '@models/problem'
import {ProblemDifficulty} from "@enums/problemDifficulty.enum";
import {User} from "@models/user";
import { HttpFilterInterface } from '../../../../http/httpFilter.interface';

@Component({
  selector: 'app-list-problems',
  templateUrl: './list-problems.component.html',
  encapsulation: ViewEncapsulation.None,
  styleUrls: ['./list-problems.component.scss']
})
export class ListProblemsComponent implements OnInit {

  tableRows : Array<any>;
  tableColumns: Array<any> = [
    {
      prop: 'problemName',
      name: 'Problem Name'
    },
    {
      prop: 'difficulty',
      name: "Difficulty"
    },
    {
      prop: 'duration',
      name: "Est. Duration (min)"
    },
    {
      prop: 'creator',
      name: "Creator"
    },
    {
      prop: 'id',
      name: 'Actions',
      actions: ["modify", "delete", "view"]
    }
  ];

  course: Course;
  problems: Problem[];
  isLoading: boolean = true;

  refreshData: EventEmitter<any> = new EventEmitter();

  columns = [
    {
      name: 'Name',
      prop: 'name',
    },
    {
      name: 'Difficulty',
      prop: 'difficulty',
      cellTemplate: 'difficultyCell',
    },
    {
      name: 'Creator',
      prop: 'creator',
      cellTemplate: 'userCell',
    },
    {
      name: 'Actions',
      cellTemplate: 'actionsCell',
      actions: (row) => ([
        {
          text: 'View',
          href: `/courses/${ row.course.id }/problems/${ row.id }`
        },
        {
          text: 'Modify',
          click: () => this.handleOpenEditProblemModal(row),
        },
        {
          text: 'Delete',
          click: () => this.handleOpenDeleteProblemModal(row),
        }
      ]),
    }
  ]

  selectedEditProblem: Problem = null;
  selectedDeleteProblem: Problem = null;
  isEditProblemModalOpen: boolean = false;
  isDeleteProblemModalOpen: boolean = false;

  constructor(
    private _courseService: CourseService,
    private _problemService: ProblemService,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.fetchProblems = this.fetchProblems.bind(this);
  }

  ngOnInit() {
    this.route.params.subscribe(async (params) => {
      if (params['courseID']) {
        this.course = await this._courseService.getCourse(params['courseID'])
        this.isLoading = false
      }
    });
  }

  async fetchProblems(args: HttpFilterInterface) {
    return await this._problemService.getCourseProblems(this.course, args);
  }

  handleOpenNewProblemModal() {
    this.isEditProblemModalOpen = true

    this.selectedEditProblem = new Problem()
    this.selectedEditProblem.course = this.course;
  }

  handleCloseEditProblemModal() {
    this.isEditProblemModalOpen = false

    this.selectedEditProblem = null;

    this.refreshData.emit();
  }

  handleOpenEditProblemModal(problem: Problem) {
    this.isEditProblemModalOpen = true;
    this.selectedEditProblem = problem
  }

  handleOpenDeleteProblemModal(problem: Problem) {
    this.isDeleteProblemModalOpen=true;
    this.selectedDeleteProblem=problem;
  }

  handleCloseDeleteProblemModal($event){
    this.isDeleteProblemModalOpen=false;
    this.refreshData.emit();
  }

  getMinuteUnit(estimatedDuration: number) {
    return Problem.getMinuteUnit(estimatedDuration);
  }

  get problemDifficulty() {
    return ProblemDifficulty;
  }

  handleOnDelete($event: any) {
    let problemID = $event;
    let problem = this.problems.find(problem=>problem.id==problemID);
    this.handleOpenDeleteProblemModal(problem);
  }

  handleOnModify($event: any) {
    let problemID = $event;
    let problem = this.problems.find(problem=>problem.id==problemID);
    this.handleOpenEditProblemModal(problem);
  }

  handleOnView($event: any) {
    let problemID = $event;
    let problem = this.problems.find(problem=>problem.id==problemID);
    let courseID = this.course.id
    this.router.navigateByUrl(`/courses/${courseID}/problems/${problemID}`);
  }
}
