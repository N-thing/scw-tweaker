import { fetchJson, getBuildingsList } from "../../scw";
import InputSCWFinderList from "./InputSCWFinderList";

class InputSearchBuilding extends InputSCWFinderList {

    constructor() {
        super("ЗДАНИЕ");
    }

    async api(search) {
        let result = await getBuildingsList(search);
        return result.results;
    }

    getFullName(data) {
        return `г.${data.city.name}, ${data.address.short}`;
    }

    getShortName(data) {
        return `${data.address.short}`;
    }
}

export default InputSearchBuilding;