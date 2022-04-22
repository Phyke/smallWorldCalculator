import sqlite3 from "sqlite3";
import { open } from "sqlite";
import * as constants from "./constants.js";

/**
 * - Variable containing constants of only main deck monster.
 * - Because "Small World" can search onlymain deck monster.
 */
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
/**Class representating a card */
class CARD {
    /**
     * - Create a card by using only important data.
     * - Input parameters are based on data structure from the DB.
     * @param {CardObjectFromDB} cardData Data from table "datas" in DB
     * @param {TextObjectFromDB} cardText Data from table "texts" in DB
     */
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

/**
 * - Query data from SQLite Database.
 * @param {string} fileName File name of the database to open in the same directory
 * @param {string} table Table name in the database to query
 * @returns {Promise<cardArray[]>} Array of objects from DB
 */
async function queryFromCDB(fileName, table) {
    const db = await open({
        filename: fileName,
        driver: sqlite3.Database,
    });
    const result = await db.all(`SELECT * FROM ${table}`);

    await db.close();
    return result;
}

/**
 * Create Map of cards by merging card datas and texts from DB into CARD class.
 * - Key = Card ID
 * - Value = CARD class object
 * @param {cardArray[]} cardList Array of card objects from DB
 * @param {textArray[]} textList Array of text objects from DB
 * @returns {Map<id, CARD>} Map of cards
 */
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

/**
 * This function wraps around other functions for easy function calling.
 * - 2 queries from DB
 * - Use data from DB to create Map of cards
 * @returns {Promise<Map<id, CARD>>} Map of cards
 */
async function getCardMap() {
    const cardList = await queryFromCDB("cards.cdb", "datas");
    const textList = await queryFromCDB("cards.cdb", "texts");
    const cardMap = createCardMapFromArray(cardList, textList);
    console.log("total card read from DB = ", cardMap.size);
    return cardMap;
}

/**
 * This function use global variable to filter only main deck monster.
 * @param {Map<id, CARD>} cardMap Map of cards
 * @returns {Map<id, CARD>} Map of cards (main deck monsters)
 */
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

/**
 * This function wraps around other functions for easy function calling.
 * @returns {Promise<Map<id, CARD>>} Map of cards (main deck monsters)
 */
async function getMainDeckMonster() {
    return filterMainDeckMonster(await getCardMap());
}

/**
 * Find cards that have the "Small World" relation with the base card.
 * - Exactly one match of [Type, Attribute, ATK, DEF, Level]
 * @param {Map<id, CARD>} cardMap_Full Full Map of cards (for getting data of the base card)
 * @param {Map<id, CARD>} cardMap_Ref Reference Map of cards (for searching and filtering)
 * @param {number} cardId ID of the base card
 * @returns {Map<id, CARD>} Map of cards that have the "Small World" relation
 */
function getRelatedCardFromId(cardMap_Full, cardMap_Ref, cardId) {
    let count = 0;
    const relatedMap = new Map();
    const baseCard = cardMap_Full.get(cardId);
    for (const [key, value] of cardMap_Ref) {
        if(value.type == baseCard.type) count++;
        if(value.attribute == baseCard.attribute) count++;
        if(value.level == baseCard.level) count++;
        if(value.atk == baseCard.atk) count++;
        if(value.def == baseCard.def) count++;
        if(count == 1) relatedMap.set(key, value);
        count = 0;
    }
    return relatedMap;
}

const main = await getMainDeckMonster();
const related = getRelatedCardFromId(main, main, 2009101);
console.log(related.size);
const result = getRelatedCardFromId(main, related, 10000080);
console.log(result.size);

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