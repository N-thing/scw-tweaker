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
    NORMAL: "NORMAL",
    SLIM: "SLIM", 
    SMALL: "SMALL", 
    BIG: "BIG",
    YOURMOM: "YOURMOM",
});

/**
 * @typedef {keyof typeof ElementSize} ElementSize
 */

/**
 * @typedef {ElementOptions} Options
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
        this.options = {
            size: ElementSize.NORMAL,
            state: ElementState.NORMAL,
            style: ElementStyle.NORMAL,
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
    
    /**
     * @param {ElementSize} value 
     */
    setSize(value) {
        this.options.size = value;
        if(!this.element) return;
        switchClassWithPrefix(this.element, 'n0-size-', value.toLowerCase());
    }

    /**
     * @param {ElementState} value 
     */
    setState(value) {
        this.options.state = value;
        if(!this.element) return;
        switchClassWithPrefix(this.element, 'n0-state-', value.toLowerCase());
    }

    /**
     * @param {ElementStyle} value 
     */
    setStyle(value) {
        this.options.style = value;
        if(!this.element) return;
        switchClassWithPrefix(this.element, 'n0-style-', value.toLowerCase());
    }
}

export default UIElement;