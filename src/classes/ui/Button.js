import {createElement} from '../../utils';
import UIElement, { ElementStyle } from './UIElement';

class Button extends UIElement {

    /**
     * @param {string} name 
     * @param {Array} classNames
     * @param {Function} [action] 
     * @param {import('./UIElement').ElementOptions} [options] 
     */
    constructor(name, classNames, action = null, options = {}) {
        super({...options, style: ElementStyle.BUBBLE})
        this.name = name;
        this.action = action;
        this.classNames = classNames;
    }

    createElement() {
        if(this.element) this.element.remove();
        this.element = createElement('button', 'n0-button', null, this.name);
        this.element.addEventListener('click', this.action);
        for(const name of this.classNames) {
            this.element.classList.add(name);
        }
    }
}

export default Button; 