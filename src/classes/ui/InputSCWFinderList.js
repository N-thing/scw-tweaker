import { createElement, log } from "../../utils";
import Button from "./Button";
import InputText from "./InputText";
import List from "./List";
import UIElement from "./UIElement";

class InputSCWFinderList extends UIElement {
    constructor(name) {
        super();

        this.timer = null;
        this.prevSearch = "";
        this.current = {
            name: "",
            data: {}
        };

        this.input = new InputText(name);
        this.list = new List({size: "NORMAL", style: "ROUND"});

        this.input.input.addEventListener('input', () => {
            clearTimeout(this.timer);
            this.timer = setTimeout(() => {
                this.search();
            }, 1000);
        })

        this.input.input.addEventListener('keydown', (event) => {
            if (event.key === 'Enter') {
                event.preventDefault();
                clearTimeout(this.timer);
                this.search();
            }
        });

        this.input.input.addEventListener('blur', (event) => {
            this.list.getElement().classList.remove('open');
            this.prevSearch = "";
            this.input.value = this.current.name;
        });

        this.input.input.addEventListener('focus', (event) => {
            this.input.value = "";
        });

    }

    createElement() {
        super.createElement();
        
        this.element = createElement('div', 'n0-finder-list');
        this.element.appendChild(this.input.getElement());
        this.element.appendChild(this.list.getElement());

    }

    setCurrent(name, data) {
        this.current = {
            name: name,
            data: data,
        };
        this.input.value = name;
        this.onCurrent(this.current);
    }

    onCurrent() {};

    async search() {
        if(document.activeElement !== this.input.input) return;
        if(this.prevSearch == this.input.value || this.input.value == "") return;
        this.prevSearch = this.input.value;

        this.list.clear();
        this.list.getElement().classList.add('open');

        this.input.setState("WAITING");
        let results = await this.api(this.input.value);
        log(results);
        if(results.length == 0) {
            this.input.setState("NORMAL");
            return;
        }

        this.list.clear();

        for(const result of results) {
            let name = this.getFullName(result);
            let button = new Button(name, {style: "NORMAL", state: "READY", size: "NORMAL"});

            button.getElement().addEventListener('mousedown', (event) => {
                if (event.button === 0) {
                    this.setCurrent(this.getShortName(result), result);
                    this.list.getElement().classList.remove('open');
                }
            });

            this.list.addElement(button);
        }
        this.input.setState("NORMAL");

    }

    getShortName() {}
    getFullName() {}

    async api(search) {}
}

export default InputSCWFinderList;