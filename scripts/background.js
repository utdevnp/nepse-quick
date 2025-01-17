

const showNotificationOfByOrSell = (buyOrSell, expectedPrice, ltp, script, scriptPercent, scriptPoint) => {
    console.log("running form bg");
    const title = buyOrSell === 'Buy' ? "BUY | BUY | BUY" : "SELL | SELL | SELL";
    const message = `Your expected price has been reached, Your ${expectedPrice} and LTP ${ltp}`;
    const contextMessage = `${script} - ${ buyOrSell == "Buy" ? "Down": "Up" } by ${scriptPercent}% or ${scriptPoint} points`;

    chrome.notifications.create({
        type: 'basic',
        iconUrl: '../images/logo.png',
        appIconMaskUrl: '../images/logo.png',
        title: title,
        message: message,
        contextMessage: contextMessage,
        eventTime: Date.now() + 20000,
        buttons: [
            { title: buyOrSell, iconUrl: "../images/logo.png" },  // Button 1
        ],
        priority: 2,
    });
}


const sendNotification = (item) => {
    const getAllItems = null;// localStorage.getItem("myList") && JSON.parse(atob(localStorage.getItem("myList"))) || [];
    const { script, actionType, price } = item;
    const expected = getAllItems.find(item => item.ticker === script);

    if (actionType === "Sell") {
        return expected.ltp > price && actionType === "Sell"
            ? showNotificationOfByOrSell(actionType, price, expected.ltp, script, expected.percentage_change, expected.point_change)
            : null
    } else {
        return expected.ltp < price && actionType === "Buy"
            ? showNotificationOfByOrSell(actionType, price, expected.ltp, script, expected.percentage_change, expected.point_change)
            : null
    }
} 

const matchStatus = async () => {

    
const getItems = atob(await chrome.storage.local.get(["myList"]).myList) || [];
    console.log("getItems", getItems);
    //const selectedFields = getItems.map((item) => (sendNotification(item))); 
    //console.log("selectedFields", selectedFields);
}

matchStatus();
