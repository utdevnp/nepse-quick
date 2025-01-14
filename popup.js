const marketStatus = document.getElementById("marketStatus");
const advance = document.getElementById("advance");
const decline = document.getElementById("decline");
const unchanged = document.getElementById("unchanged");
const totalTurnover = document.getElementById("totalTurnover");
const totalTradedShare = document.getElementById("totalTradedShare");
const latestPrice = document.getElementById("latest_price");
const percentageChange = document.getElementById("percentage_change");
const pointChange = document.getElementById("point_change");
const nepseIcon = document.getElementById("nepseIcon");
const topGainers = document.getElementById("topGainers");
const gainerTab = document.getElementById("gainerTab");
const loserTab = document.getElementById("loserTab");
const script = document.getElementById("script");
const actionType = document.getElementById("actionType");
const price = document.getElementById("price");
const addScript = document.getElementById("addScript");
const watchListList = document.getElementById("watchListList");
const watchListBox = document.getElementById("watchListBox");
const watchListAddForm = document.getElementById("watchListAddForm");
const addWatchListButton = document.getElementById("addWatchListButton");
const addWatchListLinkSection = document.getElementById("addWatchListLinkSection");
const hideForm = document.getElementById("hideForm");

let myWatchItems = [];

const API_URLS = {
    marketStatus: "https://www.onlinekhabar.com/smtm/home/market-status",
    oneDayTopGainers: "https://www.onlinekhabar.com/smtm/home/top-gainers/1d",
    oneDayTopLosers: "https://www.onlinekhabar.com/smtm/home/top-losers/1d",
    advancerDecliners: "https://www.onlinekhabar.com/smtm/home/advance-decline/nepse",
    nepse: "https://www.onlinekhabar.com/smtm/home/indices-data/nepse/1d",
    liveTrading: "https://www.onlinekhabar.com/smtm/stock_live/live-trading"
}

addWatchListButton.addEventListener("click", () => {
    watchListAddForm.classList.remove("d-none");
});

hideForm.addEventListener("click", () => {
    watchListAddForm.classList.add("d-none");
});

addWatchListLink.addEventListener("click", () => {
    watchListAddForm.classList.remove("d-none");
});

addScript.addEventListener("click", () => {
    const watchValue = localStorage.getItem("watchList") && JSON.parse(atob(localStorage.getItem("watchList"))) || [];
    if (watchValue) {
        if (script.value && actionType.value && price.value) {
            watchValue.push({
                script: script.value,
                actionType: actionType.value,
                price: price.value
            });

            localStorage.setItem("watchList", btoa(JSON.stringify(watchValue)));
            watchListAddForm.classList.add("d-none");
        }
    }

    showWatchList();

    script.value = "";
    actionType.value = "Sell";
    price.value = "";
});



const removeItem = (index) => {
    const getItems = JSON.parse(atob(localStorage.getItem("watchList")));
    getItems.splice(index, 1);
    localStorage.setItem("watchList", btoa(JSON.stringify(getItems)));
    showWatchList();
}

const isPositive = (value) => {
    return value > 0;
}

const matchStatus = (value) => {
    return isPositive(value) ? "text-success bi bi-arrow-up-right" : "text-danger bi bi-arrow-down-left";
}
const textSuccess = "text-success";
const textDanger = "text-danger";

const findStatus = (item) => {
    const getAllItems = localStorage.getItem("myList") && JSON.parse(atob(localStorage.getItem("myList"))) || [];
    const { script, actionType, price } = item;
    const expected = getAllItems.find(item => item.ticker === script);

    if (actionType === "Sell") {
        return expected.ltp > price && actionType === "Sell"
            ? `<span class="text-success">${expected.ltp} <i class="${matchStatus(expected.ltp)} "></i></span>`
            : `<span class="text-danger">${expected.ltp} <i class="${matchStatus(expected.ltp)}"></i></span>`;
    } else {
        return expected.ltp < price && actionType === "Buy"
            ? `<span class="text-primary">${expected.ltp} <i class="${matchStatus(expected.ltp)} "></i></span>`
            : `<span class="text-danger">${expected.ltp} <i class="${matchStatus(expected.ltp)}"></i></span>`;
    }
}

const showWatchList = async () => {
    const getItems = localStorage.getItem("watchList") && JSON.parse(atob(localStorage.getItem("watchList"))) || [];
    const selectedFields = getItems.map((item, index) => ({
        script: `<strong> ${item.script} </string>`,
        actionType: item.actionType,
        price: item.price,
        action: findStatus(item),
        delete: `<a  href='#'><i class="bi bi-trash2 text-danger removeScript" index-id='${index}' title='Remove'></i></a>`
    }));

    watchListList.innerHTML = "";
    watchListList.appendChild(createTable(selectedFields));
    myWatchItems = [...document.getElementsByClassName("removeScript")];

    myWatchItems.forEach((item) => {
        item.addEventListener("click", (event) => {
            removeItem(event.target.getAttribute("index-id"));
        })
    })

    if (myWatchItems.length > 0) {
        watchListBox.style.display = "none";
        addWatchListLinkSection.style.display = "block";
    } else {
        watchListBox.style.display = "block";
        addWatchListLinkSection.style.display = "none";
    }
}

const oneDayTopGainers = async (isGainers = true) => {
    const result = await getData(isGainers ? API_URLS.oneDayTopGainers : API_URLS.oneDayTopLosers);

    if (result.response && result.response.length) {
        const headers = ['Symbol', 'LTP', 'Pt Change', '% Change'];
        const latest10 = result.response.slice(0, 10);
        const selectedFields = latest10.map(item => ({
            symbol: item.ticker,
            ltp: item.prices,
            ptChange: `<span class="${isGainers ? "text-success" : "text-danger"}">${item.point_change}</span>`,
            PercentChange: `<span class="${isGainers ? "text-success" : "text-danger"}">${item.percentage_change}</span>`,
        }));
        topGainers.innerHTML = "";
        topGainers.append(createTable(selectedFields, headers));
    }
}

const nepseOneDay = async () => {
    const result = await getData(API_URLS.nepse);

    if (result.response) {
        const { latest_price, percentage_change, point_change } = result.response;
        latestPrice.innerText = latest_price;
        percentageChange.innerText = percentage_change + "%";
        pointChange.innerText = point_change;

        percentageChange.classList.add(percentage_change > 0 ? "text-success" : "text-danger");
        pointChange.classList.add(point_change > 0 ? "text-success" : "text-danger");
        nepseIcon.classList.add(point_change > 0 ? "text-success" : "text-danger");
        nepseIcon.classList.add(point_change > 0 ? "bi-caret-up-fill" : "bi-caret-down-fill");
    }
}

const advancerDecliners = async () => {
    const result = await getData(API_URLS.advancerDecliners);

    if (result.response && result.response.length) {
        const { advancers_count, decliners_count, no_change_count, turnover, shares_traded } = result.response[0];
        advance.innerHTML = advancers_count;
        decline.innerHTML = decliners_count;
        unchanged.innerHTML = no_change_count;
        totalTurnover.innerText = turnover.toLocaleString();
        totalTradedShare.innerText = shares_traded.toLocaleString();
    }
}

const getMarketStatus = async () => {
    const result = await getData(API_URLS.marketStatus);

    if (result.response && result.response.length && result.response[0].market_live) {
        marketStatus.classList.add("text-success");
    } else {
        marketStatus.classList.add("text-danger");
    }
}

const getData = async (url) => {
    const response = await fetch(url);

    if (!response.ok) {
        return false;
    }

    return await response.json();
}
const createTable = (data, headers = null) => {
    // Create the table element
    const table = document.createElement('table');
    table.classList.add("table");
    table.classList.add("table-sm");
    table.classList.add("text-center");
    table.classList.add("table-bordered");
    table.classList.add("table-striped");
    table.style.fontSize = "12px";

    // Create the table header
    const header = table.createTHead();
    const headerRow = header.insertRow();

    // Add column headers
    if (headers) {
        headers.forEach(headerText => {
            const th = document.createElement('th');
            th.textContent = headerText;
            headerRow.appendChild(th);
        });
    }

    // Create the table body
    const tbody = table.createTBody();

    // Iterate over the array and create rows
    data.forEach(item => {
        const row = tbody.insertRow();

        // Create and insert data cells for each property
        Object.values(item).forEach(value => {
            const cell = row.insertCell();
            cell.innerHTML = value;
        });
    });

    // Return the created table
    return table;
}
gainerTab.addEventListener("click", () => {
    gainerTab.classList.add("active");
    loserTab.classList.remove("active");
    oneDayTopGainers();
});

loserTab.addEventListener("click", () => {
    gainerTab.classList.remove("active");
    loserTab.classList.add("active");
    oneDayTopGainers(false);
});

const allList = async () => {
    const result = await getData(API_URLS.liveTrading);

    if (result.response && result.response.length) {
        localStorage.setItem("myList", btoa(JSON.stringify(result.response)));
        showWatchList();
    }
}

getMarketStatus();
advancerDecliners();
nepseOneDay();
oneDayTopGainers();
showWatchList();
allList();


const notifyMe = document.getElementById("notifyMe");

notifyMe.addEventListener("click", () => {
    chrome.notifications.create({
        type: 'basic',
        iconUrl: './images/logo.png',
        appIconMaskUrl: './images/logo.png',
        title: 'BUY || BUY || BUY',
        message: 'Your expected price has been reached, Your 430 and LTP 530',
        contextMessage: 'NHPC - Down, 10% or 30 points',
        eventTime: Date.now() + 20000,
        buttons: [
            { title: "Like", iconUrl: "./images/logo.png" },  // Button 1
            { title: "Reply", iconUrl: "./images/logo.png" } // Button 2
        ],
        priority: 2,
    });
});


