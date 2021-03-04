//----------------------------------------------------------------------------//
// Leopold Hock / 2020-08-23
// Description:
// Component for Stellarpedia <txt> element.
//----------------------------------------------------------------------------//
import Component from '@ember/component';
import { action } from '@ember/object';
import { inject as service } from '@ember/service';
import { tracked } from '@glimmer/tracking';
import { htmlSafe } from '@ember/template';

export default class StellarpediaTextComponent extends Component {
    @service manager;

    @action
    didRender() {
        //----------------------------------------------------------------------------//
        // Leopold Hock / 2020-08-23
        // Description:
        // Runs after the component has been rendered. Subscribes to stellarpedia link
        // buttons' onClick events if there are any in the currently displayed article.
        //----------------------------------------------------------------------------//
        let that = this;
        let linkButtons = document.getElementsByClassName("button-link");
        for (let button of linkButtons) {
            button.addEventListener("click", function (event) {
                try {
                    let target = event.originalTarget.getAttribute("data-target");
                    let split = target.split(";");
                    let entryAddress = { bookId: split[0], chapterId: split[1], entryId: split[2] };
                    that.manager.showStellarpediaEntry(entryAddress.bookId, entryAddress.chapterId, entryAddress.entryId);
                } catch (exception) {
                    that.manager.log("Unable to subscribe stellarpedia button link event (" + exception + ").", that.manager.msgType.x);
                }
            });
        }
    }
}