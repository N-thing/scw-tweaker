import Core from "../core";
import { log } from "../utils";

class Ticket {
    constructor(data) {
        
        for (const key of Object.keys(data)) {
            this[key] = data[key];
        }

        this.cache();
        log(this.number);

    }

    async cache() {
        const ticket = await Core.db.get('tickets-id-cache', this.number);
        if(ticket) return;

        await Core.db.put('tickets-id-cache', { number: this.number, id: this.id });
    }

    getApplicantName() {
        if(!this.applicant) return null;
        if(!this.applicant.fullName) {
            const {first_name, last_name, middle_name} = this.applicant;

            let name = "";
            name += `${last_name}` ?? "";
            name += ` ${first_name}` ?? "";
            name += ` ${middle_name}` ?? "";
            this.applicant.fullName = name.trim();
        }
        return this.applicant.fullName;
    }
}

export default Ticket;