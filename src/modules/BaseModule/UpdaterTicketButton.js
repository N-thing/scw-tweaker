import ModuleUpdater from "../../classes/ModuleUpdater";
import InputTextAction from "../../classes/ui/InputTextAction";
import icons from "../../icons";
import { log } from "../../utils";
import InputTicketFinder from "./InputTicketFinder";

class UpdaterTicketButton extends ModuleUpdater {
    constructor(module) {
        super(module);
    }

    onUpdate() {
        const {module} = this;
        const {cache} = module;

        cache.spacer = document.getElementById('n0-ticket-finder');
        if(cache.spacer) {
            this.active = false;
            return;
        }

        cache.spacer = document.querySelector('header.v-app-bar .v-toolbar__content .v-spacer');
        if(cache.spacer) {

            let input = new InputTicketFinder(module, '№ ЗАЯВКИ', icons.arrowUp, {placeholder: true, size: "NORMAL"});
            cache.spacer.after(input.getElement());

            this.active = false;

        }
    }

}

export default UpdaterTicketButton;