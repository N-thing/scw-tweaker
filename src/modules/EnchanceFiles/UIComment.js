import Button from "../../classes/ui/Button";
import UIElement from "../../classes/ui/UIElement";
import Core from "../../core";
import { getTicketIdByNumber } from "../../scw";
import { createElement, log, openFile, switchClassWithPrefix } from "../../utils";
import { enchanceFiles } from "./FileEnchancer";

const systemTitles = [
    'Согласование изменения даты планируемого выполнения',
    'Дата планируемого выполнения изменена',
    'Новая заявка',
    'Исполнители изменены',
    'Наблюдатели изменены',
    'Ответственный изменён',
    'Статус изменён',
];

const systemUsers = [
    'Система'
];

class UIComment extends UIElement {

    constructor(module, commentData, options) {
        super(options);
        this.commentData = commentData;
        this.module = module;
    }

    enchanceText() {
        let textEl = this.commentData.elements.text.querySelector('div:not([class])');
        if(!textEl) return;

        let text = textEl.innerHTML;

        // Заявки в кнопки
        let regexTicket = /№(\d| )\d*/g;
        text = text.replace(regexTicket, ticket => {
            return `<span class="btn-ticket n0-state-normal" data-ticket-number="${ticket.replace('№', '')}">${ticket}</span>`;
        });

        textEl.innerHTML = text;

        let buttons = textEl.querySelectorAll('.btn-ticket');
        for(const button of buttons) {

            (async () => {
                switchClassWithPrefix(button, 'n0-state-', 'waiting');
                const number = button.getAttribute('data-ticket-number');
                const id = await getTicketIdByNumber(number);
                if(id) {
                    button.setAttribute('data-ticket-id', id);
                    switchClassWithPrefix(button, 'n0-state-', 'normal');
                    button.addEventListener('click', () => {
                        const id = button.getAttribute('data-ticket-id');
                        window.open(`https://z.service-company.biz/#/home/tickets/view/${id}`, '_blank');
                    });
                } else {
                    button.className = "";
                }
                
            })();
        }
        
    }

    enchance() {
        const {text: textEl, header: headerEl} = this.commentData.elements;
        this.commentData.elements.base.classList.add('enchance');
        let isSystem = false;

        if(systemTitles.includes(this.commentData.title) || systemUsers.includes(this.commentData.author)) isSystem = true;

        if(isSystem) {

            this.commentData.elements.base.classList.add('system');

            // textEl.textContent = textEl.textContent.replace('изменён на', '→');
            // textEl.textContent = textEl.textContent.replace('изменены на', '→');

            let type;

            switch(this.commentData.title) {

                case "Статус изменён":
                    textEl.textContent = textEl.textContent.replace('Статус', '');
                    type = createElement('span', 'type', null, 'статус')
                    type.setAttribute('data-type', 'статус');
                    this.commentData.elements.base.setAttribute('data-type', 'статус');
                    break;

                case "Исполнители изменены":
                    textEl.textContent = textEl.textContent.replace('Исполнители', '');
                    type = createElement('span', 'type', null, 'исполнители');
                    type.setAttribute('data-type', 'исполнители');
                    this.commentData.elements.base.setAttribute('data-type', 'исполнители');
                    break;

                case "Наблюдатели изменены":
                    textEl.textContent = textEl.textContent.replace('Наблюдатели', '');
                    type = createElement('span', 'type', null, 'наблюдатели');
                    type.setAttribute('data-type', 'наблюдатели');
                    this.commentData.elements.base.setAttribute('data-type', 'наблюдатели');
                    break;

                case "Ответственный изменён":
                    textEl.textContent = textEl.textContent.replace('Ответственный', '');
                    type = createElement('span', 'type', null, 'ответственный');
                    type.setAttribute('data-type', 'ответственный');
                    this.commentData.elements.base.setAttribute('data-type', 'ответственный');
                    break;

            }

            if(type) {
                type.addEventListener('click', () => {
                    let dataType = type.getAttribute('data-type');
                    let hightlight = !type.classList.contains('highlight');

                    let types = document.querySelectorAll(`.n0-comment.system .comment-text .type[data-type="${dataType}"]`);
                    for(const iType of types) {
                        if(hightlight) iType.classList.add('highlight');
                        else iType.classList.remove('highlight');
                    }

                    let comments = document.querySelectorAll(`.n0-comment`);
                    for(const comment of comments) {
                        if(hightlight) {
                            if(comment.getAttribute('data-type') == dataType) comment.style.display = null;
                            else comment.style.display = 'none';
                        } else comment.style.display = null;
                    }

                });
                textEl.prepend(type);
            }

        } else {

            if((/Пользователь.*добавил файлы/).test(this.commentData.text)) this.commentData.elements.text.style.display = 'none';
        
        }

    }

    enchanceFiles() {
        const { files } = this.commentData;
        const { files: filesEL } = this.commentData.elements;

        enchanceFiles(this.module, filesEL, files);

    }

}

export default UIComment;