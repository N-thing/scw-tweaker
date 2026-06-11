import FileData from "../../classes/FileData";
import Button from "../../classes/ui/Button";
import UIElement from "../../classes/ui/UIElement";
import icons from "../../icons";
import { createElement } from "../../utils";

class UIFile extends UIElement {
    
    /**
     * @param {import("../../classes/ui/UIElement").ElementOptions} options 
     * @param {FileData} fileData 
     */
    constructor(module, fileData, options) {
        super(options);
        this.module = module;
        this.fileData = fileData;
    }

    createElement() {
        super.createElement();
        let media = false;

        // main
        this.element = createElement('div', 'n0-file n0-state-normal');
        this.element.classList.add(this.fileData.type);

        // content
        this.content = createElement('button', 'content', this.element);
        this.contentWrapper = createElement('div', 'content-wrapper', this.content);

        if(this.fileData.type == 'image') {

            media = true;
            let img = createElement('img', null, this.contentWrapper);
            img.src = this.fileData.url;

        } else if(this.fileData.type == 'video') {

            media = true;
            createElement('div', 'icon', this.contentWrapper, icons.play);

        } else {
            createElement('div', 'extension', this.contentWrapper, `.${this.fileData.extension}`);
        }

        // name
        this.fileName = createElement('div', 'file-name', this.contentWrapper, this.fileData.name);

        // controll
        let actions = createElement('div', 'actions', this.element);

        let options = {size: "SMALL"};
        if(media) options = {size: "SMALL", style: "BUBBLE", state: media ? "READY" : "NORMAL"};

        this.download = new Button(icons.download, options, null, ['download']);
        actions.appendChild(this.download.getElement());
        
        this.backward = new Button(icons.backward, options, null, ['backward']);
        actions.appendChild(this.backward.getElement());
        
        if(!media) createElement('div', 'label', this.backward.getElement(), 'В РОДИТЕЛЯ');

    }
}

export default UIFile;