import Component from '@ember/component';
import { action } from '@ember/object';
import { inject as service } from '@ember/service';
import { tracked } from '@glimmer/tracking';
import { htmlSafe } from '@ember/template';

export default class StellarpediaRowComponent extends Component {
    @service manager;
    @service stellarpediaService;

    @tracked titleAlignment = "left";
}