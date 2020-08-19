import DatabaseAdapter from './database';

export default class ConstantAdapter extends DatabaseAdapter {
    databaseName = "constants";
}