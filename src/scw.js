import Ticket from './classes/Ticket.js';
import Core from './core.js';
import {log} from './utils.js';

function getUserToken() { return localStorage.getItem('accessToken'); }
function getUserId() { return localStorage.getItem('userId'); }

export async function fetchSCW(url, type, body, extra) {
    extra = extra || {};
    let options = {
        "headers": {
            "Authorization": `Token ${getUserToken()}`,
        },
        "method": type
    };
    if(typeof body != "undefined") options.body = body;
    if(typeof extra.contentType == "undefined") {
        options["headers"]["Content-Type"] = "application/json";
    } else if(extra.contentType != "files") {
        options["headers"]["Content-Type"] = extra.contentType;
    }
    return await fetch(url, options);
}

export async function fetchJson(url, type, body) {
    return await (await fetchSCW(url, type, body)).json();
}

//=============================
//          CREATE
//=============================

export async function createTicket (applicant, destination, text, ticket_options, _parent, _isworker, _files) {

    // destination =>
    // residential_complex - ЖК
    // building - Дом
    // [entrance] - подъезд
    // [floor] - этаж
    // [premise] - id помещения

    let body = {
        applicant: applicant,                                         // id собственника
        residential_complex: destination.residential_complex,         // ЖК
        building: destination.building,                               // Дом
        files: _files || [],                                          // id файлов после загрузки их в систему
        images: [],
        is_from_worker: _isworker || false,
        text: text,
        ticket_department: ticket_options.department,
        ticket_kind: ticket_options.kind,
        ticket_type: ticket_options.type
    }

    if(typeof _parent != 'undefined') body.parent_ticket = _parent;

    if(typeof destination.entrance != 'undefined' && destination.entrance != null) body.entrance = destination.entrance;
    if(typeof destination.floor != 'undefined' && destination.floor != null) body.floor = destination.floor;
    if(typeof destination.premise != 'undefined' && destination.premise != null) body.premise = destination.premise;

    console.log(destination);

    // id
    // number
    // title
    return await (await fetchSCW('https://api.service-company.biz/zebra_api/ticket/', 'POST', JSON.stringify(body))).json();
}

//=============================
//          SENDS
//=============================

export async function sendFeedback(ticketId, rating, _msg, _points) {
    let msg = _msg || "";
    let points = _points || []
    let body = {
        csi_poll: 65,
        comment: msg,
        rating: rating,
        feedback_points: points,
        ticket: ticketId
    };
    return await fetchSCW('https://api.service-company.biz/zebra_api/feedback/send_feedback/', 'POST', JSON.stringify(body));
}

export async function sendFiles(id, files, comment = "") {
    if(typeof files != 'array') files = [files];

    let body = new FormData();
    for(const file of files) {
        body.append('files', file, file.name);
    }
    if(comment != "") body.append('comment', comment);
    return await fetchSCW(`https://api.service-company.biz/zebra_api/file/ticket_attachment/${id}/`, 'POST', body, {contentType: "files"});
}

export async function sendComment(type, id, text, _needSolution) {
    let needSolution = _needSolution || false;
    let body = {
        entity_id: id,
        entity_type: type,
        need_solution: needSolution,
        text: text,
    };
    return await fetchSCW('https://api.service-company.biz/zebra_api/entity/comment/', 'POST', JSON.stringify(body));
}

export async function sendCommentToTicket(ticketId, text, _needSolution) {
    let needSolution = _needSolution || false;
    return await sendComment("Ticket", ticketId, text, needSolution);
}

//=============================
//          GETTERS
//=============================

export function getCurrentFilter() {
    let filtersRaw = JSON.parse(localStorage.getItem(`filter_tickets_${localStorage.getItem('userId')}`)).fields;
    let filters = {};

    for(const filter of filtersRaw) {
        const {code, value} = filter;

        if(Array.isArray(value)) {
            if(value.length > 0) {
                filters[`${code}__in`] = [];
                for( const val of value ) {
                    filters[`${code}__in`].push(val.id);
                }
            }
        }

    }

    return filters;
}

export async function getTicketsList(_filter, _limit, _page, _order) {
    const body = JSON.stringify(_filter) || "{}";
    const page = _page || 1;
    const limit = _limit || 10;
    const order = _order || "-number";

    return await fetchJson(
        `https://api.service-company.biz/zebra_api/post/tickets/?page=${page}&page_size=${limit}&ordering=${order}`,
        "POST",
        body
    );
}

export async function getTicketByNumber(number) {
    let tickets = (await getTicketsList({search: number}, 100, 1, 'number')).results;
    if(tickets.length == 1) return new Ticket(tickets[0]);
    if(tickets.length > 1) {
        for(const ticket of tickets) {
            if(ticket.number == number) return new Ticket(ticket);
        }
    }
    return null;
}

export async function getTicketById(id) {
    let data = await fetchJson(
        `https://api.service-company.biz/zebra_api/ticket/${id}/`,
        "GET"
    );
    return new Ticket(data);
}

export async function getWorkers(name) {
    return await fetchJson(
        `https://api.service-company.biz/zebra_api/department/worker/users/?page=1&page_size=6&search=${name}`,
        "GET"
    );
}

export async function getFileBlob(url) {
    const response = await fetch(url);
    if (!response.ok) {
        log(`Ошибка загрузки файла: ${response.statusText}`);
        return null;
    }
    const fileBlob = await response.blob();
    return fileBlob;
}

//=============================
//          SETTERS
//=============================

// "d125f9be-181c-4c1f-b250-1a4c64ffc0e7" - на закрытие
export async function setTicketStage(ticketId, stageId, _options) {
    let options = _options || {};
    let body = {
        ticket_stage: stageId,
        ...options
    };
    return await fetchSCW(
        `https://api.service-company.biz/zebra_api/ticket/${ticketId}/stage/`,
        "PUT",
        JSON.stringify(body)
    );
}

export async function setTicketManager(ticketId, userId) {
    return await fetchSCW(
        `https://api.service-company.biz/zebra_api/ticket/${ticketId}/manager/`,
        "PUT",
        JSON.stringify({"user": userId})
    );
}

export async function setTicketResponsible(ticketId, userId) {
    return await fetchSCW(
        `https://api.service-company.biz/zebra_api/ticket/${ticketId}/responsible/`,
        "PUT",
        JSON.stringify({"user": userId})
    );
}

export async function setTicketExecutor(ticketId, userId) {
    return await fetchSCW(
        `https://api.service-company.biz/zebra_api/ticket/${ticketId}/executor/`,
        "PUT",
        JSON.stringify({"user_id": userId})
    );
}

export async function setTicketAuditors(ticketId, userIds) {
    return await fetchSCW(
        `https://api.service-company.biz/zebra_api/ticket/${ticketId}/auditors/`,
        "PUT",
        JSON.stringify({"auditors": userIds})
    );
}

// FUNCTIONS

export async function destroyTicket(ticketId) {
    await setTicketManager(ticketId, myId);
    await setTicketResponsible(ticketId, myId);
    await setTicketExecutor(ticketId, myId);
    await setTicketAuditors(ticketId, [myId]);
    await setTicketStage(ticketId, "ec26cd79-3805-414e-a7f1-fc22dceb2286", {cancel_comment: "Отмена тестовой заявки", cancel_reason: "test"});
}