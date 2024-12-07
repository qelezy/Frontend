const cards = [
    {id: 1, category: "Общество", date: "2024-11-23T18:30:00", image: "images/image-1.png", title: "Изготовленный Зурабом Церетели памятник Тихону Хренникову открыли в Ельце", text: "Новая достопримечательность появилась в Ельце. Здесь открыли памятник композитору Тихону Хренникову. В этом году..."},
    {id: 2, category: "Спорт", date: "2024-11-22T18:30:00", image: "images/image-2.png", title: "Липецк признан беговой столицей России 2023 года", text: "Липецк признан беговой столицей России 2023 года по итогам полумарафона «Забег.рф». В Липецке было 4000 участников забега, которые показали лучший..."},
    {id: 3, category: "Экономика", date: "2024-11-18T18:30:00", image: "images/image-3.png", title: "Электрокар EVOLUTE из Липецкой области признан электромобильным брендом № 1 в России", text: "Электрокар под маркой EVOLUTE вновь подтвердил звание «Электромобиля № 1» в России..."},
    {id: 4, category: "Общество", date: "2024-11-22T18:30:00", image: "images/image-4.png", title: "Игорь Артамонов посетил белгородцев в липецком пункте временного размещения", text: "Губернатор Липецкой области Игорь Артамонов, как и обещал ранее, посетил пункт временного размещения, в котором сейчас..."}
];

let categorizedCards = cards;
let searchText = "";

const dropdownText = document.getElementById("dropdown-text"),
      categoryList = document.getElementById("category-list"),
      dateSortItems = document.getElementsByClassName("dropdown-item"),
      dateSortList = document.getElementById("date-list"),
      cardsContainer = document.getElementById("cards-container"),
      cardTextItems = document.getElementsByClassName("card-text"),
      searchInput = document.getElementById("card-search"),
      preloader = document.getElementById("preloader");

function getCardTemplate(card) {
    return `
    <article class="card">
        <div class="card-body">
            <div class="card-info">
                <span>${card.category}</span>
                <span>${formatDate(card.date)}</span>
            </div>
            <img src="${card.image}">
            <h2 class="card-title">${card.title}</h2>
            <p class="card-text">${card.text}</p>
        </div>
    </article>
    `;
}

function getCardCategory(card) {
    switch (card.category) {
        case "Общество":
            return "society";
        case "Спорт":
            return "sport";
        case "Экономика":
            return "economy"
        default:
            return "all";
    }
}

function formatDate(date) {
    const cardDate = new Date(date);
    const today = new Date();
    const options = { hour: '2-digit', minute: '2-digit' };

    if (cardDate.getDate() === today.getDate()) {
        return `сегодня в ${cardDate.toLocaleTimeString([], options)}`;
    } else if (cardDate.getDate() === today.getDate() - 1) {
        return `вчера в ${cardDate.toLocaleTimeString([], options)}`;
    } else {
        return cardDate.toLocaleDateString() + ` в ${cardDate.toLocaleTimeString([], options)}`;
    }
}

function findCardsByTitle(text) {
    const foundCards = categorizedCards.filter(card => 
        card.title.toLowerCase().includes(text.toLowerCase())
    );
    return foundCards;
}

function filterByCategory(category) {
    let filteredCards = category === "all" ? 
    cards : 
    cards.filter(card => getCardCategory(card) === category);
    return filteredCards;
}

function sortByDate(sortOrder = "default") {
    let sortedCards;
    sortedCards = searchText ? findCardsByTitle(searchText) : categorizedCards;
    switch (sortOrder) {
        case "new-first":
            sortedCards = categorizedCards.toSorted((a, b) => {
                return new Date(b.date) - new Date(a.date);
            });
            break;
        case "old-first":
            sortedCards = categorizedCards.toSorted((a, b) => {
                return new Date(a.date) - new Date(b.date);
            });
            break;
        default:
            sortedCards = categorizedCards.toSorted((a, b) => {
                return a.id - b.id;
            });
            break;
    }
    return sortedCards;
}

function loadCards(filteredCards = cards) {
    cardsContainer.innerHTML = "";
    for (let card of filteredCards) {
        cardsContainer.insertAdjacentHTML("beforeend", getCardTemplate(card));
    }
}

for (let item of dateSortItems) {
    item.addEventListener("click", function() {
        dropdownText.innerText = this.innerText;
    });
}

searchInput.addEventListener("input", (e) => {
    searchText = e.target.value;
    if (searchText) {
        loadCards(findCardsByTitle(e.target.value));
    } else {
        loadCards(categorizedCards);
    }
    dropdownText.innerText = dateSortItems.item(0).innerText;
});

dateSortList.addEventListener("click", (e) => {
    let sortedCards = sortByDate(e.target.value);
    if (searchText) {
        sortedCards = findCardsByTitle(searchText);
    } else {
        loadCards(sortedCards);
    }
});

categoryList.addEventListener("change", (e) => {
    categorizedCards = filterByCategory(e.target.value);
    if (searchText) {
        loadCards(findCardsByTitle(searchText));
    } else {
        loadCards(categorizedCards);
    }
    dropdownText.innerText = dateSortItems.item(0).innerText;
});

window.addEventListener("load", () => {
    setTimeout(() => { 
        preloader.style.display = "none"; 
        loadCards(); 
    }, 500);
});