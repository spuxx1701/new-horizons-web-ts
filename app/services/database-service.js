// Leopold Hock | 23.05.2020
// Description: The DatabaseService manages the database and ruleset.
import Service from '@ember/service';
import { tracked } from '@glimmer/tracking';
import { inject as service } from '@ember/service';
var that;

export default class DatabaseService extends Service {
    @service manager;

    init() {
        super.init();
        that = this;
    }
}
