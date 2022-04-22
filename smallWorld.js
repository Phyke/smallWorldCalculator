import sqlite3 from "sqlite3";
import { open } from "sqlite";
import * as constants from "./constants.js";

const allowedTypeList = [
    constants.CATE_Monster_Normal, 
    constants.CATE_Monster_Normal_Tuner, 
    constants.CATE_Monster_Effect, 
    constants.CATE_Monster_Effect_Tuner, 
    constants.CATE_Monster_Spirit, 
    constants.CATE_Monster_Union, 
    constants.CATE_Monster_Gemini, 
    constants.CATE_Monster_Flip, 
    constants.CATE_Monster_Toon, 
    constants.CATE_Monster_Ritual, 
    constants.CATE_Monster_Ritual_Effect, 
    constants.CATE_Monster_Ritual_Spirit, 
    constants.CATE_Monster_Pendulum_Normal, 
    constants.CATE_Monster_Pendulum_Effect, 
    constants.CATE_Monster_Pendulum_Ritual_Normal, 
    constants.CATE_Monster_Pendulum_Ritual_Effect, 
    constants.CATE_Monster_Pendulum_Ritual_Normal_Tuner, 
    constants.CATE_Monster_Pendulum_Ritual_Effect_Tuner
];

/*

Map of Cards [
    Key = Card ID
    Value = <Card Object>
    CardID1 : {
        ot: <number>
        alias: <number>
        setcode: <number>
        category: <number>
        atf: <number>
        def: <number>
        level: <number>
        type: <number>
        attribute: <number>
        archetype: <number>
        name: <number>
        desc: <number>
        other: <array> [str1, str2, ..., str16]
    }
]

*/

class CARD {
    constructor(cardData, cardText) {
        this.cate = cardData.type;
        this.attribute = cardData.attribute;
        this.type = cardData.race;
        this.atk = cardData.atk;
        this.def = cardData.def;
        this.level = cardData.level;
        this.name = cardText.name;
        this.desc = cardText.desc;
        this.moreDesc = [
            cardText.str1, cardText.str2, cardText.str3, cardText.str4, 
            cardText.str5, cardText.str6, cardText.str7, cardText.str8, 
            cardText.str9, cardText.str10, cardText.str11, cardText.str12, 
            cardText.str13, cardText.str14, cardText.str15, cardText.str16, 
        ];
    }
}

async function queryFromCDB(fileName, table) {
    const db = await open({
        filename: fileName,
        driver: sqlite3.Database,
    });
    const result = await db.all(`SELECT * FROM ${table}`);
    //console.log(result);

    await db.close();
    return result;
}

function createCardMapFromArray(cardList, textList) {
    const cardMap = new Map();
    for (let i = 0; i < cardList.length; i++) {
        for(let j = 0; j < textList.length; j++) {
            if(cardList[i].id == textList[j].id) {
                cardMap.set(cardList[i].id, new CARD(cardList[i], textList[i]));
                break;
            }
        }
    }
    return cardMap;
}

async function getCardMap() {
    const cardList = await queryFromCDB("cards.cdb", "datas");
    const textList = await queryFromCDB("cards.cdb", "texts");
    const cardMap = createCardMapFromArray(cardList, textList);
    console.log(cardMap.size);
    return cardMap;
}

function filterMainDeckMonster(cardMap) {
    const cardMap_Main = new Map();
    for (const [key, value] of cardMap) {
        for (let j = 0; j < allowedTypeList.length; j++) {
            if (value.cate == allowedTypeList[j]) {
                cardMap_Main.set(key, value);
            }
        }
    }
    return cardMap_Main;
}

async function getMainDeckMonster() {
    return filterMainDeckMonster(await getCardMap());
}

/*
function getFieldList(cardList, field) {
    const typeList = [];
    let len = cardList.length;
    for (let i = 0; i < len; i++) {
        typeList.push(cardList[i][field]);
    }
    console.log(typeList);
    return typeList;
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
*/
export default {
    getMainDeckMonster
}