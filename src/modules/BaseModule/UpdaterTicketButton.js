import ModuleUpdater from "../../classes/ModuleUpdater";
import InputSCWFinderList from "../../classes/ui/InputSCWFinderList";
import InputSearchBuilding from "../../classes/ui/InputSearchBuilding";
import InputSearchPremise from "../../classes/ui/InputSearchPremise";
import InputTextAction from "../../classes/ui/InputTextAction";
import icons from "../../icons";
import { createElement, elementExist, log } from "../../utils";
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

        this.active = false;

        // Создание поисковичка по номеру заявки
        let inputTicket = new InputTicketFinder(module, '№ ЗАЯВКИ', icons.arrowUp, {placeholder: true, size: "NORMAL"});
        cache.spacer.after(inputTicket.getElement());

        // Создание поисковичка по номру помещения
        let roomFinder = createElement('div');
        roomFinder.id = 'n0-room-finder';
        cache.spacer.after(roomFinder);
        
        let inputBuilding = new InputSearchBuilding();
        inputBuilding.input.getElement().style.width = `320px`;
        inputBuilding.input.getElement().style.marginRight = `1rem`;
        // inputBuilding.input.setState("NORMALTRANSPARENT");
        roomFinder.appendChild(inputBuilding.getElement());

        let inputRoom = new InputSearchPremise();
        inputRoom.getElement().style.width = `140px`;
        inputRoom.getElement().style.marginRight = `1rem`;
        roomFinder.appendChild(inputRoom.getElement());

        inputBuilding.onCurrent = (current) => {
            this.module.configs.setValue('current_building', current);
            inputRoom.building = current.data.id;
        }

        let currentBuilding = this.module.configs.getValue('current_building');
        if(currentBuilding != null) {
            inputBuilding.setCurrent(currentBuilding.name, currentBuilding.data);
        }

    }

}

export default UpdaterTicketButton;