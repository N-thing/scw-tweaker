import InputText from "../classes/ui/InputText";
import InputTextAction from "../classes/ui/InputTextAction";
import icons from "../icons";
import { getTicketByNumber } from "../scw";
import { log } from "../utils";
import UpdaterTabTitle from "./BaseModule/UpdaterTabTitle";
import UpdaterTicketButton from "./BaseModule/UpdaterTicketButton";
import Module from "./Module";

class BaseModule extends Module {
    constructor(core) {
        super(core, 'base_module', 'Базовые преколы');
        this.cache.title = null;

        this.configs.addConfig('ticket_cache', 'Object', {});

        this.addUpdater(new UpdaterTabTitle(this));
        this.addUpdater(new UpdaterTicketButton(this));
    }

    applyPage(page) {
        super.applyPage(page);

        this.updaters[0].active = true;
    }

    onUpdate() {
        for(const updater of this.updaters) { updater.update(); }
    }

}

export default BaseModule;