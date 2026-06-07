import {switchClassWithPrefix} from '../../utils';

/**
 * @readonly
 */
export const ElementState = Object.freeze({ 
    NORMAL: "NORMAL", 
    READY: "READY", 
    LOADING: "LODAING", 
    WAITING: "WAITING", 
    ERROR: "ERROR", 
    DISABLED: "DISABLED",
});

/**
 * @typedef {keyof typeof ElementState} ElementState
 */

/**
 * @readonly
 */
export const ElementStyle = Object.freeze({ 
    NORMAL: "NORMAL",
    BUBBLE: "BUBBLE",
    ROUND: "ROUND",
});

/**
 * @typedef {keyof typeof ElementStyle} ElementStyle
 */

/**
 * @readonly
 */
export const ElementSize = Object.freeze({ 
    MICRO: "MICRO", 
    SLIM: "SLIM", 
    SMALL: "SMALL", 
    NORMAL: "NORMAL",
    BIG: "BIG",
    YOURMOM: "YOURMOM",
});

/**
 * @typedef {keyof typeof ElementSize} ElementSize
 */

/**
 * @typedef {Object} ElementOptions
 * @property {ElementSize} [size]
 * @property {ElementState} [state]
 * @property {ElementStyle} [style]
 */

class UIElement {

    /**
     * @param {ElementOptions} [options] 
     */
    constructor(options = {}) {
        this.element = null;
        /** @type {Object<string, UIElement>} */
        this.elements = {};
        this.options = {
            size: null,
            state: null,
            style: null,
        };
        Object.assign(this.options, options);
    }

    /**
     * @returns {HTMLElement}
     */
    getElement() {
        if(!this.element) {
            this.createElement();
            this.setState(this.options.state);
            this.setSize(this.options.size);
            this.setStyle(this.options.style);
            this.element.n0class = this;
        }
        return this.element;
    }

    createElement() {
        if(this.element) this.element.remove();
    }
    
    /**
     * @param {ElementSize} value 
     */
    setSize(value) {
        this.options.size = value;
        if(!this.element) return;
        switchClassWithPrefix(this.element, 'n0-size-', value);
    }

    /**
     * @param {ElementState} value 
     */
    setState(value, timer, final) {
        clearTimeout(this.tState);
        this.options.state = value;
        if(timer) {
            this.tState = setTimeout(() => {
                final = final ?? "NORMAL";
                this.setState(final);
            }, timer * 1000);
        }

        if(!this.element) return;
        switchClassWithPrefix(this.element, 'n0-state-', value);
    }

    /**
     * @param {ElementStyle} value 
     */
    setStyle(value) {
        this.options.style = value;
        if(!this.element) return;
        switchClassWithPrefix(this.element, 'n0-style-', value);
    }
}

export default UIElement;