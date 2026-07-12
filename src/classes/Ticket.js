import Core from "../core";
import { log } from "../utils";

const stages = [
    {
        "id": "a8cfafe4-a2d4-4152-824d-466bdf964357",
        "name": "Новая",
        "code": "new",
        "semantic_group": "new",
        "color": "#FFF59D",
        "order": 10,
        "deleted_at": null,
        "deleted_by": null,
        "is_active": true
    },
    {
        "id": "7c12ee88-6162-4ce7-a2ac-5be5903890d8",
        "name": "Оплата",
        "code": "payment",
        "semantic_group": "payment",
        "color": "#47E4C2",
        "order": 20,
        "deleted_at": null,
        "deleted_by": null,
        "is_active": true
    },
    {
        "id": "2256cd79-3805-414e-a7f1-fc22dceb211e",
        "name": "Назначение исполнителя",
        "code": "need_executor",
        "semantic_group": "new",
        "color": "#326690",
        "order": 30,
        "deleted_at": null,
        "deleted_by": null,
        "is_active": true
    },
    {
        "id": "deaf82bd-e46d-4b44-8e1c-b6771ec84341",
        "name": "Назначен исполнитель",
        "code": "executor_appointed",
        "semantic_group": "new",
        "color": "#90CAF9",
        "order": 40,
        "deleted_at": null,
        "deleted_by": null,
        "is_active": true
    },
    {
        "id": "2e470bc9-bc65-40e8-8c4a-0a62a37c49d1",
        "name": "В работе",
        "code": "in_progress",
        "semantic_group": null,
        "color": "#80DEEA",
        "order": 50,
        "deleted_at": null,
        "deleted_by": null,
        "is_active": true
    },
    {
        "id": "4e41f58e-3779-4cfe-94c5-d9fd503f9e28",
        "name": "Договор",
        "code": "contract",
        "semantic_group": null,
        "color": null,
        "order": 55,
        "deleted_at": null,
        "deleted_by": null,
        "is_active": true
    },
    {
        "id": "06b30a48-0f79-4b18-8254-69e93f235b0a",
        "name": "Ожидает ТМЦ",
        "code": "stuff_waiting",
        "semantic_group": null,
        "color": "#B39DDB",
        "order": 60,
        "deleted_at": null,
        "deleted_by": null,
        "is_active": true
    },
    {
        "id": "1a90003b-353d-4aa9-8680-0379973bb227",
        "name": "Работа не принята заявителем",
        "code": "not_taken_by_applicant",
        "semantic_group": null,
        "color": "#EF9A9A",
        "order": 70,
        "deleted_at": null,
        "deleted_by": null,
        "is_active": true
    },
    {
        "id": "031963b1-2cd0-459e-9944-f5277f7a6c61",
        "name": "Ожидаем ответ застройщика",
        "code": "waiting_builder_response",
        "semantic_group": null,
        "color": "#9FA8DA",
        "order": 80,
        "deleted_at": null,
        "deleted_by": null,
        "is_active": true
    },
    {
        "id": "d125f9be-181c-4c1f-b250-1a4c64ffc0e7",
        "name": "На проверке",
        "code": "on_check",
        "semantic_group": "finished",
        "color": "#A5D6A7",
        "order": 90,
        "deleted_at": null,
        "deleted_by": null,
        "is_active": true
    },
    {
        "id": "e6f6cd79-3805-414e-a7f1-fc22dceb2f55",
        "name": "Выполнена",
        "code": "finish",
        "semantic_group": "finished",
        "color": "#E6EE9C",
        "order": 105,
        "deleted_at": null,
        "deleted_by": null,
        "is_active": true
    },
    {
        "id": "ec26cd79-3805-414e-a7f1-fc22dceb2286",
        "name": "Отменена",
        "code": "cancel",
        "semantic_group": "canceled",
        "color": "#ffc2d1",
        "order": 110,
        "deleted_at": null,
        "deleted_by": null,
        "is_active": true
    },
    {
        "id": "6b37475f-b817-4124-a57f-7c90fa662386",
        "name": "Не гарантийная",
        "code": "without_warranty",
        "semantic_group": "canceled",
        "color": "#FFF0F8",
        "order": 115,
        "deleted_at": null,
        "deleted_by": null,
        "is_active": false
    }
];

class Ticket {
    constructor(data) {
        
        for (const key of Object.keys(data)) {
            this[key] = data[key];
        }

        for(const stage of stages) {
            if(stage.id == this.ticket_stage.id) {
                this.ticket_stage.data = stage;
                break;
            }
        }

        this.cache();

    }

    async cache() {
        const ticket = await Core.db.get('tickets-id-cache', this.number);
        if(ticket) return;

        await Core.db.put('tickets-id-cache', { number: this.number, id: this.id });
    }

    getApplicantName() {
        if(!this.applicant) return "";
        if(!this.applicant.fullName) {
            this.applicant.fullName = this.getName(this.applicant);
        }
        return this.applicant.fullName;
    }

    getExecutorName() {
        if(!this.executor) return "";
        if(!this.executor.fullName) {
            this.executor.fullName = this.getName(this.executor);
        }
        return this.executor.fullName;
    }

    getName(obj) {
        const {first_name, last_name, middle_name} = obj;

        let name = "";
        if(last_name) name += `${last_name} `;
        if(first_name) name += `${first_name} `;
        if(middle_name) name += `${middle_name}`;

        return name.trim();
    }
}

export default Ticket;