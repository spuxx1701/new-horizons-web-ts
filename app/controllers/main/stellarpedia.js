//----------------------------------------------------------------------------//
// Leopold Hock / 2020-08-23
// Description:
// Controller for template main/stellarpedia.
//----------------------------------------------------------------------------//
import Controller from '@ember/controller';
import { action } from '@ember/object';
import { tracked } from '@glimmer/tracking';
import { inject as service } from '@ember/service';

export default class StellarpediaController extends Controller {
    @service manager;
    @service stellarpediaService;

    init() {
        //----------------------------------------------------------------------------//
        // Leopold Hock / 2020-08-23
        // Description:
        // Initializer method.
        //----------------------------------------------------------------------------//
        super.init();
    }
}