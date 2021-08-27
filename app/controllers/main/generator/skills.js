
import Controller from '@ember/controller';
import { action } from '@ember/object';
import { tracked } from '@glimmer/tracking';
import { inject as service } from '@ember/service';

export default class MainGeneratorSkillsController extends Controller {
    @service manager;
    @service database;
    @service generator;

    @action onInterestChange(event, { object, key, step } = {}) {
        this.generator.setSkillCategoryProperty(object.id, "total", step);
        this.generator.setSkillCategoryProperty(object.id, "available", step);
        this.generator.setIp(-step);
    }
}