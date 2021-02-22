import { Component, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { Course, CoverageRequest, User } from '@dynrec/common';
import _ from 'lodash';
import { LoadedArg } from '../../../../../decorators';
import { CourseService } from '../../../../../services/course.service';
import { CoverageRequestService } from '../../../../../services/coverageRequest.service';

type CoverageRequestByUserPayload = {
    accepted: CoverageRequest[];
    requested: CoverageRequest[];
    user: User;
};

@Component({
    selector: 'app-monitor-coverage-requests',
    templateUrl: './monitor-coverage-requests.component.html',
    styleUrls: ['./monitor-coverage-requests.component.scss'],
})
export class MonitorCoverageRequestsComponent implements OnInit, OnChanges {
    @LoadedArg(CourseService, Course, 'courseID')
    course: Course;

    activeTabIndex: number = 0;
    coverageRequests: CoverageRequest[];
    coverageRequestsByUser: CoverageRequestByUserPayload[];

    constructor(private readonly coverageRequestService: CoverageRequestService) {}

    ngOnInit(): void {
        this.loadRequests();
    }

    ngOnChanges(changes: SimpleChanges) {
        this.loadRequests();
    }

    async loadRequests() {
        const result = await this.coverageRequestService.getCourseCoverageRequests(this.course);
        this.coverageRequests = result.data;
        this.processResults();
    }

    processResults() {
        const uniqueUsers = _.uniqBy(
            _.compact(_.flatten(this.coverageRequests.map(request => [request.coveredBy, request.meetingTime.leader]))),
            u => u.id
        );
        this.coverageRequestsByUser = uniqueUsers.map(user => ({
            user,
            accepted: this.coverageRequests.filter(request => request.coveredBy?.id === user.id),
            requested: this.coverageRequests.filter(request => request.meetingTime.leader?.id === user.id),
        }));
    }
}
