import ModuleUpdater from "../../classes/ModuleUpdater";
import Core from "../../core";
import { log } from "../../utils";
import { enchanceFiles } from "./FileEnchancer";

class UpdaterFiles extends ModuleUpdater {

    constructor(module) {
        super(module);
    }

    onUpdate() {
        if(Core.page.section != "ticket-view") return;
        
        const {cache} = this.module;
        const {ticket} = Core.page.data;

        cache.cardTitles = document.querySelectorAll('.v-card--flat > .v-card-title:not(.loaded)');
        for(const cardTitle of cache.cardTitles) {

            if(cardTitle.innerHTML == "Файлы") {
                cardTitle.classList.add('loaded');
                this.active = false;

                const filesEl = cardTitle.parentElement.querySelector(':scope > .v-card-text');
                enchanceFiles(this.module, filesEl);

            }

        }

    }
}

export default UpdaterFiles;