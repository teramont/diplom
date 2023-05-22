"use strict";
/**
 * Основная функция для совершения запросов
 * на сервер.
 * */
const createRequest = (options = {}) => {
    let xhr = new XMLHttpRequest();
    let formData = new FormData();
    xhr.responseType = options.responseType;
    if ('headers' in options) {
        for (let header in options.headers) {
            xhr.setRequestHeader(header, options.headers[header]);
        }
    }
    if (options.method === "GET") {
        options.url += "?";
        for (let param in options.data) {
            options.url += param + "=" + options.data[param] + "&";
            formData.append(param, options.data[param]);
        }
        options.url = options.url.slice(0, -1);
    } else {
        for (let param in options.data) {
            formData.append(param, options.data[param]);
        }
    }

    xhr.withCredentials = true;

    try {
        xhr.addEventListener("readystatechange", function () {
            if (this.readyState === 4 && this.status === 200) {
                options.callback(null, xhr.response);
            }
        });
    } catch (err) {
        options.callback(err);
    }

    xhr.open(options.method, options.url, true);

    try {
        if (options.method == "GET") {
            xhr.send();
        } else {
            xhr.send(formData);
        }

        return xhr;

    } catch (err) {
        options.callback(err);
    }
};