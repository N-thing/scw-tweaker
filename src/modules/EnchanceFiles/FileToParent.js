import ModalAction from "../../classes/ui/ModalAction.js";
import Core from "../../core.js";
import { getFileBlob, sendFiles } from "../../scw.js";
import { createElement } from "../../utils.js";

let schemas = [
    "Ответ собственнику",
    "Ответ от собственника",
    "Письмо-приглашение",
];

class FileToParent extends ModalAction {
    constructor(ticketId, file) {
        super("ОТПРАВИТЬ В РОДИТЕЛЯ", "ОТПРАВИТЬ");
        this.file = file;
        this.ticketId = ticketId;

        let input = createElement('input', 'n0-input');
        input.placeholder = "ПРЕФИКС";
        this.setContent(input);

        this.elements.footer.button.addEventListener('click', () => {
            this.elements.footer.button.classList.add('waiting');
        });

        let prefixes = createElement('button', 'n0-btn-drop-list', null, '<i class="fa-solid fa-caret-down"></i> ШАБЛОНЫ');
        this.addOption(prefixes);

        let prelist = createElement('div', 'n0-drop-list');
        prefixes.appendChild(prelist);

        prefixes.addEventListener('click', () => {
            prelist.classList.toggle('opened');
        });

        for(const pre of schemas) {
            let button = createElement('button', 'n0-drop-list-row', prelist, pre);
            button.addEventListener('click', () => {
                input.value = pre;
            });
        }
    }

    async onAction() {
        this.elements.footer.button.classList.remove('n0-error');
        this.elements.footer.button.classList.add('n0-waiting');

        let prefix = this.getContent().value;
        if(prefix != "") this.file.name = `${prefix} - ${this.file.name}`;

        let url = this.file.url.replace('https://', `https://n-thing.net/cors/`);
        let blob = await getFileBlob(url);
        if(blob == null) {
            this.elements.footer.button.classList.remove('n0-waiting');
            this.elements.footer.button.classList.add('n0-error');
            this.elements.footer.button.innerHTML = "ОШИБКА";
            return;
        }

        let file = new File([blob], this.file.name);

        let result = await sendFiles(this.ticketId, file);

        if(result.ok) {
            this.elements.footer.button.classList.remove('n0-waiting');
            this.close();
        } else {
            this.elements.footer.button.classList.remove('n0-waiting');
            this.elements.footer.button.classList.add('n0-error');
        }

    }

}

export default FileToParent;