import InputTextAction from "../../classes/ui/InputTextAction";
import { getTicketByNumber } from "../../scw";

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

        let cache = module.configs.getValue('ticket_cache');
        let number = this.value.trim();

        if(cache[number]) {
            window.open(`https://z.service-company.biz/#/home/tickets/view/${cache[number]}`, '_blank');
            return;
        }

        this.setState("WAITING");
        let ticket = await getTicketByNumber(number);
        if(ticket) {
            cache[number] = ticket.id;
            window.open(`https://z.service-company.biz/#/home/tickets/view/${ticket.id}`, '_blank');
            await module.configs.setValue('ticket_cache', cache);
            this.setState("NORMAL");
        } else {
            this.setState("ERROR", 3);
        }
    }
}

export default InputTicketFinder;