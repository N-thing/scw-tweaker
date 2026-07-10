import ModuleUpdater from "../../classes/ModuleUpdater";
import Core from "../../core";
import { log } from "../../utils";
import { enchanceFiles } from "./FileEnchancer";

class UpdaterFiles extends ModuleUpdater {

    constructor(module) {
        super(module);
    }

    onUpdate() {
        if(
            Core.page.section != "ticket-view" ||
            document.querySelector('.n0-card-files')
        ) {
            this.active = false;
            return;
        }

        const {cache} = this;
        const {ticket} = Core.page.data;

        cache.cardTitles = document.querySelectorAll('.v-card--flat > .v-card-title');
        for(const cardTitle of cache.cardTitles) {

            if(cardTitle.innerHTML == "Файлы") {

                const filesEl = cardTitle.parentElement.querySelector(':scope > .v-card-text');
                enchanceFiles(this.module, filesEl);

                cardTitle.parentElement.classList.add('n0-card-files');
                this.active = false;
            }

        }

    }
}

export default UpdaterFiles;