//----------------------------------------------------------------------------//
// Leopold Hock / 2021-03-16
// Description:
// Registers custom instance classes.
//----------------------------------------------------------------------------//
import CharacterV1 from '../classes/CharacterV1'

export function initialize(applicationInstance) {
  applicationInstance.register('object:character-v1', CharacterV1);
}

export default {
  initialize
};
