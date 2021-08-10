import DatabasePrefabModel from './prefab';
import { attr } from '@ember-data/model';
import { inject as service } from '@ember/service';

export default class DatabaseSkillModel extends DatabasePrefabModel {
    @service manager;
    @service database;
    @service generator;
    @service editor;

    @attr() skillCategory;
    @attr() factor;
    @attr() constraint;
    @attr() current;
    @attr() min;
    @attr() max;
    @attr() primaryAttributes;
    @attr() hasSpecialisations;
    @attr() isBasic;
    @attr() baseValue;
    @attr() requirements;
    @attr() specialExperience;

    /**
     * Adds the skill to the given character.
     * @param  {bool} logSuccess=true (optional) - Whether success should be logged.
     * @param  {bool} ignoreDuplicate=false (optional) - Whether duplicates should be ignored and treated like success.
     * @param  {bool} updateSkill=true (optional) - Whether the skill should be updated afterwards.
     */
    addToCharacter(character, { logSuccess = true, ignoreDuplicate = false, updateSkill = true } = {}) {
        let newSkill = this.manager.database.getIdentifiable(this.id, { clone: true });
        if (!newSkill) {
            this.manager.log(`Unable add skill '${this.id}' to character '${character.getName()}': ID was given, but skill could not be found in database.`, "x");
            return undefined;
        }
        if (character.getSkill(this.id)) {
            if (!ignoreDuplicate) {
                this.manager.log(`Unable to add skill '${newSkill.id}' to character '${character.getName()}': Character already has that skill.`, "x");
            }
        } else {
            character.data.skills.pushObject(newSkill);
        }
        if (logSuccess) this.manager.log(`Skill '${newSkill.id}' has been added to character '${character.getName()}'.`, "i");
        if (updateSkill) character.updateSkill(this.id, { logSuccess: false });
        return newSkill;
    }
}