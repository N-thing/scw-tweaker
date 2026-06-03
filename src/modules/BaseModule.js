import Module from "./Module";

class BaseModule extends Module {
    constructor(core) {
        super(core, 'base_module', 'Базовые преколы');
        this.cache.title = null;
    }

    applyPage(page) {
        super.applyPage(page);

        this.update = () => {
            if(this.setTabTitle(page.section)) this.update = () => {};
        }

    }

    setTabTitle(section) {
        const {cache} = this;

        cache.title = document.querySelector('.v-card-title.pa-0');
        if(cache.title) {
            if(section == 'ticket-view' && cache.title.innerHTML == "Заявка") {
                document.title = cache.title.innerHTML;
                return false;
            } else {
                cache.title.innerHTML = cache.title.innerHTML.replace('№ ', '№');
                document.title = cache.title.innerHTML;
                return true;
            }
        }

        return false;

    }
}

export default BaseModule;