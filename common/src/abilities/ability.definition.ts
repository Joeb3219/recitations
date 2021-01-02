import _ from 'lodash';
import { Course, Problem, Role, Section, User } from '../models';
import { LearningGoalCategory } from '../models/learningGoalCategory';
import { LessonPlan } from '../models/lessonPlan';
import { Quiz } from '../models/quiz';

export type RawRuleConditions<Resource extends any> = {
    [K in keyof Resource]?: any;
};

export type RuleAction = 'view' | 'update' | 'create' | 'delete' | 'use';
export type RuleTag = 'student' | 'ta' | 'professor' | 'user' | 'course_admin' | 'super_admin';

export class RawRule<Resource extends any = any> {
    action: RuleAction;
    subject: string | (new () => Resource);
    fields?: string[];
    validate?: Resource extends string ? undefined : (instance: Resource) => boolean;
    inverted?: boolean;
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
    typeof obj === 'string' ? obj === id : obj?.id === id;

export const ABILITY_GENERATORS: AbilityGenerator[] = [
    {
        id: '929a5259-912d-43da-9bc0-8a4dce6fa825',
        name: 'View all sections',
        tags: ['professor', 'course_admin', 'super_admin'],
        actions: (user, course) => [
            {
                action: 'view',
                subject: Section,
                validate: (instance: Section) => !!course && course.id === instance.course?.id,
            },
        ],
    },
    {
        id: '946d2945-f09b-4e81-a574-bf2f9f1d1cca',
        name: 'Edit all sections',
        tags: ['course_admin', 'super_admin'],
        actions: (user, course) => [
            {
                action: 'update',
                subject: Section,
                validate: (instance: Section) => !!course && course.id === instance.course?.id,
            },
        ],
    },
    {
        id: 'f7572352-6048-4cf5-998c-2fdb0026495a',
        name: 'View assigned sections',
        tags: ['professor', 'ta', 'student', 'course_admin', 'super_admin'],
        actions: (user, course) => [
            {
                action: 'view',
                subject: Section,
                validate: (instance: Section) =>
                    (!!course &&
                        course.id === instance.course?.id &&
                        !!instance.students?.find(student => safeIdComparison(user?.id, student))) ||
                    safeIdComparison(user?.id, instance.ta) ||
                    safeIdComparison(user?.id, instance.instructor),
            },
        ],
    },
    {
        id: '59713b50-9be9-4499-a19a-10a6ec2962b1',
        name: 'Edit assigned sections',
        tags: ['course_admin', 'super_admin'],
        actions: (user, course) => [
            {
                action: 'update',
                subject: Section,
                validate: (instance: Section) =>
                    (!!course &&
                        course.id === instance.course?.id &&
                        !!instance.students?.find(student => safeIdComparison(user?.id, student))) ||
                    safeIdComparison(user?.id, instance.ta) ||
                    safeIdComparison(user?.id, instance.instructor),
            },
        ],
    },
    {
        id: 'd026fcd5-61ce-4fdd-90c3-74601cd8dec8',
        name: 'View all problems',
        tags: ['student', 'ta', 'professor', 'course_admin', 'super_admin'],
        actions: (_user, course) => [
            {
                action: 'view',
                subject: Problem,
                validate: instance => !!course && course.id === instance.course?.id,
            },
        ],
    },
    {
        id: '656c65b4-fe3d-4d9a-b891-3f949eab36c2',
        name: 'Edit all problems',
        tags: ['ta', 'professor', 'course_admin', 'super_admin'],
        actions: (_user, course) => [
            {
                action: 'update',
                subject: Problem,
                validate: instance => !!course && course.id === instance.course?.id,
            },
        ],
    },
    {
        id: 'ee4eb0ec-07f4-4286-93f4-e059ea52a21e',
        name: 'View Course',
        tags: ['student', 'ta', 'professor', 'course_admin', 'super_admin'],
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
        name: 'View all roles',
        tags: ['course_admin', 'super_admin'],
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
        name: 'Edit all roles',
        tags: ['course_admin', 'super_admin'],
        actions: (_user, course) => [
            {
                action: 'update',
                subject: Role,
                validate: (instance: Role) => !!course && safeIdComparison(course.id, instance.course),
            },
        ],
    },
    {
        id: '71b1d83f-0a0f-4380-bf41-7ed7bb3d56c0',
        name: 'View all lesson plans',
        tags: ['ta', 'professor', 'course_admin', 'super_admin'],
        actions: (_user, course) => [
            {
                action: 'view',
                subject: LessonPlan,
                validate: (instance: LessonPlan) => !!course && safeIdComparison(course.id, instance.course),
            },
        ],
    },
    {
        id: '88008cda-f76e-4cb7-b33c-ffedbd5045e5',
        name: 'View all learning goals',
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
        id: 'f16716a6-7923-4309-aa02-10bc23e566af',
        name: 'View all quizzes',
        tags: ['course_admin', 'professor', 'student', 'ta', 'super_admin'],
        actions: (_user, course) => [
            {
                action: 'view',
                subject: Quiz,
                validate: (instance: Quiz) => !!course && safeIdComparison(course.id, instance.course),
            },
        ],
    },
    {
        id: '99652b97-ebc3-4c3b-91dc-7a85fed49ced',
        name: 'Edit course settings',
        tags: ['course_admin', 'super_admin'],
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
];
