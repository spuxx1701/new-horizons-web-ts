// Leopold Hock | 23.05.2020
// Description: The DatabaseService manages the database and ruleset.
import Service from '@ember/service';
import { tracked } from '@glimmer/tracking';
import { inject as service } from '@ember/service';
var that;

export default class DatabaseService extends Service {
    @service localizationService;
    @service messageService;
    @tracked database;

    init() {
        super.init();
        that = this;
    }

    async readDatabaseFile() {
        var url = "/assets/database/database.json";
        var json = await fetch(url).then(function (response) {
            return response.json();
        }).catch(function (exception) {
            that.manager.log("error", "Unable to retrieve database file.");
        });
    }
}
