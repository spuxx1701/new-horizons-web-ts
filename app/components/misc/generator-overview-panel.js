import Component from '@ember/component';
import { action } from '@ember/object';
import { tracked } from '@glimmer/tracking';
import { inject as service } from '@ember/service';

export default class SignInComponent extends Component {
    @service generator;
}