import { createElement, log } from "../../utils";
import UIElement from "./UIElement";

class InputText extends UIElement{

    set value(value) { this.input.value = value; }
    get value() { return this.input.value; }

    /**
     * @param {import('./UIElement').ElementOptions & { placeholder?: boolean }} [options] 
     */
    constructor(name, options) {
        super({style: 'BUBBLE', size: 'NORMAL', state: 'NORMAL' ,...options});
        this.options.placeholder = this.options.placeholder ?? true;
        this.name = name;

        this.input = createElement('input', '');
        this.input.type = "text";
        this.input.placeholder = "";
        this.input.addEventListener('change', this.onChange);
    }

    createElement() {
        super.createElement();
        this.element = createElement('div', 'n0-input n0-input-text');
        this.element.appendChild(this.input);
        if(this.options.placeholder) createElement('div', 'placeholder', this.element, this.name);
    }

    onChange(e) {}
}

export default InputText;