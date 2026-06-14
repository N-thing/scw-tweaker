import InputTextAction from "../../classes/ui/InputTextAction";
import { getTicketByNumber } from "../../scw";
import { openDB } from 'idb';
import configs from "../../configs";
import Core from "../../core";
import { log } from "../../utils";

class InputTicketFinder extends InputTextAction {
    constructor(module, name, button, options) {
        super(name, button, options);
        this.module = module;
    }

    createElement() {
        super.createElement();

        this.element.id = "n0-ticket-finder";

        this.element.addEventListener('click', () => {
            if(this.options.state == "ERROR") this.setState("NORMAL");
        });

        this.input.addEventListener('input', function() {
            this.value = this.value.replace(/[^\d]/g, '');
        });

        this.input.addEventListener('focus', e => {
            this.input.select();
        });

    }

    async onAction() {
        const {module} = this;
        const number = parseInt(this.value.trim());

        let ticket = await Core.db.get('tickets-id-cache', number);
        log(ticket);
        if(ticket) {
            window.open(`https://z.service-company.biz/#/home/tickets/view/${ticket.id}`, '_blank');
            return;
        }

        this.setState("WAITING");
        ticket = await getTicketByNumber(number);
        if(ticket) {
            window.open(`https://z.service-company.biz/#/home/tickets/view/${ticket.id}`, '_blank');
            this.setState("NORMAL");
        } else {
            this.setState("ERROR", 3);
        }
    }
}

export default InputTicketFinder;