import InputText from "../classes/ui/InputText";
import InputTextAction from "../classes/ui/InputTextAction";
import icons from "../icons";
import { getTicketByNumber } from "../scw";
import { log } from "../utils";
import Module from "./Module";

class BaseModule extends Module {
    constructor(core) {
        super(core, 'base_module', 'Базовые преколы');
        this.cache.title = null;
        this.updates = [];

        this.configs.addConfig('ticket_cache', 'Object', {});

    }

    applyPage(page) {
        super.applyPage(page);

        this.updates.push(this.updateTabTitle);
        this.updates.push(this.updateAddTicketButton);
    }

    onUpdate() {
        for(const update of this.updates) { update(this); }
    }

    updateTabTitle(ctx) {
        const {cache} = ctx;

        cache.title = document.querySelector('.v-card-title.pa-0');
        if(cache.title) {
            if(ctx.page.section == 'ticket-view' && cache.title.innerHTML == "Заявка") {
                document.title = cache.title.innerHTML;
                return false;
            } else {
                cache.title.innerHTML = cache.title.innerHTML.replace('№ ', '№');
                document.title = cache.title.innerHTML;
                ctx.updates.splice(ctx.updates.indexOf(ctx.updateTabTitle), 1)
            }
        }
    }

    updateAddTicketButton(ctx) {
        const {cache} = ctx;

        log(ctx);

        cache.spacer = document.getElementById('n0-ticket-finder');
        if(cache.spacer) {
            ctx.removeUpdate(ctx.updateAddTicketButton);
            return;
        }

        cache.spacer = document.querySelector('header.v-app-bar .v-toolbar__content .v-spacer');
        if(cache.spacer) {

            let input = new InputTextAction('№ ЗАЯВКИ', icons.arrowUp, {placeholder: true, size: "NORMAL"});
            let inputElement = input.getElement();
            inputElement.id = "n0-ticket-finder";
            cache.spacer.after(inputElement);

            inputElement.addEventListener('click', () => {
                if(input.options.state == "ERROR") input.setState("NORMAL");
            });

            input.input.addEventListener('input', function() {
                this.value = this.value.replace(/[^\d]/g, '');
            });

            input.onAction = async () => {

                let cache = ctx.configs.getValue('ticket_cache');
                let number = input.value.trim();
                if(cache[number]) {
                    window.open(`https://z.service-company.biz/#/home/tickets/view/${cache[number]}`, '_blank');
                    return;
                }

                input.setState("WAITING");
                let ticket = await getTicketByNumber(number);
                if(ticket) {
                    cache[number] = ticket.id;
                    window.open(`https://z.service-company.biz/#/home/tickets/view/${ticket.id}`, '_blank');
                    await ctx.configs.setValue('ticket_cache', cache);
                    input.setState("NORMAL");
                } else {
                    input.setState("ERROR", 3);
                }
            }

            input.input.addEventListener('focus', e => {
                input.input.select();
            });
            
            ctx.removeUpdate(ctx.updateAddTicketButton);
        }
    }

    removeUpdate(func) {
        this.updates.splice(this.updates.indexOf(func), 1)
    }

}

export default BaseModule;