//----------------------------------------------------------------------------//
// Leopold Hock / 2020-09-24
// Description:
// Parent class for all interactable UI components.
//----------------------------------------------------------------------------//

import Component from '@ember/component';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';
import { inject as service } from '@ember/service';

export default class LabelComponent extends Component {
    @tracked textPosition = "left"
}