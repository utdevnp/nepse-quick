const marketStatus = document.getElementById("")

const getMarketStatus = async () => {
    const response = await fetch("https://www.onlinekhabar.com/smtm/home/market-status");
    console.log("getMr", response);

    if(!response.ok) {
        return false;
    }

    const result = await response.json();

    if(result.response[0].market_live){
        return true
    }
}

getMarketStatus();