import { Component, Input, OnInit } from '@angular/core';
import { Course } from '@models/course';
import { Form, FormFieldUpdated, FormInput } from '@models/forms/form';
import { CourseService } from '@services/course.service';
import { DefaultCourseSettings } from '../../../../../../common/constants/courseSettings.constant';
import {
    CourseSettingKey,
    CourseSettingSection,
} from '../../../../../../common/interfaces/courseSetting.interface';

type SettingSection = {
    section: CourseSettingSection;
    headerText: string;
    explanationText: string;
    form?: Form;
};

@Component({
    selector: 'app-configurations',
    templateUrl: './configurations.component.html',
    styleUrls: ['./configurations.component.scss'],
})
export class ConfigurationsComponent implements OnInit {
    @Input() course: Course;

    settingSections: SettingSection[] = [
        {
            section: 'dates',
            headerText: 'Dates and Times',
            explanationText:
                'These fields control various dates and times that affect how courses run, when students can take various actions, and more.',
        },
    ];

    constructor(private courseService: CourseService) {}

    ngOnInit(): void {
        this.generateForms();
    }

    generateSectionForm(section: SettingSection): Form {
        const form = new Form();

        const mergedSections = this.course.getMergedSettings();

        form.inputs = Object.keys(mergedSections)
            .filter(
                (key: CourseSettingKey) =>
                    mergedSections[key].section === section.section
            )
            .map(
                (key: CourseSettingKey): FormInput => {
                    const input = mergedSections[key];
                    const inputType =
                        // eslint-disable-next-line no-nested-ternary
                        input.type === 'date'
                            ? 'date'
                            : input.type === 'number'
                            ? 'number'
                            : 'text';
                    return {
                        name: input.key,
                        options: 'values' in input ? input.values : undefined,
                        label: input.name,
                        type: inputType,
                        value: input.value ?? input.default,
                    };
                }
            );

        return form;
    }

    generateForms(): void {
        if (!this.course) return;

        this.settingSections.forEach((section) => {
            // eslint-disable-next-line no-param-reassign
            section.form = this.generateSectionForm(section);
        });
    }

    async handleSubmit(): Promise<void> {
        const result = await this.courseService.upsertCourse(this.course);
        this.course = result.data;
    }

    handleFieldUpdated({ name, value }: FormFieldUpdated): void {
        if (!this.course.settings) {
            this.course.settings = DefaultCourseSettings;
        }

        if (!(name in this.course.settings)) {
            return;
        }

        this.course.settings[name as CourseSettingKey].value = value;
    }
}
