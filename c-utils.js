import fetch from 'node-fetch';
import {JSDOM} from 'jsdom';
import fs from "fs"

export const retrieveDom = async (link) => {
    //TODO Atentie, raspunsurile sunt intentionat incetinite! Comenteaza liniile 8 si 9 pentru a scoate limitarea
    try {
        const delay = Math.floor(Math.random() * 1001) + 500;
        await new Promise(resolve => setTimeout(resolve, delay));

        const raw_page = await fetch(link);
        const page_text = await raw_page.text();
        const dom = new JSDOM(page_text);
        return dom.window.document;
    } catch (error) {
        console.log(error);
    }
}

export const getBaseUrl = (str) => {
    const slashCount = (str.match(/\//g) || []).length;

    if (slashCount >= 3) {
        const thirdSlashIndex = str.indexOf('/', str.indexOf('/', str.indexOf('/') + 1) + 1);
        str = str.slice(0, thirdSlashIndex);
    }

    return str;
}

export const writeSetInJson = (set, jsonName) => {
    console.log("Writing a set of ", set.size, " elements into ", jsonName)
    let json_array = Array.from(set);

    let json_string = JSON.stringify(json_array);

    fs.writeFile(jsonName, json_string, (err) => {
        if (err) {
            console.error('Error writing file:', err);
        } else {
            console.log('File written successfully');
        }
    });
}