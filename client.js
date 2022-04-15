const input = document.querySelectorAll('input');
const submitButton = document.querySelector('#submitButton');

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