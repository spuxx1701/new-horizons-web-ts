import Model, { attr, hasMany, belongsTo } from '@ember-data/model';
import DatabaseModel from './database';

export default class AbilityModel extends DatabaseModel {
    @belongsTo("ability-category") category;
    @attr("boolean") isEditorOnly;
    @hasMany("value-reference") requirements;
    @attr("boolean") needsInput;
    @attr("string") input;
    @attr("boolean") isSpecialisation;
    @hasMany("value-reference") options;
    @attr("boolean") isActive;
    @attr("number") castTime;
    @attr("number") staminaUse;
    @attr("boolean") usesPower;
    @attr("number") powerUse;
    @attr("number") costs;
    @attr("value-reference") targets;
}