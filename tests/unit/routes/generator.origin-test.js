import { module, test } from 'qunit';
import { setupTest } from 'ember-qunit';

module('Unit | Route | generator.origin', function(hooks) {
  setupTest(hooks);

  test('it exists', function(assert) {
    let route = this.owner.lookup('route:generator.origin');
    assert.ok(route);
  });
});
