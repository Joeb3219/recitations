import { Component } from '@angular/core';
import { Problem } from '@models/problem';
import { ProblemService } from '@services/problem.service';
import { LoadedArg } from 'src/app/decorators';

@Component({
    selector: 'app-view-problem',
    templateUrl: './view-problem.component.html',
    styleUrls: ['./view-problem.component.scss'],
})
export class ViewProblemComponent {
    @LoadedArg(ProblemService, Problem, 'problemID')
    problem: Problem;
}
