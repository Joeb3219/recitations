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

export function Column(typeOrOptions = null, options = null) {
    return function (object, propertyName) {};
}
// exports.Column = Column;

export function CreateDateColumn(options = null) {
    return function (object, propertyName) {};
}
// exports.CreateDateColumn = CreateDateColumn;

export function ObjectIdColumn(columnOptions = null) {
    return function (object, propertyName) {};
}
// exports.ObjectIdColumn = ObjectIdColumn;

export function PrimaryColumn(typeOrOptions = null, options = null) {
    return function (object, propertyName) {};
}
// exports.PrimaryColumn = PrimaryColumn;

export function PrimaryGeneratedColumn(options = null) {
    return function (object, propertyName) {};
}
// exports.PrimaryGeneratedColumn = PrimaryGeneratedColumn;

export function UpdateDateColumn(options = null) {
    return function (object, propertyName) {};
}
// exports.UpdateDateColumn = UpdateDateColumn;

export function VersionColumn(options = null) {
    return function (object, propertyName) {};
}
// exports.VersionColumn = VersionColumn;

// entities

export function ChildEntity(tableName = null, options = null) {
    return function (object) {};
}
// exports.ChildEntity = ChildEntity;

export function Entity(name = null, options = null) {
    return function (object) {};
}
// exports.Entity = Entity;

export function TableInheritance(type = null) {
    return function (object) {};
}
// exports.TableInheritance = TableInheritance;

// listeners

export function AfterInsert() {
    return function (object, propertyName) {};
}
// exports.AfterInsert = AfterInsert;

export function AfterLoad() {
    return function (object, propertyName) {};
}
// exports.AfterLoad = AfterLoad;

export function AfterRemove() {
    return function (object, propertyName) {};
}
// exports.AfterRemove = AfterRemove;

export function AfterUpdate() {
    return function (object, propertyName) {};
}
// exports.AfterUpdate = AfterUpdate;

export function BeforeInsert() {
    return function (object, propertyName) {};
}
// exports.BeforeInsert = BeforeInsert;

export function BeforeRemove() {
    return function (object, propertyName) {};
}
// exports.BeforeRemove = BeforeRemove;

export function BeforeUpdate() {
    return function (object, propertyName) {};
}
// exports.BeforeUpdate = BeforeUpdate;

export function EventSubscriber() {
    return function (object, propertyName) {};
}
// exports.EventSubscriber = EventSubscriber;

// relations

export function JoinColumn(options = null) {
    return function (object, propertyName) {};
}
// exports.JoinColumn = JoinColumn;

export function JoinTable(options = null) {
    return function (object, propertyName) {};
}
// exports.JoinTable = JoinTable;

export function ManyToMany(
    typeFunction = null,
    inverseSideOrOptions = null,
    options = null
) {
    return function (object, propertyName) {};
}
// exports.ManyToMany = ManyToMany;

export function ManyToOne(
    typeFunction = null,
    inverseSideOrOptions = null,
    options = null
) {
    return function (object, propertyName) {};
}
// exports.ManyToOne = ManyToOne;

export function OneToMany(
    typeFunction = null,
    inverseSideOrOptions = null,
    options = null
) {
    return function (object, propertyName) {};
}
// exports.OneToMany = OneToMany;

export function OneToOne(
    typeFunction = null,
    inverseSideOrOptions = null,
    options = null
) {
    return function (object, propertyName) {};
}
// exports.OneToOne = OneToOne;

export function RelationCount(relation = null) {
    return function (object, propertyName) {};
}
// exports.RelationCount = RelationCount;

export function RelationId(relation = null) {
    return function (object, propertyName) {};
}
// exports.RelationId = RelationId;

// tree

export function Tree(name = null, options = null) {
    return function (object) {};
}
// exports.Tree = Tree;

export function TreeChildren(options = null) {
    return function (object, propertyName) {};
}
// exports.TreeChildren = TreeChildren;

export function TreeChildrenCount(options = null) {
    return function (object, propertyName) {};
}
// exports.TreeChildrenCount = TreeChildrenCount;

export function TreeLevelColumn() {
    return function (object, propertyName) {};
}
// exports.TreeLevelColumn = TreeLevelColumn;

export function TreeParent(options = null) {
    return function (object, propertyName) {};
}
// exports.TreeParent = TreeParent;

// other

export function Generated(options = null) {
    return function (object, propertyName) {};
}
// exports.Generated = Generated;

export function Index(options = null) {
    return function (object, propertyName) {};
}

export class BaseEntity {}
