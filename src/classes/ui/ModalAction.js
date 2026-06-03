import { createElement } from "../../utils.js";
import Modal from "./Modal.js";

class ModalAction extends Modal{

    constructor(title, btnName) {
        super();
        this.elements.frame.classList.add('n0-modal-action');

        let header = createElement('div', 'n0-header-action', null, title);
        this.setHeader(header);

        let footer = createElement('div', 'n0-footer-action');
        this.elements.footer.options = createElement('div', 'n0-footer-options', footer);
        this.elements.footer.button = createElement('button', 'n0-btn-green', footer, btnName);
        this.setFooter(footer);

        this.elements.footer.button.addEventListener('click', () => {
            this.onAction();
        });
    }

    addOption(element) {
        this.elements.footer.options.appendChild(element);
    }

    onAction() {}

}

export default ModalAction;