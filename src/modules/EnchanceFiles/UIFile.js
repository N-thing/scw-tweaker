import FileData from "../../classes/FileData";
import Button from "../../classes/ui/Button";
import UIElement from "../../classes/ui/UIElement";
import Core from "../../core";
import icons from "../../icons";
import { getFileBlob } from "../../scw";
import { createElement, getAnyCors, getVideoFirstFrame, log, openFile, saveWithName } from "../../utils";
import MediaSlider from "./MediaSlider";
import ModalToParent from "./ModalToParent";

const openedExt = [
    'pdf'
];

const mediaTypes = [
    'video',
    'image'
];

class UIFile extends UIElement {
    
    /**
     * @param {import("../../classes/ui/UIElement").ElementOptions} options 
     * @param {FileData} fileData 
     */
    constructor(module, fileData, options) {
        super(options);
        this.module = module;
        this.fileData = fileData;
        this.isMedia = mediaTypes.includes(this.fileData.type);
        this.isOpen = openedExt.includes(this.fileData.extension) || mediaTypes.includes(this.fileData.type);
    }

    createElement() {
        super.createElement();

        const {isMedia, isOpen} = this;

        // main
        this.element = createElement('div', 'n0-file n0-state-normal');
        this.element.classList.add(this.fileData.type);

        // content
        this.content = createElement('button', 'content', this.element);
        this.contentWrapper = createElement('div', 'content-wrapper', this.content);

        if(isMedia) {

            if(this.fileData.type == 'image') {

                let img = createElement('img', null, this.contentWrapper);
                img.src = this.fileData.url;

            } else if(this.fileData.type == 'video') {

                // createElement('div', 'icon', this.contentWrapper, icons.play);

                (async () =>{
                    let img = createElement('img', null, this.contentWrapper);
                    img.src = await this.fileData.getPreviewUrl();
                })();
                
                
            }

        } else {
            if(!isOpen) createElement('div', 'extension', this.contentWrapper, icons.download);
            createElement('div', 'extension', this.contentWrapper, `.${this.fileData.extension}`);
        }

        // name
        this.fileName = createElement('div', 'file-name', this.contentWrapper, this.fileData.name);

        // controll
        let actions = createElement('div', 'actions', this.element);

        let options = {size: "SMALL"};
        if(isMedia) options = {size: "SMALL", style: "BUBBLE", state: isMedia ? "READY" : "NORMAL"};

        if(isOpen) {
            this.download = new Button(icons.download, options, null, ['download']);
            this.download.action = async () => {
                this.getElement().classList.add('n0-state-waiting');
                await saveWithName(this.fileData);
                this.getElement().classList.remove('n0-state-waiting');
            };
            actions.appendChild(this.download.getElement());
        }
        
        if(Core.page.data.ticket.parent_ticket) {

            this.backward = new Button(icons.backward, options, null, ['backward']);
            if(!isMedia) createElement('div', 'label', this.backward.getElement(), 'В РОДИТЕЛЯ');
            this.backward.action = () => {
                log('dsa');
                let modal = new ModalToParent(this.module, Core.page.data.ticket.parent_ticket, this.fileData);
                modal.open();
                modal.onClose = () => {modal = null;};
            }

            actions.appendChild(this.backward.getElement());

        }

        if(isMedia) {

            this.content.addEventListener('click', async () => {
                if(isOpen) {
                        
                    let base = this.getElement().parentElement;
                    if(!base.mediaList) {
                        base.mediaList = [];

                        const children = Array.from(base.children);
                        for(let i=0; i<children.length; i++) {
                            base.mediaList.push(children[i].n0class.fileData);
                            children[i].n0class.sliderIndex = i;
                        }
                    }

                    let slider = new MediaSlider();
                    slider.setList(base.mediaList, this.sliderIndex);
                    slider.open();

                } else {
                    await saveWithName(this.fileData);
                }
            });

        } else {

            this.content.addEventListener('click', async () => {
                this.getElement().classList.add('n0-state-waiting');
                if(isOpen) {
                    await openFile(this.fileData);
                } else {
                    await saveWithName(this.fileData);
                }
                this.getElement().classList.remove('n0-state-waiting');
            });
        }

    }
}

export default UIFile;