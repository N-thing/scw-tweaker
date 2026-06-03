import { createElement } from "../../utils";

class Notifier {
    constructor() {
        this.elements = {};

        this.elements.base = createElement('div', 'n0-notifier', document.body);
    }
}

export default Notifier;