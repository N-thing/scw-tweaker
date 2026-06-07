import icons from "../../icons";
import { createElement, log } from "../../utils";
import Button from "./Button";
import UIElement from "./UIElement";

class List extends UIElement {

    /** @param {import("./UIElement").ElementOptions & { removes?: Boolean }} options */
    constructor(options) {
        super(options);
        this.options.removes = this.options.removes ?? false;
    }

    createElement() {
        super.createElement();
        this.element = createElement('div', 'n0-list');
    }

    /** @param {UIElement} element */
    addElement(element) {
        let listElement = createElement('div', 'n0-list-element', this.getElement());

        let domElement = element.getElement();
        listElement.appendChild(domElement);

        if(this.options.removes) {
            let index = this.getElement().children.length - 1;
            let remove = new Button(icons.close, {}, async () => {
                element.setState("WAITING")
                remove.getElement().style.display = "none";
                let result = await this.onRemove(remove.index);
                if(result) {
                    listElement.remove();
                    this.updateRemoves();
                } else {
                    element.setState("NORMAL")
                    remove.getElement().style.display = null;
                }
            }, ['remove']);
            remove.index = index;
            listElement.appendChild(remove.getElement());
        }
        
    }

    updateRemoves() {
        let removes = this.getElement().querySelectorAll('.n0-button.remove');
        for(let i=0; i<removes.length; i++) {
            removes[i].n0class.index = i;
        }
    }

    clear() {
        this.getElement().replaceChildren();
    }

    async onRemove(index) {return true;}
}

export default List;