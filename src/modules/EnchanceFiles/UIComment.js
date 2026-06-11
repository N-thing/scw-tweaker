import UIElement from "../../classes/ui/UIElement";
import { createElement, log } from "../../utils";
import UIFile from "./UIFile";

class UIComment extends UIElement {

    constructor(commentData, options) {
        super(options);
        this.commentData = commentData;
    }

    enchance() {

    }

    enchanceFiles() {
        const { files } = this.commentData;
        if(files.length == 0) return;

        this.commentData.elements.files.style.display = 'none';
        let enchancedFiles = createElement('div', 'n0-files-enchanced', this.commentData.elements.files.parentElement);
        let mediaFiles = createElement('div', 'media', enchancedFiles);
        let otherFiles = createElement('div', 'other', enchancedFiles);

        for(const file of files) {
            let uiFile = new UIFile(file);

            if(file.type == "image" || file.type == "video") mediaFiles.appendChild(uiFile.getElement());
            else otherFiles.appendChild(uiFile.getElement());
        }

    }

}

export default UIComment;