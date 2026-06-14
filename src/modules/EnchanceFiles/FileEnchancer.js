import FileData from "../../classes/FileData";
import { createElement } from "../../utils";
import UIFile from "./UIFile";

export function enchanceFiles(module, element, files = null) {

    if(!files) {
        files = [];
        let filesEl = element.querySelectorAll('a');
        for(const fileEl of filesEl) {
            files.push(new FileData(fileEl));
        }
    }

    if(files.length == 0) return;

    element.style.display = 'none';
    let enchancedFiles = createElement('div', 'n0-files-enchanced', element.parentElement);
    let mediaFiles = createElement('div', 'media', enchancedFiles);
    let otherFiles = createElement('div', 'other', enchancedFiles);

    for(const file of files) {
        let uiFile = new UIFile(module, file);

        if(uiFile.isMedia) {
            mediaFiles.appendChild(uiFile.getElement());
        } else {
            otherFiles.appendChild(uiFile.getElement());
        }
    }
}