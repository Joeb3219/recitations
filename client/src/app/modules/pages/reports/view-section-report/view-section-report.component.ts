import { Component } from '@angular/core';
import { Section } from '@dynrec/common';
import { LoadedArg, LoadedStringArg } from '../../../../decorators';
import { SectionService } from '../../../../services/section.service';

@Component({
    selector: 'app-view-section-report',
    templateUrl: './view-section-report.component.html',
    styleUrls: ['./view-section-report.component.scss'],
})
export class ViewSectionReportComponent {
    @LoadedArg(SectionService, Section, 'sectionID') section: Section;

    @LoadedStringArg('date')
    dateStr: string;

    getDate(): Date {
        return new Date(this.dateStr);
    }
}
