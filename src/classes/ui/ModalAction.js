import { createElement } from "../../utils.js";
import Button from "./Button.js";
import Modal from "./Modal.js";

class ModalAction extends Modal{

    /**
     * 
     * @param {String} title 
     * @param {String} btnName 
     * @param {import("./UIElement.js").ElementOptions} options 
     */
    constructor(title, btnName, options = {}) {
        super(options);

        // header
        this.header.setText(title, "CENTER");

        // footer
        this.elements.buttonAction = new Button(btnName, {size: "NORMAL", state: "READY"}, () => this.onAction());
        this.footer.setElement(this.elements.buttonAction, "RIGHT");

    }

    onAction() {}

}

export default ModalAction;