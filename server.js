import terminalImage from "terminal-image";
import smallWorld from './smallWorld.js';
import express from "express";
import { fileURLToPath } from 'url';
import { dirname } from 'path';
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const app = express();
app.use(express.static(__dirname));
const PORT = 3000;
import bodyParser from 'body-parser';
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

//import path from 'path';
//import res from "express/lib/response";
//import cors from 'cors';

app.get('/', (req, res) => {
    //res.header("Access-Control-Allow-Origin", "*");
    //res.send("asdsadasd");
    res.sendFile(`/index.html`);
})

app.post('/findMiddle', (req, res) => {
    console.log(req.body);
    const middleCardList = smallWorld.sortCardListByName(smallWorld.searchMiddle(mainDeckMonsterList, req.body[0], req.body[1]));
    const cardIdNameDescList = smallWorld.getCardIdNameDesc(middleCardList);
    res.send(JSON.stringify(cardIdNameDescList));
})

app.post('/findAllLink', (req, res) => {
    console.log(req.body);
    const middleCardList = smallWorld.sortCardListByName(smallWorld.compareCount(mainDeckMonsterList, mainDeckMonsterList, smallWorld.getCardIndexById(mainDeckMonsterList, req.body)));
    const cardIdNameDescList = smallWorld.getCardIdNameDesc(middleCardList);
    res.send(JSON.stringify(cardIdNameDescList));
})

app.listen(PORT, () => {
    console.log(`listening on port: ${PORT}`);
})

let mainDeckMonsterList;
async function setup() {
    //const x = await smallWorld.getMainDeckMonster();
    //console.log(x);
    
    //const x = smallWorld.searchMiddle(mainDeckMonsterList, 93013676, 45796834);
    //smallWorld.printCardName(x);
    //let spellcaster = smallWorld.filterbyField(x, "race", 2);
    //spellcaster =  smallWorld.sortCardListByName(spellcaster);
    //smallWorld.printCardName(spellcaster);

    //printCardName(compareCount(mainDeckMonsterList,mainDeckMonsterList, getCardIndexById(mainDeckMonsterList,10000080)));
    //printCardImage(55063751);

    //let result = smallWorld.compareCount(mainDeckMonsterList,mainDeckMonsterList,smallWorld.getCardIndexById(mainDeckMonsterList,10000080));
    //result = smallWorld.filterbyField(result, "race", 2);
    //result = smallWorld.sortCardListByName(result);
    //smallWorld.printCardName(result);
}

setup();