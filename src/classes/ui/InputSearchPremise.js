import { fetchJson, getBuildingsList, getPremisesList, getTicketsByPremise } from "../../scw";
import { log } from "../../utils";
import InputSCWFinderList from "./InputSCWFinderList";
import ModalTickets from "./ModalTickets";

class InputSearchPremise extends InputSCWFinderList {

    constructor() {
        super("ПОМЕЩЕНИЕ");

        this.building = "";
    }

    async api(search) {
        let result = await getPremisesList(this.building, search);
        let premises = [];
        for(const premise of result.results) {
            if(premise.number === search) premises.push(premise);
            else {
                let regex = new RegExp(`^${search}[ a-zA-Zа-яА-ЯёЁ]+`);
                if(regex.test(premise.number)) premises.push(premise);
                else {
                    regex = new RegExp(`^${search}[ a-zA-Zа-яА-ЯёЁ]+`);
                    if(regex.test(premise.number)) premises.push(premise);
                }
            }
        }
        return premises;
    }

    async onCurrent(current) {
        this.input.setState("WAITING");
        const tickets = (await getTicketsByPremise(current.data.id)).results;
        let modal = new ModalTickets(tickets);
        modal.open();
        this.input.setState("NORMAL");
    }

    getFullName(data) {
        return `${data.premise_type_short} ${data.number}`;
    }

    getShortName(data) {
        return `${data.premise_type_short} ${data.number}`;
        return `${data.number}`;
    }
}

export default InputSearchPremise;