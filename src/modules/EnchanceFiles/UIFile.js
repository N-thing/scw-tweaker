import FileData from "../../classes/FileData";
import UIElement from "../../classes/ui/UIElement";
import icons from "../../icons";
import { createElement } from "../../utils";

class UIFile extends UIElement {
    
    /**
     * @param {import("../../classes/ui/UIElement").ElementOptions} options 
     * @param {FileData} fileData 
     */
    constructor(fileData, options) {
        super(options);
        this.fileData = fileData;
    }

    createElement() {
        super.createElement();

        // main
        this.element = createElement('div', 'n0-file');
        this.element.classList.add(this.fileData.type);

        // content
        this.content = createElement('button', 'content', this.element);
        this.contentWrapper = createElement('div', 'content-wrapper', this.content);

        if(this.fileData.type == 'image') {

            let img = createElement('img', null, this.contentWrapper);
            img.src = this.fileData.url;

        } else if(this.fileData.type == 'video') {

            createElement('div', 'icon', this.contentWrapper, icons.play);

        } else {
            createElement('div', 'extension', this.contentWrapper, `.${this.fileData.extension}`);
        }

        // name
        this.fileName = createElement('div', 'file-name', this.contentWrapper, this.fileData.name);

    }
}

export default UIFile;