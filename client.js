const radioButtons = document.querySelectorAll('input[name="searchType"]');

const radioMiddle = document.getElementById('searchMode_middle');
const radioAllLink = document.getElementById('searchMode_allLink');
const radioLMAO = document.getElementById('searchMode_test');

const fieldMiddle = document.getElementById('searchField_middle');
const fieldAllLink = document.getElementById('searchField_allLink');
const fieldLMAO = document.getElementById('searchField_test');

const hand = document.getElementById('hand');
const target = document.getElementById('target');
const myCard = document.getElementById('myCard');

const submitButton = document.querySelector('#submitButton');

function switchSearchMode() {
    if (radioMiddle.checked) {
        fieldMiddle.style.display = 'block';
        fieldAllLink.style.display = 'none';
        fieldLMAO.style.display = 'none';
    }
    else if (radioAllLink.checked) {
        fieldMiddle.style.display = 'none';
        fieldAllLink.style.display = 'block';
        fieldLMAO.style.display = 'none';
    }
    else if (radioLMAO.checked) {
        fieldMiddle.style.display = 'none';
        fieldAllLink.style.display = 'none';
        fieldLMAO.style.display = 'block';
    }
}

for (const radioBtn of radioButtons) {
    radioBtn.addEventListener('click', switchSearchMode);
}

async function searchMiddle() {
    const dataToSend = [hand.value, target.value];
    console.log(dataToSend);
    console.log(JSON.stringify(dataToSend));
    const response = await fetch('/findMiddle', {
        method:'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(dataToSend)
    });
    const data = await response.json();
    console.log(data);
    for (const card of data) {
        createCardRow(card);
    }
}

async function searchAllLink() {
    const dataToSend = [myCard.value];
    console.log(dataToSend);
    console.log(JSON.stringify(dataToSend));
    const response = await fetch('/findAllLink', {
        method:'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(dataToSend)
    });
    const data = await response.json();
    console.log(data);
    for (const card of data) {
        createCardRow(card);
    }
}

submitButton.addEventListener('click', async (e) => {
    if (radioMiddle.checked) searchMiddle();
    else if (radioAllLink.checked) searchAllLink();
})

function createCardRow(card) {
    const cardList = document.querySelector("#cardlist");
    const tr = document.createElement('tr');
    const td1 = document.createElement('td');
    const td2 = document.createElement('td');
    const td3 = document.createElement('td');
    const img = document.createElement('img');

    let cardid = card.id.toString();

    img.src = `http://localhost:3000/pics/${cardid}.jpg`;
    img.width = 100;
    img.onerror = "lmao";
    td1.appendChild(img);
    td2.innerHTML = card.name;
    td3.innerHTML = card.desc;
    tr.append(td1,td2,td3);
    cardList.appendChild(tr);
}