import Core from "../core.js";
import Module from "./Module.js";
import { createElement, log, saveWithName } from "../utils.js";
import ModalToParent from './EnchanceFiles/ModalToParent.js';
import Modal from "../classes/ui/Modal.js";
import { getFileBlob } from "../scw.js";
import FileElement from "../classes/FileElement.js";
import CommentElement from "../classes/CommentElement.js";
import ImageSlider from "./EnchanceFiles/ImageSlider.js";
import configs from "../configs.js";
import icons from "../icons.js";
import Button from "../classes/ui/Button.js";

class EnchanceTicket extends Module {
    
    constructor(core) {
        super(core, "enchance_files", "Улучшение заявок");
        this.cache = {
            headerButtons: null,
            cardTitles: null,
            header: null,
        };

        this.configs.addConfig('file_prefixes', "Array", [
            "Ответ собственнику",
            "Ответ от собственника",
            "Письмо-приглашение",
        ]);
    }

    applyPage(page) {
        super.applyPage(page);
        const { cache } = this;
        const { ticket } = page.data;

        if(page.section == 'ticket-view') {

            this.loaded = {
                files: false
            };

            this.onUpdate = () => {

                cache.header = document.getElementById('floatMenu');
                if(cache.header) {
                    cache.headerButtons = cache.header.querySelectorAll('button span:not(.buttoned)');
                    for(const button of cache.headerButtons) {
                        let btnTitle = button.innerHTML.toLocaleLowerCase();

                        if(btnTitle.startsWith('открыть чат')) button.innerHTML = "ЧАТ";
                        else if(btnTitle.startsWith(' создать связанную заявку ')) button.innerHTML = "СОЗДАТЬ ЗАЯВКУ";
                        else if(btnTitle.startsWith('добавить дату контроля')) button.innerHTML = button.innerHTML.replace('Добавить дату контроля', 'Дата контроля ');
                        else if(btnTitle.startsWith('отменить заявку ')) button.innerHTML = button.innerHTML.replace('заявку ', '');
                        else if(btnTitle.startsWith('вернуть ответственному ')) button.innerHTML = button.innerHTML.replace('ответственному ', '');

                        button.classList.add('buttoned');
                    }
                }

                cache.cardTitles = document.querySelectorAll('.v-card--flat > .v-card-title:not(.loaded)');
                for(const cardTitle of cache.cardTitles) {

                    switch(cardTitle.innerHTML) {
                        case "Файлы":
                            cardTitle.classList.add('loaded');
                            cardTitle.parentElement.classList.add('n0-et-files');
                            this.checkFiles(ticket, cardTitle.parentElement);
                            break;
                        case "История":
                            this.checkComments(ticket, cardTitle.parentElement);
                            break;
                    }

                }

            };
        } else {
            this.onUpdate = () => {};
        }

    }

    checkComments(ticket, card) {
        let blocks = card.querySelectorAll('.v-card--flat .v-row:not(.v-row--dense) .v-col .v-row:not(.v-row--dense):not(.n0-comment)');

        for(let i=0; i<blocks.length; i++) {
            const block = blocks[i];
            let comment = new CommentElement(block);
            if(comment.files.length == 0) continue;
            comment.base.classList.add('n0-et-files');
            this.setFiles(ticket, comment.files)
        }
    }

    checkFiles(ticket, card) {

        let links = card.querySelectorAll('a:not(.n0-file)');
        let files = [];

        for(const link of links) {
            files.push(new FileElement(link));
        }

        this.setFiles(ticket, files);
    }

    initSlider() {
        if(this.slider) return;
        this.slider = new ImageSlider();
    }

    setFiles(ticket, files) {
        let list = [];
        let index = 0;

        for(let i=0; i<files.length; i++) {

            let file = files[i];
            file.element.classList.add('n0-file');

            if( file.type == 'image' ) {

                this.setElementImageFile(file);
                this.addDownloadButton(file);

                list.push(file);
                let current = index;
                index++;

                file.a.removeAttribute('href');
                file.a.addEventListener('click', e => {
                    this.slider.setList(list, current);
                    this.slider.open();
                });

            } else if( file.mimeType == 'application/pdf' ) {
            
                this.addDownloadButton(file);

                let a = file.a;
                a.removeAttribute('href');
                a.addEventListener('click', async e => {
                    file.element.classList.add('n0-state-waiting');
                    let url = file.url;
                    let blob = await getFileBlob(file.url.replace('https://', 'https://n-thing.net/cors/'));
                    if(blob != null) {
                        const namedFile = new File([blob], file.name, { type: file.mimeType });
                        url = URL.createObjectURL(namedFile);
                    } 
                    file.element.classList.remove('n0-state-waiting');
                    window.open(url, "_blank");
                });

            }

            // To Parent
            if(ticket.parent_ticket) {
                this.addBackwardButton(file, ticket)
            }

        }
    }

    setElementImageFile(file) {
        this.initSlider();

        let imagesBlock = file.element.parentElement.parentElement.querySelector('.n0-images');
        if(!imagesBlock) {
            imagesBlock = createElement('div', 'v-col v-col-12 n0-images', file.element.parentElement.parentElement);
        }

        let imageWrapper = createElement('div', 'n0-image-wrapper n0-file', imagesBlock);
        imageWrapper.appendChild(file.a);

        let originalDest = file.element.parentElement;
        file.element.remove();
        file.element = imageWrapper;
        file.a.innerHTML = "";

        if(originalDest.innerHTML == "") originalDest.remove();
        
        let img = createElement('img', 'n0-image', file.a);
        img.src = file.url;
    }

    addDownloadButton(file) {

        let name = `${icons.download}`;
        let classNames = ['download'];
        let action = async (e) => {
            let button = e.currentTarget.n0class;
            button.setState("WAITING");
            await saveWithName(file.url, file.name);
            button.setState("NORMAL");
        };

        let button = new Button(name, {size: "MICRO", state: "NORMAL"}, action, classNames);
        file.element.prepend(button.getElement());
    }

    addBackwardButton(file, ticket) {

        let name = `${icons.backward} В РОДИТЕЛЯ`;
        let classNames = ['to-parent'];
        let action = () => {
            let modal = new ModalToParent(this, ticket.parent_ticket, file);
            modal.open();
            modal.onClose = () => {modal = null;};
        };

        let button = new Button(name, {size: "SMALL", state: "READY"}, action, classNames);
        file.element.appendChild(button.getElement());
    }

}

export default EnchanceTicket;