import DatabaseAdapter from './database';

export default class AppAdapter extends DatabaseAdapter {
    databaseName = "apps";
}