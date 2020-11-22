export type CourseSettingKey = 'semester_start_date' | 'semester_end_date';
export type CourseSettingSection = 'dates';

export type CourseSettingType = 'number' | 'select' | 'text' | 'date';

export type CourseSettingNumber = {
    type: 'number';
    value?: number;
    default: number;
};

export type CourseSettingSelect = {
    type: 'select';
    default: string;
    value?: string;
    values: { value: string; label: string }[];
};

export type CourseSettingText = {
    type: 'text';
    value?: string;
    default: string;
};

export type CourseSettingDate = {
    type: 'date';
    value?: Date;
    default?: Date;
};

export type CourseSettingBase = {
    key: CourseSettingKey;
    name: string;
    description: string;
    section: CourseSettingSection;
};

export type CourseSetting = CourseSettingBase &
    (CourseSettingNumber | CourseSettingSelect | CourseSettingText | CourseSettingDate);

export type CourseSettings = {
    [K in CourseSettingKey]: CourseSetting;
};
