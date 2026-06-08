import UIElement from "../../classes/ui/UIElement";
import { createElement } from "../../utils";

class UIFile extends UIElement {
    constructor(options) {
        super(options);
    }

    createElement() {
        super.createElement();

        this.element = createElement('div', 'n0-file');
        

    }
}