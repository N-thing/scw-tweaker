import ModuleUpdater from "../../classes/ModuleUpdater";
import { log } from "../../utils";

class UpdaterTabTitle extends ModuleUpdater {

    constructor(module) {
        super(module);
    }

    onUpdate() {
        const {module} = this;
        const {cache} = module;

        cache.title = document.querySelector('.v-card-title.pa-0');
        if(cache.title) {
            if(module.page.section == 'ticket-view' && cache.title.innerHTML == "Заявка") {
                document.title = cache.title.innerHTML;
                return false;
            } else {
                cache.title.innerHTML = cache.title.innerHTML.replace('№ ', '№');
                document.title = cache.title.innerHTML;
                this.active = false;
            }
        }
    }
}

export default UpdaterTabTitle;