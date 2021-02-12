//----------------------------------------------------------------------------//
// Leopold Hock / 2021-02-01
// Description:
// Controller for route 'sign-in'. This is where users sign in. Another way
// to sign in is to use the sign-in modal.
//----------------------------------------------------------------------------//

import Controller from '@ember/controller';
import { action } from '@ember/object';
import { tracked } from '@glimmer/tracking';
import { inject as service } from '@ember/service';
import { Changeset } from 'ember-changeset';
import fetch from 'fetch';
import sha256 from 'js-sha256';

export default class SignInController extends Controller {
}
