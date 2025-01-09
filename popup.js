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
const loserTab = document.getElementById("loserTab")

const API_URLS = {
    marketStatus: "https://www.onlinekhabar.com/smtm/home/market-status",
    oneDayTopGainers: "https://www.onlinekhabar.com/smtm/home/top-gainers/1d",
    oneDayTopLosers: "https://www.onlinekhabar.com/smtm/home/top-losers/1d",
    advancerDecliners: "https://www.onlinekhabar.com/smtm/home/advance-decline/nepse",
    nepse: "https://www.onlinekhabar.com/smtm/home/indices-data/nepse/1d"
}
const oneDayTopGainers = async (isGainers = true) => {
    const result = await getData(isGainers ? API_URLS.oneDayTopGainers : API_URLS.oneDayTopLosers);
    console.log("oneDayTopGainers", result);
    if (result.response && result.response.length) {
        const headers = ['Symbol', 'LTP', 'Pt Change', '% Change'];
        const latest10 = result.response.slice(0, 10);
        const selectedFields = latest10.map(item => ({
            symbol: item.ticker,
            ltp: item.prices,
            ptChange: item.point_change,
            PercentChange: item.percentage_change
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
const createTable = (data, headers) => {
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
   
    headers.forEach(headerText => {
        const th = document.createElement('th');
        th.textContent = headerText;
        headerRow.appendChild(th);
    });

    // Create the table body
    const tbody = table.createTBody();

    // Iterate over the array and create rows
    data.forEach(item => {
        const row = tbody.insertRow();

        // Create and insert data cells for each property
        Object.values(item).forEach(value => {
            const cell = row.insertCell();
            cell.textContent = value;
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

getMarketStatus();
advancerDecliners();
nepseOneDay();
oneDayTopGainers();