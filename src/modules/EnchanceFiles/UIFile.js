import FileData from "../../classes/FileData";
import UIElement from "../../classes/ui/UIElement";
import { createElement } from "../../utils";

class UIFile extends UIElement {
    
    /**
     * @param {import("../../classes/ui/UIElement").ElementOptions} options 
     * @param {FileData} fileData 
     */
    constructor(options, fileData) {
        super(options);
        this.fileData = fileData;
    }

    createElement() {
        super.createElement();

        this.element = createElement('div', 'n0-file');
        this.element.classList.add(this.fileData.type);

        this.content = createElement('button', 'content', this.element);

        if(this.fileData.type == 'image') {
            let img = createElement('img', null, this.content);
            img.src = this.fileData.url;
        } else {

        }

    }
}

