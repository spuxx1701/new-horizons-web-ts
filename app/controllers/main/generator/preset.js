//  Leopold Hock | 30.04.2020
//  Description: Controller for template "main/generator/preset". The Preset Route is the start of the Character generation process.

import Controller from '@ember/controller';
import { action } from '@ember/object';
import { tracked } from '@glimmer/tracking';
import { inject as service } from '@ember/service';
var that;

export default class GeneratorPresetController extends Controller {
    @service manager;
    @service databaseService;
    @service characterService;

    init() {
        super.init();
        that = this;
    }

    onTransition() {

    }
}