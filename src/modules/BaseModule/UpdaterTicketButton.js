import ModuleUpdater from "../../classes/ModuleUpdater";
import InputTextAction from "../../classes/ui/InputTextAction";
import icons from "../../icons";
import { elementExist, log } from "../../utils";
import InputTicketFinder from "./InputTicketFinder";

class UpdaterTicketButton extends ModuleUpdater {
    constructor(module) {
        super(module);
    }

    onUpdate() {
        const {module, cache} = this;

        // Проверка загрузки хедера
        if(!elementExist(cache.spacer)) {
            cache.spacer = document.querySelector('header.v-app-bar .v-toolbar__content .v-spacer');
            return;
        }

        // Проверка на дублирование поисковичка
        cache.ticketFinder = document.getElementById('n0-ticket-finder');
        if(cache.ticketFinder) {
            this.active = false;
            return;
        }

        // Создание поисковичка по номеру заявки
        let input = new InputTicketFinder(module, '№ ЗАЯВКИ', icons.arrowUp, {placeholder: true, size: "NORMAL"});
        cache.spacer.after(input.getElement());
        this.active = false;

    }

}

export default UpdaterTicketButton;