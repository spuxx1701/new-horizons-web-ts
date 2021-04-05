import Model, { attr } from '@ember-data/model';

export default class DatabaseAbilityModel extends Model {
    @attr() abilityCategory;
    @attr() editorOnly;
    @attr() requirements;
    @attr() needsInput;
    @attr() input;
    @attr() isSpecialisation;
    @attr() options;
    @attr() isActive;
    @attr() castTime;
    @attr() staminaUse;
    @attr() usesPower;
    @attr() powerUse;
    @attr() costs;
    @attr() targets;
}