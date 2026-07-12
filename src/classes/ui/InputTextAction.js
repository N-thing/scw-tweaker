import Button from "./Button";
import InputText from "./InputText";

class InputTextAction extends InputText {
    constructor(name, buttonName, options) {
        super(name, options);
        this.buttonName = buttonName;
    }
    
    createElement() {
        super.createElement();

        this.element.classList.add('n0-input-text-action');

        let button = new Button(this.buttonName, {state: "READY"}, () => this.onAction(), ['action']);
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