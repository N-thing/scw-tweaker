import ModuleUpdater from "../../classes/ModuleUpdater";

class UpdaterButtons extends ModuleUpdater {
    constructor(module) {
        super(module);
    }
    onUpdate() {
        const {cache} = this.module;
        if(!cache.header) { 
            cache.header = document.getElementById('floatMenu');
        } else {
            cache.headerButtons = cache.header.querySelectorAll('button span.v-btn__content:not(.buttoned)');
            for(const button of cache.headerButtons) {
                let btnTitle = button.innerHTML.toLocaleLowerCase().trim();

                if(btnTitle.startsWith('открыть чат')) button.innerHTML = "ЧАТ";
                else if(btnTitle.startsWith('создать связанную заявку')) button.innerHTML = "СОЗДАТЬ ЗАЯВКУ";
                else if(btnTitle.startsWith('принять к выполнению')) button.innerHTML = button.innerHTML.replace('Принять к выполнению', 'Принять');
                else if(btnTitle.startsWith('добавить дату контроля')) button.innerHTML = button.innerHTML.replace('Добавить дату контроля', 'Дата контроля ');
                else if(btnTitle.startsWith('отменить заявку')) button.innerHTML = button.innerHTML.replace('заявку ', '');
                else if(btnTitle.startsWith('вернуть ответственному')) button.innerHTML = button.innerHTML.replace('ответственному ', '');
                else if(btnTitle.startsWith('отправить данные по заявке в')) button.innerHTML = 'Отправить в 1с';

                button.classList.add('buttoned');
            }
        }
    }
}

export default UpdaterButtons;