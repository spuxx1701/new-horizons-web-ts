//----------------------------------------------------------------------------//
// Leopold Hock / 2021-04-05
// Description:
// Controller for template main/stellarpedia/article.
//----------------------------------------------------------------------------//
import Controller from '@ember/controller';
import { action } from '@ember/object';
import { tracked } from '@glimmer/tracking';
import { inject as service } from '@ember/service';

export default class StellarpediaArticleController extends Controller {
    @service manager;
    @service stellarpediaService;

    init() {
        //----------------------------------------------------------------------------//
        // Leopold Hock / 2021-04-05
        // Description:
        // Initializer method.
        //----------------------------------------------------------------------------//
        super.init();
    }
}