//  Leopold Hock | 30.04.2020
//  Description: Controller for template "main/stellarpedia".

import Controller from '@ember/controller';
import { action } from '@ember/object';
import { tracked } from '@glimmer/tracking';
import { inject as service } from '@ember/service';

export default class GeneratorController extends Controller {
    @service manager;
    @service stellarpediaService;

    init() {
        super.init();
    }
}