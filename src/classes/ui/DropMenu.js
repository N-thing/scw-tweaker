import { createElement } from "../../utils";
import List from "./List";
import UIElement from "./UIElement";

class DropMenu extends UIElement {

    /**
     * @param {import("./UIElement").ElementOptions & { removes?: Boolean, direction?: { v: "top" | "bottom", h: "left" | "right"} }} [options] 
     */
    constructor(name, options = {}) {
        super(options);
        this.options.direction = this.options.direction ?? {v: "botton", h: "right"};
        this.name = name;

        this.elements.list = new List(options);
        this.elements.list.onRemove = async index => this.onRemove(index);
    }

    createElement() {
        super.createElement();
        this.element = createElement('div', 'n0-drop-menu');
        createElement('div', 'n0-title', this.element, this.name);
        this.element.appendChild(this.elements.list.getElement());
    }

    /** @param {UIElement} element */
    addElement(element) {
        this.elements.list.addElement(element);
    }

    clear() {
        this.elements.list.clear();
    }

    async onRemove(index) {return true;}

}

export default DropMenu;