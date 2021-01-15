import { Component, Input, OnInit } from '@angular/core';
import { Section } from '@dynrec/common';

@Component({
    selector: 'app-section-view',
    templateUrl: './section-view.component.html',
    styleUrls: ['./section-view.component.scss'],
})
export class SectionViewComponent implements OnInit {
    @Input() section: Section;

    constructor() {}

    ngOnInit(): void {}
}
