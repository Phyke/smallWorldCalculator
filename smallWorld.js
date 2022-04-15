import sqlite3 from "sqlite3";
import { open } from "sqlite";

const allowedTypeList = [17, 33, 129, 161, 545, 1057, 2081,4113,4129,2097185,4194337,16777233,16777249,16777361,16777377,16781457,16781473];

function getFieldList(cardList, field) {
    const typeList = [];
    let len = cardList.length;
    for (let i = 0; i < len; i++) {
        typeList.push(cardList[i][field]);
    }
    console.log(typeList);
    return typeList;
}

function filterMainDeckMonster(cardList) {
    const mainDeckMonster = [];
    let len_I = cardList.length;
    let len_J = allowedTypeList.length;
    for (let i = 0; i < len_I; i++) {
        for (let j = 0; j < len_J; j++) {
            if (cardList[i].type == allowedTypeList[j]) {
                mainDeckMonster.push(cardList[i]);
            }
        }
    }
    return mainDeckMonster;
}

function getCardIndexById(cardList, id) {
    return cardList.findIndex(card => card.id == id);
}

function compareCount(fullCardlist, middleCardList, index) {
    let count = 0;
    const resultList = [];
    //console.log(cardList);
    //console.log("index", index);
    for (const middleCard of middleCardList) {
        if(fullCardlist[index].race == middleCard.race) count++;
        if(fullCardlist[index].attribute == middleCard.attribute) count++;
        if(fullCardlist[index].level == middleCard.level) count++;
        if(fullCardlist[index].atk == middleCard.atk) count++;
        if(fullCardlist[index].def == middleCard.def) count++;
        if(count == 1) resultList.push(middleCard);
        count = 0;
    }
    return resultList;
}

function searchMiddle(cardList, id1, id3) {
    let firstResult = compareCount(cardList, cardList, getCardIndexById(cardList, id1));
    //console.log(firstResult);
    let finalResult = compareCount(cardList, firstResult, getCardIndexById(cardList, id3));
    //sortCardListByName(finalResult);
    //printCardName(finalResult);
    return finalResult;
}

function mergeDataWithText(cardList, textList) {
    for (let i = 0; i < cardList.length; i++) {
        for(let j = 0; j < textList.length; j++) {
            if(cardList[i].id == textList[j].id) {
                cardList[i].name = textList[j].name;
                cardList[i].desc = textList[j].desc;
                break;
            }
        }
    }
}

function filterbyField(cardList, field, value) {
    const result = [];
    for (const card of cardList) {
        if (card[field] == value) {
            result.push(card);
        }
    }
    return result;
}

async function printCardImage(id) {
    console.log(await terminalImage.file(`pics/${id}.jpg`, {width: "50%"}));
}

function sortCardListByName(cardList) {
    cardList.sort((a, b) => {
        if (a.name < b.name) return -1;
        if (a.name > b.name) return 1;
        return 0;
    });
    return cardList;
}

function printCardName(cardList) {
    for (const [i, card] of cardList.entries()) {
        console.log(i + 1, card.name);
    }
}

function searchAllPossible(cardList, startCardId) {
    let result = compareCount(cardList, cardList, getCardIndexById(cardList, startCardId));
    let resultList = [];
    for (const [i,card] of result.entries()) {
        resultList[i] = compareCount(result, cardList, getCardIndexById(result, card.id));
    }
    const map = new Map();
    let i = 0;
    for (const subResultList of resultList) {
        for (const card of subResultList) {
            i++;
            map.set(card.id, card);
        }
    }
    //console.log(map);
    console.log(i, ' - ' , map.size);
}

async function queryFromCDB(table) {
    const db = await open({
        filename: "cards.cdb",
        driver: sqlite3.Database,
    });
    const result = await db.all(`SELECT * FROM ${table}`);
    //console.log(result);

    await db.close();
    return result;
}

function getCardIdNameDesc(cardList) {
    const result = [];
    for (const [i,card] of cardList.entries()) {
        result[i] = {
            id:card.id,
            name:card.name,
            desc:card.desc
        }
    }
    return result;
}

export default {
    getFieldList,
    filterMainDeckMonster,
    getCardIndexById,
    compareCount,
    searchMiddle,
    mergeDataWithText,
    filterbyField,
    printCardImage,
    sortCardListByName,
    printCardName,
    searchAllPossible,
    queryFromCDB,
    getCardIdNameDesc
}