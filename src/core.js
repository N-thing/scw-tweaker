import { getTicketById } from './scw.js'
import CommentElement from './classes/CommentElement.js';
import FileElement from './classes/FileElement.js';
import { getCurrentTicketId, log } from './utils.js';
import configs from './configs.js';
import Notifier from './classes/ui/notifier.js';

class Core {

    constructor() {
        this.modules = [];
        this.notifier = new Notifier();

        window.n0intervals = {};
    }

    init() {

        // инциализация модулей
        for(const module of this.modules) module.init(this);

        // Определение события смены странички
        let lastHash = window.location.hash;
        setInterval(() => {
            if (window.location.hash !== lastHash) {

                window.dispatchEvent(new CustomEvent('urlchange', {
                    bubbles: false,
                    detail: {
                        oldHash: lastHash
                    }
                }));
                lastHash = window.location.hash;

            }
        }, 250);

        // Определение страницы
        this.updateUrl();
        window.addEventListener('urlchange', () => this.updateUrl());

        // update
        clearInterval(window.coreInterval);
        window.coreInterval = setInterval(() => {
            for(const module of this.modules) {
                if(!module.configs.get('enabled')) continue;
                module.update();
            }
        }, configs.intervalFreq);
        
    }

    addModule(module) {
        this.modules.push(module);
    }

    async updateUrl() {
        let page = await this.getPageData();

        // смена странички для всего остального
        for(const module of this.modules) {
            if(!module.configs.get('enabled')) continue;
            module.applyPage(page);
        }
    }

    async getPageData() {

        let path = location.hash.slice(2).split('/');
        let section = null;
        let data = {};

        switch(`${path[0]}/${path[1]}/${path[2]}`) {
            case 'home/tickets/view':
                section = 'ticket-view';
                data.ticket = await getTicketById(getCurrentTicketId());
        }

        let page = {
            path: path,
            section: section,
            data: data
        };

        return page;
    }

}

export default Core;