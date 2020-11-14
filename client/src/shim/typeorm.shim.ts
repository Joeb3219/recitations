/* eslint-disable */

// this "shim" can be used on the frontend to prevent from errors on undefined
// decorators in the models, when you are sharing same models across backend and frontend.
// to use this shim simply configure your systemjs/webpack configuration to use this file instead of typeorm module.

// for system.js this resolved this way:
// System.config({
//     ...
//     packages: {
//         "typeorm": {
//             main: "typeorm-model-shim.js",
//             defaultExtension: "js"
//         }
//     }
// }

// for webpack this is resolved this way:
// resolve: { // see: https://webpack.js.org/configuration/resolve/
//     alias: {
//         typeorm: path.resolve(__dirname, "../node_modules/typeorm/typeorm-model-shim")
//     }
// }

// columns

export function Column(typeOrOptions: any = null, options: any = null) {
    return function (object: any, propertyName: any) {};
}
// exports.Column = Column;

export function CreateDateColumn(options: any = null) {
    return function (object: any, propertyName: any) {};
}
// exports.CreateDateColumn = CreateDateColumn;

export function ObjectIdColumn(columnOptions: any = null) {
    return function (object: any, propertyName: any) {};
}
// exports.ObjectIdColumn = ObjectIdColumn;

export function PrimaryColumn(typeOrOptions: any = null, options: any = null) {
    return function (object: any, propertyName: any) {};
}
// exports.PrimaryColumn = PrimaryColumn;

export function PrimaryGeneratedColumn(options: any = null) {
    return function (object: any, propertyName: any) {};
}
// exports.PrimaryGeneratedColumn = PrimaryGeneratedColumn;

export function UpdateDateColumn(options: any = null) {
    return function (object: any, propertyName: any) {};
}
// exports.UpdateDateColumn = UpdateDateColumn;

export function VersionColumn(options: any = null) {
    return function (object: any, propertyName: any) {};
}
// exports.VersionColumn = VersionColumn;

// entities

export function ChildEntity(tableName: any = null, options: any = null) {
    return function (object: any) {};
}
// exports.ChildEntity = ChildEntity;

export function Entity(name: any = null, options: any = null) {
    return function (object: any) {};
}
// exports.Entity = Entity;

export function TableInheritance(type: any = null) {
    return function (object: any) {};
}
// exports.TableInheritance = TableInheritance;

// listeners

export function AfterInsert() {
    return function (object: any, propertyName: any) {};
}
// exports.AfterInsert = AfterInsert;

export function AfterLoad() {
    return function (object: any, propertyName: any) {};
}
// exports.AfterLoad = AfterLoad;

export function AfterRemove() {
    return function (object: any, propertyName: any) {};
}
// exports.AfterRemove = AfterRemove;

export function AfterUpdate() {
    return function (object: any, propertyName: any) {};
}
// exports.AfterUpdate = AfterUpdate;

export function BeforeInsert() {
    return function (object: any, propertyName: any) {};
}
// exports.BeforeInsert = BeforeInsert;

export function BeforeRemove() {
    return function (object: any, propertyName: any) {};
}
// exports.BeforeRemove = BeforeRemove;

export function BeforeUpdate() {
    return function (object: any, propertyName: any) {};
}
// exports.BeforeUpdate = BeforeUpdate;

export function EventSubscriber() {
    return function (object: any, propertyName: any) {};
}
// exports.EventSubscriber = EventSubscriber;

// relations

export function JoinColumn(options: any = null) {
    return function (object: any, propertyName: any) {};
}
// exports.JoinColumn = JoinColumn;

export function JoinTable(options: any = null) {
    return function (object: any, propertyName: any) {};
}
// exports.JoinTable = JoinTable;

export function ManyToMany(
    typeFunction: ((type: any) => any) | null = null,
    inverseSideOrOptions: ((type: any) => any) | {} | null = null,
    options: any = null
) {
    return function (object: any, propertyName: any) {};
}
// exports.ManyToMany = ManyToMany;

export function ManyToOne(
    typeFunction: ((type: any) => any) | null = null,
    inverseSideOrOptions: ((arg: any) => any) | {} | null = null,
    options: any = null
) {
    return function (object: any, propertyName: any) {};
}
// exports.ManyToOne = ManyToOne;

export function OneToMany(
    typeFunction: ((type: any) => any) | null = null,
    inverseSideOrOptions: ((type: Object | any) => any) | {} | null = null,
    options: any = null
) {
    return function (object: any, propertyName: any) {};
}
// exports.OneToMany = OneToMany;

export function OneToOne(
    typeFunction: ((type: any) => any) | null = null,
    inverseSideOrOptions: ((arg: any) => any) | {} | null = null,
    options: any = null
) {
    return function (object: any, propertyName: any) {};
}
// exports.OneToOne = OneToOne;

export function RelationCount(relation: any = null) {
    return function (object: any, propertyName: any) {};
}
// exports.RelationCount = RelationCount;

export function RelationId(relation: any = null) {
    return function (object: any, propertyName: any) {};
}
// exports.RelationId = RelationId;

// tree

export function Tree(name: any = null, options: any = null) {
    return function (object: any) {};
}
// exports.Tree = Tree;

export function TreeChildren(options: any = null) {
    return function (object: any, propertyName: any) {};
}
// exports.TreeChildren = TreeChildren;

export function TreeChildrenCount(options: any = null) {
    return function (object: any, propertyName: any) {};
}
// exports.TreeChildrenCount = TreeChildrenCount;

export function TreeLevelColumn() {
    return function (object: any, propertyName: any) {};
}
// exports.TreeLevelColumn = TreeLevelColumn;

export function TreeParent(options: any = null) {
    return function (object: any, propertyName: any) {};
}
// exports.TreeParent = TreeParent;

// other

export function Generated(options: any = null) {
    return function (object: any, propertyName: any) {};
}
// exports.Generated = Generated;

export function Index(options: any = null) {
    return function (object: any, propertyName: any) {};
}

export class BaseEntity {}
