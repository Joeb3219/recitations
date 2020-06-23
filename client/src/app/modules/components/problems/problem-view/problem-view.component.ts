import {Component, Input, OnInit} from '@angular/core';
import {Problem} from "@models/problem";
import {ProblemDifficulty} from "@enums/problemDifficulty.enum";
import {User} from '@models/user'

@Component({
  selector: 'app-problem-view',
  templateUrl: './problem-view.component.html',
  styleUrls: ['./problem-view.component.scss']
})
export class ProblemViewComponent implements OnInit {

  constructor() {
  }

  isEditProblemModalOpen = false;
  @Input() problem: Problem;
  creator: string;
  showSolution = false;
  solutionButtonText = "Show Solution";

  // creator: User = this.problem.creator;

  ngOnInit() {
    this.creator = this.problem.creator.firstName + " " + this.problem.creator.lastName;

  }

  // pillColor(){
  //   document.getElementById("difficulty").style.background='#000000';
  // }

  get problemDifficulty() {
    return ProblemDifficulty;
  }

  handleSolutionButton() {
    this.showSolution = !this.showSolution;
    this.showSolution ? this.solutionButtonText = "Hide Solution" : this.solutionButtonText = "Show Solution";
  }

  handleOpenEditProblemModal() {
    this.isEditProblemModalOpen = true
  }

  handleCloseEditProblemModal() {
    this.isEditProblemModalOpen = false
  }




}
