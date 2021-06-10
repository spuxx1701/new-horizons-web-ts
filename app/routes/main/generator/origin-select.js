import Route from '@ember/routing/route';
import RSVP from 'rsvp';
import { action } from '@ember/object';
import { inject as service } from '@ember/service';
import StellarpediaService from '../../../services/stellarpedia-service';

export default class MainGeneratorOriginSelectRoute extends Route {
    @service manager;
    @service generator;
    @service databaseService;
    @service stellarpediaService;

    async model(params) {
        if (this.generator.originChosen) {
            this.transitionTo("main.generator.origin");
        }
        let reducedOriginId = params.reducedOriginId;
        if (!reducedOriginId) {
            this.transitionTo("main.generator.origin");
        }
        await this.stellarpediaService.load();
        await this.databaseService.loadCollection("origin");
        let origin = this.databaseService.getIdentifiable("origin/" + reducedOriginId);
        if (!origin) {
            this.transitionTo("main.generator.origin");
        }
        // make radio-compatible 'options' arrays for all skill choices
        let skillRadioData = [];
        for (let i = 0; i < origin.skillOptions.length; i++) {
            let skillRadioItem = {
                radioName: "skill-option-" + i,
                level: origin.skillOptions[i].level,
                options: []
            }
            for (let skill of origin.skillOptions[i].options) {
                skillRadioItem.options.push({
                    caption: this.manager.localize(skill) + " +" + skillRadioItem.level,
                    value: skill
                });
            }
            skillRadioData.push(skillRadioItem);
        }
        return RSVP.hash({
            data: {
                motherTongue: "Solaire",
                origin: origin,
                skillOptions: skillRadioData
            },
            skills: this.databaseService.loadCollection("skill"),
            abilities: this.databaseService.loadCollection("ability")
        });
    }
}
