import ModuleUpdater from "../../classes/ModuleUpdater";
import Button from "../../classes/ui/Button";
import Core from "../../core";
import { log } from "../../utils";

class UpdaterTicketCreate extends ModuleUpdater {
    constructor(module) {
        super(module);
    }

    onUpdate() {
        if(Core.page.section != 'ticket-create') {
            this.active = false;
            return;
        }

        if(!Core.page.data.ticket) {
            this.active = false;
            return;
        }

        const name = Core.page.data.ticket.getApplicantName();
        if(!name) {
            this.active = false;
            return;
        } 

        let radio = document.querySelector(`input[value="applicant"][type="radio"]`);
        let inputAppliccant = document.getElementById('resident-select-applicant');

        if(radio) {

            if(document.getElementById("applicant-inserter")) {
                this.active = false;
                return;
            }

            let insert = new Button('вставить из заявки', {size: "NORMAL", state: "NORMAL", style: "BUBBLE"});
            insert.getElement().id = "applicant-inserter";
            radio.parentElement.parentElement.parentElement.appendChild(insert.getElement());

            // insert.getElement().style.paddingLeft = '.5rem';
            // insert.getElement().style.paddingRight = '.5rem';
            insert.getElement().style.marginLeft = '.5rem';

            insert.action = () => {

                radio.checked = true;
                radio.dispatchEvent(new Event('input', { bubbles: true }));
                radio.dispatchEvent(new Event('change', { bubbles: true }));

                requestAnimationFrame(() => {
                    inputAppliccant.focus();
                    requestAnimationFrame(() => {
                        inputAppliccant.value = name;
                        inputAppliccant.dispatchEvent(new Event('input', { bubbles: true }));
                        inputAppliccant.dispatchEvent(new KeyboardEvent('keydown', {
                            key: 'Enter',       // Значение клавиши
                            code: 'Enter',      // Физический код клавиши
                            keyCode: 13,        // Устаревший, но всё еще нужный для старых скриптов код
                            bubbles: true,      // Позволяет событию всплывать по DOM-дереву
                            cancelable: true    // Позволяет отменить событие через preventDefault()
                        }));
                    });
                });
            };

            // let premise = `Помещения (${Core.page.data.ticket.premise.address.short.split(',').pop().trim()})`;
            let premise = `Помещения (${Core.page.data.ticket.premise.address.short})`;
            let labels = document.querySelectorAll(`label[for="v-select-applicant-premise"]`)
            for(const label of labels) {
                label.textContent = premise;
            }

            this.active = false;
        }
    }
}

export default UpdaterTicketCreate;