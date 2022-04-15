const input = document.querySelectorAll('input');
const submitButton = document.querySelector('#submitButton');
const radioButtons = document.querySelectorAll('input[name="searchType"]');
const radioMiddle = document.getElementById('searchMode_middle');
const radioAllLink = document.getElementById('searchMode_allLink');
const radioLMAO = document.getElementById('searchMode_test');
const fieldMiddle = document.getElementById('searchField_middle');
const fieldAllLink = document.getElementById('searchField_allLink');
const fieldLMAO = document.getElementById('searchField_test');

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
    else {
        fieldMiddle.style.display = 'none';
        fieldAllLink.style.display = 'none';
        fieldLMAO.style.display = 'none';
    }
}

for (const radioBtn of radioButtons) {
    radioBtn.addEventListener('click', switchSearchMode);
} 

submitButton.addEventListener('click', async (e) => {
    console.log(input[0].value);
    console.log(input[1].value);
    const arr = [input[0].value, input[1].value];
    console.log(arr);
    console.log(JSON.stringify(arr));
    const response = await fetch('/findMiddle', {
        method:'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(arr)
    });
    const data = await response.json();
    console.log(data);
    for (const card of data) {
        createCardRow(card);
    }
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