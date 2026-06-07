import {createElement} from '../../utils';
import UIElement, { ElementStyle } from './UIElement';

class Button extends UIElement {

    /**
     * @param {string} name 
     * @param {Array} [classNames]
     * @param {Function} [action] 
     * @param {import('./UIElement').ElementOptions} [options] 
     */
    constructor(name, options = {}, action = null, classNames = []) {
        super({style: ElementStyle.BUBBLE, ...options})
        this.name = name;
        this.action = action;
        this.classNames = classNames;
    }

    createElement() {
        super.createElement();
        this.element = createElement('button', 'n0-button', null, this.name);
        this.element.addEventListener('click', this.action);
        for(const name of this.classNames) {
            this.element.classList.add(name);
        }
    }
}

export default Button; 