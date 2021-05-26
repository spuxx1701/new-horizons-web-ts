import { localize } from 'new-horizons-web/helpers/localize';
import { module, test } from 'qunit';

module('Unit | Helper | localize', function (hooks) {
    test('Returns a localized value for a key', function (assert) {
        assert.equal(compute(["pri-a/cr/long"]));
    });
});