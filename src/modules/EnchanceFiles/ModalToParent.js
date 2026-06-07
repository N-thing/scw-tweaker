import Button from "../../classes/ui/Button.js";
import DropMenu from "../../classes/ui/DropMenu.js";
import InputText from "../../classes/ui/InputText.js";
import ModalAction from "../../classes/ui/ModalAction.js";
import Core from "../../core.js";
import icons from "../../icons.js";
import { getFileBlob, sendFiles } from "../../scw.js";
import { createElement, log } from "../../utils.js";

class ModalToParent extends ModalAction {
    
    constructor(module, ticket, file) {
        super(`ОТПРАВИТЬ В №${ticket.number}`, "ОТПРАВИТЬ", {width: 340});
        log(module.configs.get('file_prefixes'));
        this.module = module;
        this.file = file;
        this.ticketId = ticket.id;


        // Content
        let inputComment = new InputText('КОММЕНТАРИЙ');
        this.content.addElement(inputComment);
        this.elements.inputComment = inputComment;

        this.content.addElement(createElement('div', 'n0-devider'));

        let prefixBlock = createElement('div')
        prefixBlock.style.display = "flex";
        this.content.addElement(prefixBlock);

        let inputPrefix = new InputText('ПРЕФИКС ИМЕНИ ФАЙЛА');
        inputPrefix.getElement().style.flex = 1;
        prefixBlock.appendChild(inputPrefix.getElement());
        prefixBlock.appendChild(createElement('div', 'n0-devider'));
        this.elements.inputPrefix = inputPrefix;

        let btnAddPrefix = new Button('СОХР', {state: "NORMAL", size: "NORMAL", style: "BUBBLE"});
        btnAddPrefix.getElement().addEventListener('click', async () => {
            if(inputPrefix.value == "") return;
            btnAddPrefix.setState("WAITING");
            await this.addPrefix(inputPrefix.value);
            btnAddPrefix.setState("NORMAL");
        });
        prefixBlock.appendChild(btnAddPrefix.getElement());


        // Footer
        this.elements.schemasMenu = new DropMenu(`${icons.arrowDown} ШАБЛОНЫ`, {removes: true, size: "NORMAL", style: "ROUND", direction: {h: "right", v: "top"}});
        this.footer.addElement(this.elements.schemasMenu, "LEFT");
        this.updateSchemaPrefixes();

        this.elements.schemasMenu.onRemove = async (index) => {
            return await this.removePrefix(index);
        };
        
        this.getElement().classList.add('to-parent');
    }

    updateSchemaPrefixes() {
        this.elements.schemasMenu.clear();
        for(const schema of this.module.configs.get('file_prefixes')) {
            let el = new Button(schema, {size: "NORMAL", state: "NORMAL", style: "NORMAL"});
            el.action = () => {
                this.elements.inputPrefix.value = schema;
            };
            this.elements.schemasMenu.addElement(el);
        }
    } 

    async addPrefix(prefix) {
        let prefixes = this.module.configs.get('file_prefixes');
        prefixes.push(prefix);
        this.module.configs.set('file_prefixes', prefixes);
        await this.module.configs.save();
        this.updateSchemaPrefixes();
        return true;
    }

    async removePrefix(index) {
        let prefixes = this.module.configs.get('file_prefixes');
        prefixes.splice(index, 1);
        this.module.configs.set('file_prefixes', prefixes);
        await this.module.configs.save();
        return true;
    }

    async onAction() {
        this.elements.buttonAction.setState("WAITING");

        let fileName = this.file.name;

        let prefix = this.elements.inputPrefix.value;
        if(prefix != "") fileName = `${prefix} - ${fileName}`;

        let url = this.file.url.replace('https://', `https://n-thing.net/cors/`);
        let blob = await getFileBlob(url);
        if(blob == null) {
            this.elements.buttonAction.setState("ERROR");
            return;
        }

        let file = new File([blob], fileName);
        let comment = this.elements.inputComment.value;
        let result = await sendFiles(this.ticketId, file, comment);

        if(result.ok) {
            this.elements.buttonAction.setState("READY");
            this.close();
        } else {
            this.elements.buttonAction.setState("ERROR");
        }

    }

}

export default ModalToParent;