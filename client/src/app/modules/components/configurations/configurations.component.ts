import { Component, Input, OnInit } from '@angular/core';
import {
    Course,
    CourseSettingKey,
    CourseSettingSection,
    DefaultCourseSettings,
    Form,
    FormFieldUpdated,
    FormInput,
} from '@dynrec/common';
import { CourseService } from '@services/course.service';

type SettingSection = {
    section: CourseSettingSection;
    headerText: string;
    explanationText: string;
    form: Form;
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
            form: new Form(),
        },
        {
            section: 'quizzes',
            headerText: 'Quizzes',
            explanationText: 'These fields control various aspects of how and when quizzes are administered.',
            form: new Form(),
        },
    ];

    constructor(private courseService: CourseService) {}

    ngOnInit(): void {
        this.generateForms();
    }

    generateSectionForm(section: SettingSection): Form {
        const form = new Form();

        const mergedSections = this.course.getMergedSettings();

        form.inputs = (Object.keys(mergedSections) as CourseSettingKey[])
            .filter(key => mergedSections[key].section === section.section)
            .map(
                (key): FormInput => {
                    const input = mergedSections[key];
                    const inputType =
                        // eslint-disable-next-line no-nested-ternary
                        input.type === 'date' ? 'date' : input.type === 'number' ? 'number' : 'text';
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

        this.settingSections.forEach(section => {
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
            if (!(name in DefaultCourseSettings)) {
                return;
            }

            // Copy over the default
            this.course.settings[name as CourseSettingKey] = DefaultCourseSettings[name as CourseSettingKey];
        }

        this.course.settings[name as CourseSettingKey].value = value;
    }
}
