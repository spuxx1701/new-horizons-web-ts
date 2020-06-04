//  Leopold Hock | 30.04.2020
//  Description: This service stores active character data and controls most of character-related functions and calculations.
import Ember from 'ember';
import Service from '@ember/service';
import config from '../config/environment';
import { tracked } from '@glimmer/tracking';
import { inject as service } from '@ember/service';
var that;

export default class CharacterService extends Service {
    @service manager;
    
    init() {
        super.init();
        that = this;
    }
}