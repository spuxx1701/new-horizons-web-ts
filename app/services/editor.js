//----------------------------------------------------------------------------//
// Leopold Hock / 2021-03-13
// Description:
// This service manages the character editing process.
//----------------------------------------------------------------------------//
import Ember from 'ember';
import Service from '@ember/service';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';
import { inject as service } from '@ember/service';
import Character from '../classes/character-v1';

export default class EditorService extends Service {
    @service manager;
    @service database;

    @tracked character;
}