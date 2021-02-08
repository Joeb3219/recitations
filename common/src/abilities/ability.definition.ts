import dayjs from 'dayjs';
import _ from 'lodash';
import { Course, CoverageRequest, Lesson, LessonPlanStep, MeetingTime, Problem, Role, Section, User } from '../models';
import { GradebookOverride } from '../models/gradebookOverride';
import { LearningGoalCategory } from '../models/learningGoalCategory';
import { LessonPlan } from '../models/lessonPlan';
import { MeetingReport } from '../models/meetingReport';
import { Quiz } from '../models/quiz';
import { StudentMeetingReport } from '../models/studentMeetingReport';

export type RawRuleConditions<Resource extends any> = {
    [K in keyof Resource]?: any;
};

export type RuleAction = 'view' | 'update' | 'create' | 'delete' | 'use';
export type RuleTag =
    | 'student'
    | 'ta'
    | 'professor'
    | 'user'
    | 'course_admin'
    | 'super_admin'
    | 'course_creator'
    | 'ta_manager';

export class RawRule<Resource extends any = any> {
    action: RuleAction;
    subject: string | (new () => Resource);
    fields?: string[];
    validate?: Resource extends string ? undefined : (instance: Resource) => boolean;
    inverted?: boolean;
    course?: Course;
}

export class Ability {
    rules: RawRule[];

    constructor(rules: RawRule[]) {
        this.rules = rules;
    }

    private validate<Resource extends any>(matchingRule: RawRule<Resource>, instance: Resource): boolean {
        return !matchingRule.validate
            ? !matchingRule.inverted
            : matchingRule.validate(instance) === !matchingRule.inverted;
    }

    private validateOnCourse<Resource extends any>(matchingRule: RawRule<Resource>, course: Course): boolean {
        return !matchingRule.inverted === (matchingRule.course?.id === course.id);
    }

    can<Resource extends any>(
        action: RuleAction,
        instance: string | Resource,
        allowMissingRules: boolean = false
    ): boolean {
        const matchingRules = this.rules.filter(
            rule =>
                rule.action === action &&
                (typeof instance === 'string' || typeof rule.subject === 'string'
                    ? rule.subject === instance
                    : instance instanceof rule.subject)
        );

        // No rules found, so no permission granted.
        if (!allowMissingRules && !matchingRules.length) {
            return false;
        }

        return _.some(matchingRules.map(rule => this.validate(rule, instance)));
    }

    existsOnCourse<Resource extends any>(
        action: RuleAction,
        instance: string | Resource,
        existsOnCourse: Course
    ): boolean {
        const matchingRules = this.rules.filter(
            rule =>
                rule.action === action &&
                ((typeof instance === 'string' || typeof rule.subject === 'string'
                    ? rule.subject === instance
                    : instance instanceof rule.subject) ||
                    rule.subject === instance)
        );

        // No rules found, so no permission granted.
        if (!matchingRules.length) {
            return false;
        }

        return _.some(matchingRules.map(rule => this.validateOnCourse(rule, existsOnCourse)));
    }
}

export class AbilityDef {
    id: string;
    name: string;
    isGlobal: boolean;
    actions: RawRule[];
}

export class AbilityGenerator {
    id: string;
    name: string;
    tags?: RuleTag[];
    isGlobal?: boolean;
    actions: (user?: User, course?: Course) => RawRule[];
}

const safeIdComparison = (id?: string, obj?: { id: string } | string) =>
    !!id && !!obj && (typeof obj === 'string' ? obj === id : !!obj.id && obj.id === id);

export const ABILITY_GENERATORS: AbilityGenerator[] = [
    {
        id: '929a5259-912d-43da-9bc0-8a4dce6fa825',
        name: 'View all course sections',
        tags: ['professor', 'course_admin', 'course_creator', 'super_admin'],
        actions: (user, course) => [
            {
                action: 'view',
                subject: Section,
                validate: (instance: Section) => !!course && safeIdComparison(course.id, instance.course),
            },
        ],
    },
    {
        id: '946d2945-f09b-4e81-a574-bf2f9f1d1cca',
        name: 'Update all course sections',
        tags: ['course_admin', 'course_creator', 'super_admin'],
        actions: (_user, course) => [
            {
                action: 'update',
                subject: Section,
                validate: (instance: Section) => !!course && safeIdComparison(course.id, instance.course),
            },
        ],
    },
    {
        id: '6901f58f-aef0-4dfc-8910-3610af8574f8',
        name: 'Delete course sections',
        tags: ['course_admin', 'course_creator', 'super_admin'],
        actions: (_user, course) => [
            {
                action: 'delete',
                subject: Section,
                validate: (instance: Section) => !!course && safeIdComparison(course.id, instance.course),
            },
        ],
    },
    {
        id: 'e7d708b7-c786-4ed2-81f1-ce2ac0f3fbff',
        name: 'Create course sections',
        tags: ['course_admin', 'course_creator', 'super_admin'],
        actions: (_user, course) => [
            {
                action: 'create',
                subject: Section,
                validate: (instance: Section) => !!course && safeIdComparison(course.id, instance.course),
            },
        ],
    },
    {
        id: 'f7572352-6048-4cf5-998c-2fdb0026495a',
        name: 'View assigned sections in course',
        tags: ['professor', 'ta', 'student', 'course_admin', 'course_creator', 'super_admin'],
        actions: (user, course) => [
            {
                action: 'view',
                subject: Section,
                validate: (instance: Section) =>
                    !!course &&
                    safeIdComparison(course.id, instance.course) &&
                    (!!instance.students?.find(student => safeIdComparison(user?.id, student)) ||
                        safeIdComparison(user?.id, instance.ta) ||
                        safeIdComparison(user?.id, instance.instructor) ||
                        !!course?.coverageRequests?.find(
                            request =>
                                safeIdComparison(user?.id, request.coveredBy?.id) &&
                                instance.meetingTimes?.find(time => time.id === request.meetingTime.id)
                        )),
            },
        ],
    },
    {
        id: '356e8044-2ae3-49a6-8798-824d4222dd3b',
        name: 'View assigned meeting times',
        tags: ['professor', 'ta', 'student', 'course_admin', 'course_creator', 'super_admin'],
        actions: (user, course) => [
            {
                action: 'view',
                subject: MeetingTime,
                validate: (instance: MeetingTime) =>
                    !!course &&
                    (safeIdComparison(user?.id, instance.leader) ||
                        !!course?.coverageRequests?.find(
                            request =>
                                safeIdComparison(user?.id, request.coveredBy?.id) &&
                                instance.id === request.meetingTime.id
                        )),
            },
        ],
    },
    {
        id: '41c6dde1-6e3d-4208-b712-3c2482880b64',
        name: 'View all meeting times in course',
        tags: ['professor', 'course_admin', 'course_creator', 'super_admin'],
        actions: (user, course) => [
            {
                action: 'view',
                subject: MeetingTime,
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                validate: (instance: MeetingTime) => !!course && (instance.meetable as any)?.course?.id === course.id,
            },
        ],
    },
    {
        id: '8d788f89-be72-4621-97c2-bb13902131e4',
        name: 'View course gradebook overrides',
        tags: ['course_admin', 'course_creator', 'super_admin'],
        actions: (user, course) => [
            {
                action: 'view',
                subject: GradebookOverride,
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                validate: (instance: GradebookOverride) => !!course && safeIdComparison(course.id, instance.course),
            },
        ],
    },
    {
        id: 'a48d514f-3fc5-4216-9751-f108ed73e97d',
        name: 'Create course gradebook overrides',
        tags: ['course_admin', 'course_creator', 'super_admin'],
        actions: (user, course) => [
            {
                action: 'create',
                subject: GradebookOverride,
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                validate: (instance: GradebookOverride) => !!course && safeIdComparison(course.id, instance.course),
            },
        ],
    },
    {
        id: 'c4048ed3-88dc-428d-8704-614113c85cc4',
        name: 'Update course gradebook overrides',
        tags: ['course_admin', 'course_creator', 'super_admin'],
        actions: (user, course) => [
            {
                action: 'update',
                subject: GradebookOverride,
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                validate: (instance: GradebookOverride) => !!course && safeIdComparison(course.id, instance.course),
            },
        ],
    },
    {
        id: '993cb0e5-f8cc-4307-8add-66f4565894c1',
        name: 'Delete course gradebook overrides',
        tags: ['course_admin', 'course_creator', 'super_admin'],
        actions: (user, course) => [
            {
                action: 'delete',
                subject: GradebookOverride,
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                validate: (instance: GradebookOverride) => !!course && safeIdComparison(course.id, instance.course),
            },
        ],
    },
    {
        id: '654b03b1-14bb-4c65-aa46-3d168b34e43b',
        name: 'View own course gradebook',
        tags: ['student'],
        actions: () => [
            {
                action: 'view',
                subject: 'gradebook',
            },
        ],
    },
    {
        id: '59713b50-9be9-4499-a19a-10a6ec2962b1',
        name: 'Update assigned sections in course',
        tags: ['course_admin', 'course_creator', 'super_admin'],
        actions: (user, course) => [
            {
                action: 'update',
                subject: Section,
                validate: (instance: Section) =>
                    !!course &&
                    safeIdComparison(course.id, instance.course) &&
                    (safeIdComparison(user?.id, instance.ta) || safeIdComparison(user?.id, instance.instructor)),
            },
        ],
    },
    {
        id: '495aed43-7730-4ee7-b185-650e771e4c9a',
        name: 'View coverage requests in course',
        tags: ['course_admin', 'ta_manager', 'course_creator', 'ta', 'super_admin'],
        actions: (user, course) => [
            {
                action: 'view',
                subject: CoverageRequest,
                validate: (instance: CoverageRequest) => !!course && safeIdComparison(course.id, instance.course),
            },
        ],
    },
    {
        id: '14bd608b-2e44-401a-bb13-c3e70cef1162',
        name: 'Create coverage requests in course',
        tags: ['course_admin', 'course_creator', 'ta', 'super_admin'],
        actions: (user, course) => [
            {
                action: 'create',
                subject: CoverageRequest,
                validate: (instance: CoverageRequest) =>
                    !!course &&
                    !!user &&
                    safeIdComparison(course.id, instance.course) &&
                    safeIdComparison(user.id, instance.meetingTime.leader),
            },
        ],
    },
    {
        id: '5a96ade0-041a-45d5-9c7d-3777a61a40f9',
        name: 'Delete own coverage requests in course',
        tags: ['course_admin', 'course_creator', 'ta', 'super_admin'],
        actions: (user, course) => [
            {
                action: 'delete',
                subject: CoverageRequest,
                validate: (instance: CoverageRequest) =>
                    !!course &&
                    !!user &&
                    safeIdComparison(course.id, instance.course) &&
                    safeIdComparison(user.id, instance.meetingTime.leader),
            },
        ],
    },
    {
        id: 'f29090f8-6d4a-4ace-8ef6-9dca6ae01604',
        name: 'Respond to coverage requests in course',
        tags: ['course_admin', 'course_creator', 'ta', 'super_admin'],
        actions: (user, course) => [
            {
                action: 'use',
                subject: CoverageRequest,
                validate: (instance: CoverageRequest) => !!course && safeIdComparison(course.id, instance.course),
            },
        ],
    },
    {
        id: 'd026fcd5-61ce-4fdd-90c3-74601cd8dec8',
        name: 'View all problems',
        tags: ['student', 'ta', 'professor', 'course_admin', 'course_creator', 'super_admin'],
        actions: (_user, course) => [
            {
                action: 'view',
                subject: Problem,
                validate: instance => !!course && safeIdComparison(course.id, instance.course),
            },
        ],
    },
    {
        id: '656c65b4-fe3d-4d9a-b891-3f949eab36c2',
        name: 'Update all course problems',
        tags: ['professor', 'course_admin', 'course_creator', 'super_admin'],
        actions: (_user, course) => [
            {
                action: 'update',
                subject: Problem,
                validate: instance => !!course && safeIdComparison(course.id, instance.course),
            },
        ],
    },
    {
        id: '38ac4fc2-1d1a-474b-b911-d210b20b74f5',
        name: 'Create course problems',
        tags: ['ta', 'professor', 'course_admin', 'course_creator', 'super_admin'],
        actions: (_user, course) => [
            {
                action: 'create',
                subject: Problem,
                validate: instance => !!course && safeIdComparison(course.id, instance.course),
            },
        ],
    },
    {
        id: '878907ed-1731-4783-956d-7f47c01fe31d',
        name: 'Update own course problems',
        tags: ['ta', 'professor', 'course_admin', 'course_creator', 'super_admin'],
        actions: (user, course) => [
            {
                action: 'update',
                subject: Problem,
                validate: instance =>
                    !!course &&
                    !!user &&
                    safeIdComparison(course.id, instance.course) &&
                    safeIdComparison(user.id, instance.creator),
            },
        ],
    },
    {
        id: 'ee4eb0ec-07f4-4286-93f4-e059ea52a21e',
        name: 'View Course',
        tags: ['student', 'ta', 'professor', 'course_admin', 'ta_manager', 'course_creator', 'super_admin'],
        actions: (_user, course) => [
            {
                action: 'view',
                subject: Course,
                validate: instance => instance?.id === course?.id,
            },
        ],
    },
    {
        id: '4dd122c7-e32b-4b38-b5ab-25282e524175',
        name: 'View all course roles',
        tags: ['course_admin', 'course_creator', 'super_admin'],
        actions: (_user, course) => [
            {
                action: 'view',
                subject: Role,
                validate: (instance: Role) => !!course && safeIdComparison(course.id, instance.course),
            },
        ],
    },
    {
        id: '47ea44e8-2c6b-4d8e-a033-18c1ac4b9403',
        name: 'Update all course roles',
        tags: ['course_admin', 'course_creator', 'super_admin'],
        actions: (_user, course) => [
            {
                action: 'update',
                subject: Role,
                validate: (instance: Role) => !!course && safeIdComparison(course.id, instance.course),
            },
        ],
    },
    {
        id: '982aba07-32ed-4d7a-8bfc-c1ccff7915ed',
        name: 'Create course roles',
        tags: ['course_admin', 'course_creator', 'super_admin'],
        actions: (_user, course) => [
            {
                action: 'create',
                subject: Role,
                validate: (instance: Role) => !!course && safeIdComparison(course.id, instance.course),
            },
        ],
    },
    {
        id: '71b1d83f-0a0f-4380-bf41-7ed7bb3d56c0',
        name: 'View all course lesson plans',
        tags: ['ta', 'student', 'professor', 'course_admin', 'course_creator', 'super_admin'],
        actions: (_user, course) => [
            {
                action: 'view',
                subject: LessonPlan,
                validate: (instance: LessonPlan) => !!course && safeIdComparison(course.id, instance.course),
            },
        ],
    },
    {
        id: 'd0e934de-a3e2-4760-b9e7-c1ebcc01cb1c',
        name: 'View lesson plans sidebar',
        tags: ['ta', 'professor', 'course_admin', 'course_creator', 'super_admin'],
        actions: (_user, course) => [
            {
                action: 'view',
                subject: 'lesson-plan-sidebar',
            },
        ],
    },
    {
        id: '66f0cdcf-c911-495b-b04f-4d87574b04a1',
        name: 'View Coverage Request Monitor',
        tags: ['course_admin', 'ta_manager', 'course_creator', 'super_admin'],
        actions: (_user, course) => [
            {
                action: 'use',
                subject: 'coverage-request-monitor',
            },
        ],
    },
    {
        id: 'c7e8b858-a259-45a7-939b-6342ecf4ac46',
        name: 'View Reports',
        tags: ['course_admin', 'course_creator', 'super_admin'],
        actions: (_user, course) => [
            {
                action: 'view',
                subject: 'reports',
            },
        ],
    },
    {
        id: 'f3842ef6-81d7-4979-8ba3-44385a9d0d28',
        name: 'View all course access codes',
        tags: ['course_admin', 'course_creator', 'super_admin'],
        actions: (_user, course) => [
            {
                action: 'view',
                subject: 'all-access-codes',
            },
        ],
    },
    {
        id: '9b99377e-8c72-4b0e-95ce-a15b669459f6',
        name: 'Update own lesson plans',
        tags: ['ta', 'professor', 'course_admin', 'course_creator', 'super_admin'],
        actions: (user, course) => [
            {
                action: 'update',
                subject: LessonPlan,
                validate: (instance: LessonPlan) =>
                    !!user &&
                    !!course &&
                    safeIdComparison(course.id, instance.course) &&
                    safeIdComparison(user.id, instance.creator),
            },
        ],
    },
    {
        id: 'fcab3d19-107e-439e-a6d9-c2173c478a0d',
        name: 'Create course lesson plans',
        tags: ['ta', 'professor', 'course_admin', 'course_creator', 'super_admin'],
        actions: (user, course) => [
            {
                action: 'create',
                subject: LessonPlan,
                validate: (instance: LessonPlan) =>
                    !!user &&
                    !!course &&
                    safeIdComparison(course.id, instance.course) &&
                    safeIdComparison(user.id, instance.creator),
            },
        ],
    },
    {
        id: '7a8223d7-67c3-4ce3-8b16-c2b6c6a993b2',
        name: 'Update own lesson plan steps',
        tags: ['ta', 'professor', 'course_admin', 'course_creator', 'super_admin'],
        actions: (user, course) => [
            {
                action: 'update',
                subject: LessonPlanStep,
                validate: (instance: LessonPlanStep) =>
                    !!user &&
                    !!course &&
                    safeIdComparison(course.id, instance.course) &&
                    safeIdComparison(user.id, instance.creator),
            },
        ],
    },
    {
        id: 'b4a2f22d-ebf2-4876-9f2d-df1c56740e06',
        name: 'Update all course lesson plan steps',
        tags: ['course_admin', 'course_creator', 'super_admin'],
        actions: (user, course) => [
            {
                action: 'update',
                subject: LessonPlanStep,
                validate: (instance: LessonPlanStep) =>
                    !!user && !!course && safeIdComparison(course.id, instance.course),
            },
        ],
    },
    {
        id: '1821a33d-aefb-4da5-81e2-310b5baca74c',
        name: 'Create own course lesson plan steps',
        tags: ['ta', 'professor', 'course_admin', 'course_creator', 'super_admin'],
        actions: (user, course) => [
            {
                action: 'create',
                subject: LessonPlanStep,
                validate: (instance: LessonPlanStep) =>
                    !!user &&
                    !!course &&
                    safeIdComparison(course.id, instance.course) &&
                    safeIdComparison(user.id, instance.creator),
            },
        ],
    },
    {
        id: '8cd5c650-951c-4429-b162-648809c53ae5',
        name: 'Delete own lesson plan steps',
        tags: ['ta', 'professor', 'course_admin', 'course_creator', 'super_admin'],
        actions: (user, course) => [
            {
                action: 'delete',
                subject: LessonPlanStep,
                validate: (instance: LessonPlanStep) =>
                    !!user &&
                    !!course &&
                    safeIdComparison(course.id, instance.course) &&
                    safeIdComparison(user.id, instance.creator),
            },
        ],
    },
    {
        id: 'e4723e62-fa48-4dfc-9e69-4cc36e97cc73',
        name: 'Update all course lesson plans',
        tags: ['course_admin', 'course_creator', 'super_admin'],
        actions: (_user, course) => [
            {
                action: 'update',
                subject: LessonPlan,
                validate: (instance: LessonPlan) => !!course && safeIdComparison(course.id, instance.course),
            },
        ],
    },
    {
        id: '88008cda-f76e-4cb7-b33c-ffedbd5045e5',
        name: 'View all course learning goals',
        tags: ['course_admin', 'student', 'professor', 'ta', 'super_admin'],
        actions: (_user, course) => [
            {
                action: 'view',
                subject: LearningGoalCategory,
                validate: (instance: LearningGoalCategory) => !!course && safeIdComparison(course.id, instance.course),
            },
        ],
    },
    {
        id: '3db3cde0-c81d-413f-b2e8-96c868d49719',
        name: 'Update all course learning goals',
        tags: ['course_admin', 'course_creator', 'super_admin'],
        actions: (_user, course) => [
            {
                action: 'update',
                subject: LearningGoalCategory,
                validate: (instance: LearningGoalCategory) => !!course && safeIdComparison(course.id, instance.course),
            },
        ],
    },
    {
        id: '059257db-0e1c-4a2b-84e0-1cdeb4befa67',
        name: 'Create course learning goals',
        tags: ['course_admin', 'course_creator', 'super_admin'],
        actions: (_user, course) => [
            {
                action: 'create',
                subject: LearningGoalCategory,
                validate: (instance: LearningGoalCategory) => !!course && safeIdComparison(course.id, instance.course),
            },
        ],
    },
    {
        id: 'f16716a6-7923-4309-aa02-10bc23e566af',
        name: 'View all course quizzes',
        tags: ['course_admin', 'course_creator', 'professor', 'ta', 'super_admin'],
        actions: (_user, course) => [
            {
                action: 'view',
                subject: Quiz,
                validate: (instance: Quiz) => !!course && safeIdComparison(course.id, instance.course),
            },
        ],
    },
    {
        id: '11c23712-c779-4fa6-96d2-01100da8285f',
        name: 'Update all course quizzes',
        tags: ['course_admin', 'course_creator', 'super_admin'],
        actions: (_user, course) => [
            {
                action: 'update',
                subject: Quiz,
                validate: (instance: Quiz) => !!course && safeIdComparison(course.id, instance.course),
            },
        ],
    },
    {
        id: '0e9792f4-be1a-43d2-abd7-7300cfebbbc8',
        name: 'Create course quizzes',
        tags: ['course_admin', 'course_creator', 'super_admin'],
        actions: (_user, course) => [
            {
                action: 'create',
                subject: Quiz,
                validate: (instance: Quiz) => !!course && safeIdComparison(course.id, instance.course),
            },
        ],
    },
    {
        id: '99652b97-ebc3-4c3b-91dc-7a85fed49ced',
        name: 'Edit course settings',
        tags: ['course_admin', 'course_creator', 'super_admin'],
        actions: (_user, course) => [
            {
                action: 'update',
                subject: Course,
                validate: (instance: Course) => course?.id === instance?.id,
            },
        ],
    },
    {
        id: '8be45b51-ecd4-4499-9300-f688ccbcece6',
        name: 'Impersonate Users',
        tags: ['super_admin'],
        isGlobal: true,
        actions: () => [
            {
                action: 'view',
                subject: 'impersonate_users',
            },
            {
                action: 'use',
                subject: 'impersonate_users',
            },
        ],
    },
    {
        id: '5829c0e3-fdaa-4711-a006-0d2d0347c12a',
        name: 'Create Courses',
        tags: ['course_creator', 'super_admin'],
        isGlobal: true,
        actions: () => [
            {
                action: 'create',
                subject: Course,
            },
        ],
    },
    {
        id: 'abb7e2e4-b2fa-408d-99b7-7a55938d36a2',
        name: 'Create Users',
        tags: ['course_creator', 'super_admin'],
        isGlobal: true,
        actions: () => [
            {
                action: 'create',
                subject: User,
            },
        ],
    },
    {
        id: '40d3807c-622a-4fee-a056-28c2db5e2e9b',
        name: 'View all coverage requests',
        tags: ['super_admin', 'ta_manager'],
        isGlobal: true,
        actions: () => [
            {
                action: 'view',
                subject: CoverageRequest,
            },
        ],
    },
    {
        id: 'e1b24572-9963-4bc7-bb42-c4c687fc1348',
        name: 'View all course lessons',
        tags: ['ta', 'professor', 'course_admin', 'course_creator', 'super_admin'],
        actions: (_user, course) => [
            {
                action: 'view',
                subject: Lesson,
                validate: (instance: Lesson) => !!course && safeIdComparison(course.id, instance.course),
            },
        ],
    },
    {
        id: '407c96fd-f982-4c93-aec0-bf3b2f832470',
        name: 'Update own lessons',
        tags: ['ta', 'professor', 'course_admin', 'course_creator', 'super_admin'],
        actions: (user, course) => [
            {
                action: 'update',
                subject: Lesson,
                validate: (instance: Lesson) =>
                    !!user &&
                    !!course &&
                    !!instance?.meetingTime &&
                    safeIdComparison(course.id, instance.course) &&
                    (safeIdComparison(user.id, instance.meetingTime.leader) ||
                        !!course?.coverageRequests?.find(
                            request =>
                                safeIdComparison(user?.id, request.coveredBy?.id) &&
                                request.meetingTime.id === instance.meetingTime?.id &&
                                (dayjs(instance.beginDate).isSame(request.date) ||
                                    dayjs(instance.beginDate).isBefore(request.date)) &&
                                (dayjs(instance.endDate).isSame(request.date) ||
                                    dayjs(instance.endDate).isAfter(request.date))
                        )),
            },
        ],
    },
    {
        id: '0a362716-f0e2-4578-8c6f-c587040ab440',
        name: 'Update all course lessons',
        tags: ['course_admin', 'course_creator', 'super_admin'],
        actions: (_user, course) => [
            {
                action: 'update',
                subject: Lesson,
                validate: (instance: Lesson) => !!course && safeIdComparison(course.id, instance.course),
            },
        ],
    },
    {
        id: 'c8fb492f-497a-41e1-be8b-4e6a61376ff2',
        name: 'Create default course lessons',
        tags: ['course_admin', 'course_creator', 'super_admin'],
        actions: (_user, course) => [
            {
                action: 'create',
                subject: Lesson,
                validate: (instance: Lesson) =>
                    !!course && safeIdComparison(course.id, instance.course) && !instance.meetingTime,
            },
        ],
    },
    {
        id: '9fac8916-06f8-4fb6-8c03-fd4e013e5e48',
        name: 'Create meeting times',
        tags: ['course_admin', 'course_creator', 'super_admin'],
        actions: (_user, _course) => [
            {
                action: 'create',
                subject: MeetingTime,
                validate: () => true,
            },
        ],
    },
    {
        id: 'be180a52-8dba-4bea-b768-752f25614f24',
        name: 'Update meeting times',
        tags: ['course_admin', 'course_creator', 'super_admin'],
        actions: (_user, course) => [
            {
                action: 'update',
                subject: MeetingTime,
                validate: (instance: MeetingTime) => !!course,
            },
        ],
    },
    {
        id: '0392418c-ba4c-4dd9-a927-30d02c298ff2',
        name: 'Delete meeting times',
        tags: ['course_admin', 'course_creator', 'super_admin'],
        actions: (_user, course) => [
            {
                action: 'delete',
                subject: MeetingTime,
                validate: (instance: MeetingTime) => !!course,
            },
        ],
    },
    {
        id: 'd885afae-7698-4722-82d3-f1bbdefc5852',
        name: 'Create meeting reports',
        tags: ['ta', 'course_admin', 'course_creator', 'super_admin'],
        actions: (user, course) => [
            {
                action: 'create',
                subject: MeetingReport,
                validate: (instance: MeetingReport) =>
                    !!course &&
                    !!user &&
                    safeIdComparison(user.id, instance.creator) &&
                    safeIdComparison(course.id, instance.course) &&
                    _.every(
                        instance.meetingTimes.map(
                            time =>
                                safeIdComparison(user.id, time.leader) ||
                                !!course?.coverageRequests?.find(
                                    request =>
                                        safeIdComparison(user?.id, request.coveredBy?.id) &&
                                        time.id === request.meetingTime.id &&
                                        dayjs(request.date).isSame(dayjs(instance.date))
                                )
                        )
                    ),
            },
        ],
    },
    {
        id: '871e9d32-0bb4-4cb4-b2b7-37a04abc468b',
        name: 'Update meeting reports',
        tags: ['ta', 'course_admin', 'course_creator', 'super_admin'],
        actions: (user, course) => [
            {
                action: 'update',
                subject: MeetingReport,
                validate: (instance: MeetingReport) =>
                    !!course &&
                    !!user &&
                    safeIdComparison(user.id, instance.creator) &&
                    safeIdComparison(course.id, instance.course) &&
                    _.every(
                        instance.meetingTimes.map(
                            time =>
                                safeIdComparison(user.id, time.leader) ||
                                !!course?.coverageRequests?.find(
                                    request =>
                                        safeIdComparison(user?.id, request.coveredBy?.id) &&
                                        time.id === request.meetingTime.id &&
                                        dayjs(request.date).isSame(dayjs(instance.date))
                                )
                        )
                    ),
            },
        ],
    },
    {
        id: 'bb28e4bf-b7e6-4e24-bb30-a6c609b47f73',
        name: 'Create lessons for assigned sections',
        tags: ['ta', 'course_admin', 'course_creator', 'super_admin'],
        actions: (user, course) => [
            {
                action: 'create',
                subject: Lesson,
                validate: (instance: Lesson) =>
                    !!user &&
                    !!course &&
                    !!instance?.meetingTime &&
                    safeIdComparison(course.id, instance.course) &&
                    (safeIdComparison(user.id, instance.meetingTime.leader) ||
                        !!course?.coverageRequests?.find(
                            request =>
                                safeIdComparison(user?.id, request.coveredBy?.id) &&
                                instance.meetingTime?.id === request.meetingTime.id &&
                                (dayjs(instance.beginDate).isSame(request.date) ||
                                    dayjs(instance.beginDate).isBefore(request.date)) &&
                                (dayjs(instance.endDate).isSame(request.date) ||
                                    dayjs(instance.endDate).isAfter(request.date))
                        )),
            },
        ],
    },
    {
        id: 'd7622fcd-9c0e-4b36-b56c-e89d651a48d8',
        name: 'Delete course lessons',
        tags: ['course_admin', 'course_creator', 'super_admin'],
        actions: (user, course) => [
            {
                action: 'delete',
                subject: Lesson,
                validate: (instance: Lesson) =>
                    !!course && !!user && safeIdComparison(course.id, instance.course) && !instance.meetingTime,
            },
        ],
    },
    {
        id: '13f0a408-5f02-4862-b7b0-35eda00cdd4f',
        name: 'Take course quizes',
        tags: ['student', 'super_admin'],
        actions: (user, course) => [
            {
                action: 'create',
                subject: StudentMeetingReport,
                validate: (instance: StudentMeetingReport) => !!course && safeIdComparison(course.id, instance.course),
            },
        ],
    },
    {
        id: 'edd88548-6059-4d30-a4e0-be84491d2933',
        name: 'View all course quiz responses',
        tags: ['professor', 'course_creator', 'course_admin', 'super_admin'],
        actions: (user, course) => [
            {
                action: 'view',
                subject: StudentMeetingReport,
                validate: (instance: StudentMeetingReport) =>
                    !!course && !!user && safeIdComparison(course.id, instance.course),
            },
        ],
    },
    {
        id: 'c928c2bd-0118-41ee-a804-0588c2faacf1',
        name: 'Fetch course roster',
        tags: ['professor', 'ta', 'course_creator', 'course_admin', 'super_admin'],
        actions: () => [
            {
                action: 'view',
                subject: 'roster',
            },
        ],
    },
    {
        id: '1f4df849-ff88-4f13-ae54-1d670d1be117',
        name: 'Toggle all students present/absent button',
        tags: ['course_admin', 'super_admin'],
        actions: () => [
            {
                action: 'use',
                subject: 'meeting-report-toggle-attendance',
            },
        ],
    },
    {
        id: '5291ee3b-e81e-4b1f-b348-7045ec2bcaf3',
        name: 'View own course quiz responses',
        tags: ['student', 'super_admin'],
        actions: (user, course) => [
            {
                action: 'view',
                subject: StudentMeetingReport,
                validate: (instance: StudentMeetingReport) =>
                    !!course &&
                    !!user &&
                    safeIdComparison(course.id, instance.course) &&
                    safeIdComparison(user.id, instance.creator),
            },
        ],
    },
];
