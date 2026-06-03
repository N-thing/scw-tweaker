import { createElement } from "../../utils.js";

class Modal {
    constructor(options) {
        options = options || {};
        this.options = {
            once: true,
            size: "small"
        };
        Object.assign(this.options, options);
        this.elements = {};
        this.tc = null;

        // background
        this.elements.shadow = document.createElement('div');
        this.elements.shadow.className = "n0-modal-shadow";
        this.elements.shadow.addEventListener('click', (e) => {
            if(e.target == this.elements.shadow) this.close();
        });

        // frame
        this.elements.frame = document.createElement('div');
        this.elements.frame.className = `n0-modal-frame size-${this.options.size}`;
        this.elements.shadow.appendChild(this.elements.frame);

        this.elements.header = createElement('div', `n0-modal-header`, this.elements.frame);
        this.elements.header.style.display = 'none';
        this.elements.content = createElement('div', `n0-modal-content`, this.elements.frame);
        this.elements.footer = createElement('div', `n0-modal-footer`, this.elements.frame);
        this.elements.footer.style.display = 'none';

        this.close();
        document.body.appendChild(this.elements.shadow);
    }

    setHeader(element) {
        this.elements.header.innerHTML = "";
        this.elements.header.appendChild(element);
        this.elements.header.style.display = null;
    }

    setContent(element) {
        this.elements.content.innerHTML = "";
        this.elements.content.appendChild(element);
    }
    getContent() {
        let content = this.elements.content.children[0];
        return content || null;
    }

    setFooter(element) {
        this.elements.footer.innerHTML = "";
        this.elements.footer.appendChild(element);
        this.elements.footer.style.display = null;
    }

    close() {
        this.tc = setTimeout(() => {
            this.elements.shadow.style.display = 'none';
            if(this.options.once) this.remove();
        }, 200);
        this.onClose();
        this.elements.shadow.classList.remove('opened')
        this.elements.shadow.classList.add('closed')
    }
    onClose() {}

    open() {
        clearTimeout(this.tc);
        this.elements.shadow.style.display = null;
        setTimeout(() => {
            this.elements.shadow.classList.add('opened')
            this.elements.shadow.classList.remove('closed')
        }, 20);
    }
    onOpen() {}

    remove() {
        this.elements.shadow.remove();
        delete this;
    }
}

export default Modal;