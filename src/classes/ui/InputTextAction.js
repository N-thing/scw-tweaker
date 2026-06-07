import Button from "./Button";
import InputText from "./InputText";

class InputTextAction extends InputText {
    constructor(name, button, options) {
        super(name, options);
        this.button = button;
    }
    
    createElement() {
        super.createElement();

        this.element.classList.add('n0-input-text-action');

        let button = new Button(this.button, {state: "READY"}, () => this.onAction(), ['action']);
        this.element.appendChild(button.getElement());

        this.input.addEventListener('keydown', (event) => {
            if (event.key === 'Enter') {
                event.preventDefault();
                this.onAction();
            }
        });

    }

    onAction() {}

}

export default InputTextAction;