import { createElement, log, resetAnimation } from "../../utils.js";
import UIElement from "./UIElement.js";

class Modal extends UIElement {

    /** @param {...import("./UIElement.js").ElementOptions & { oneoff?: boolean, width?: Int32Array, height?: Int32Array}} [options] */
    constructor(options) {
        super(options);
        this.options.oneoff = this.options.oneoff ?? true;

        this.header = new ModalComponent("header");
        this.content = new ModalComponent("content");
        this.footer = new ModalComponent("footer");

        document.body.appendChild(this.getElement());
    }

    createElement() {
        super.createElement();
        this.element = createElement('div', 'n0-modal close');

        // shadow
        let shadow = createElement('div', 'n0-shadow', this.element);
        shadow.addEventListener('click', () => this.close());

        // frame
        let frame = createElement('div', 'n0-frame', this.element);
        frame.appendChild(this.header.getElement());
        frame.appendChild(this.content.getElement());
        frame.appendChild(this.footer.getElement());

        if(this.options.width) frame.style.width = `${this.options.width}px`;
        if(this.options.height) frame.style.height = `${this.options.height}px`;
    }

    open() {
        clearTimeout(this.ts);
        resetAnimation(this.getElement());
        this.getElement().classList.remove('close');
        this.getElement().classList.add('open');
        this.onOpen();
    }
    onOpen() {}

    /** Dont forget remove all links inside onClose (var = null) */
    close() {
        if(this.options.oneoff) this.ts = setTimeout(() => {
            this.element.remove();
            this.onClose();
        }, 1000);
        this.getElement().classList.add('close');
        this.getElement().classList.remove('open');
    }
    onClose() {}
}


class ModalComponent extends UIElement {
    
    /**
     * @param {string} id 
     */
    constructor(id) { 
        super(); 
        this.id = id;
    }

    /**
     * @param {"LEFT" | "CENTER" | "RIGHT"} position
     */
    show() { 
        this.getElement().style.display = null;
    }
    hide() { this.getElement().style.display = 'none'; }

    createElement() {
        super.createElement();
        this.element = createElement('div', `n0-${this.id}`);
        this.element.style.display = 'none';

        /** @type {HTMLElement} */
        this.left = createElement('div', 'left', this.element);
        /** @type {HTMLElement} */
        this.center = createElement('div', 'center', this.element);
        /** @type {HTMLElement} */
        this.right = createElement('div', 'right', this.element);
    }

    /**
     * @param {string} text 
     * @param {"LEFT" | "CENTER" | "RIGHT"} [position] 
     */
    setText(text, position = "CENTER") {
        this[position.toLowerCase()].textContent = text;
        this.show();
    }

    /**
     * @param {HTMLElement | UIElement} element 
     * @param {"LEFT" | "CENTER" | "RIGHT"} [position] 
     */
    setElement(element, position = "CENTER") {
        if(!(element instanceof HTMLElement)) element = element.getElement();
        this[position.toLowerCase()].replaceChildren();
        this[position.toLowerCase()].appendChild(element);
        this.show();
    }

    /**
     * @param {HTMLElement | UIElement} element 
     * @param {"LEFT" | "CENTER" | "RIGHT"} [position] 
     */
    addElement(element, position = "CENTER") {
        if(!(element instanceof HTMLElement)) element = element.getElement();
        this[position.toLowerCase()].appendChild(element);
        this.show();
    }
    
}

export default Modal;