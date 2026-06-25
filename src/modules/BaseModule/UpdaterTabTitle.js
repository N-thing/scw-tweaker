import ModuleUpdater from "../../classes/ModuleUpdater";
import { log } from "../../utils";

class UpdaterTabTitle extends ModuleUpdater {

    constructor(module) {
        super(module);
    }

    onUpdate() {
        const {module, cache} = this;

        cache.title = document.querySelector('.v-card-title.pa-0');
        if(cache.title) {

            document.title = cache.title.innerHTML;

            if(module.page.section == 'ticket-view') {

                if(cache.title.innerHTML.startsWith("Заявка №")) {

                    cache.title.innerHTML = cache.title.innerHTML.replace('№ ', '№');
                    document.title = cache.title.innerHTML;
                    this.active = false;
                    return;

                }
                
            } else {

                // Общий случай
                this.active = false;
                return;
            }

        }
    }
}

export default UpdaterTabTitle;