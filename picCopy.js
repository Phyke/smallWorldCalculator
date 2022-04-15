import fs from 'fs';
import smallWorld from './smallWorld.js';

let cardList = await smallWorld.queryFromCDB("datas");
let textList = await smallWorld.queryFromCDB("texts");
smallWorld.mergeDataWithText(cardList, textList);

function copyCardImageById(id, srcFolder, desFolder) {
    fs.copyFile(srcFolder + `/${id}.jpg`, desFolder + `/${id}.jpg`, (err) => {
        if (err) console.log(id, 'not exist');;
        console.log('File was copied to destination');
    });
}

function getArcheByName(name) {
    const idList = [];
    for (const card of cardList) {
        if (card.name.includes(name)) idList.push(card.id);
    }
    return idList;
}

const idList = getArcheByName("Dark Contract");
console.log(idList, idList.length);

function copyAllCardImageById(idList) {
    for (const id of idList) {
        copyCardImageById(id,'./pics', './destination');
    }
}

//copyCardImageById('41546','./pics', './destination/');
copyAllCardImageById(idList);
// fs.copyFile('./pics/41546.jpg', desFolder, (err) => {
//     if (err) console.log(id, 'not exist');;
//     console.log('File was copied to destination');
// });