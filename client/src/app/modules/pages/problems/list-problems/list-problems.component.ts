import {Component, OnInit, ViewEncapsulation} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {BehaviorSubject} from 'rxjs';

import {CourseService} from '@services/course.service';
import {ProblemService} from '@services/problem.service';

import {Course} from '@models/course'
import {Problem} from '@models/problem'
import {ProblemDifficulty} from "@enums/problemDifficulty.enum";
import {User} from "@models/user";

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
  }

  ngOnInit() {
    this.route.params.subscribe(async (params) => {
      if (params['courseID']) {
        this.course = await this._courseService.getCourse(params['courseID'])
        this.problems = await this._problemService.getCourseProblems(this.course)
        this.isLoading = false;

        this.tableRows = this.getTableRows();
      }
    });
  }

  getTableRows(){
    return this.problems.map(problem => ({
      problemName: problem.name,
      difficulty: ProblemDifficulty[problem.difficulty],
      duration: problem.estimatedDuration,
      creator: User.getFullName(problem.creator),
      id: problem.id
    }));
  }

  handleOpenNewProblemModal() {
    this.isEditProblemModalOpen = true

    this.selectedEditProblem = new Problem()
    this.selectedEditProblem.course = this.course;
  }

  handleCloseEditProblemModal() {
    this.isEditProblemModalOpen = false

    // And now we add the problem if needed
    // We perform a search for if there is a problem with that id already
    const foundProblem = this.problems.find((problem) => {
      if (problem.id == this.selectedEditProblem.id) return true
    })

    // if the problem was found, we already have it in our array, and the data would be updated via the component
    // if it wasn't found, we insert it new.
    if (!foundProblem) this.problems.push(this.selectedEditProblem);

    this.tableRows=this.getTableRows();
    this.selectedEditProblem = null;
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

    if($event){
      this.problems.splice(this.problems.indexOf(this.selectedDeleteProblem), 1);
    }
    this.tableRows=this.getTableRows();

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
