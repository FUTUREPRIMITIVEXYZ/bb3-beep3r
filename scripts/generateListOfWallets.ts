// @ts-ignore
const axios = require("axios");
const fs = require("fs");

// @ts-ignore next-line
const API_KEY = "";
const CONTRACT_ADDRESS = "0xba17eeb3f0413b76184ba8ed73067063fba6e2eb";

async function main() {
  console.log({ API_KEY });
  try {
    // output -> get a csv of all the wallet addresses
    // input -> total number of transactions, max # of transactions, page total
    //
    let wallets: string[] = [];
    let cursor;
    let firstFetch = true;

    while (firstFetch || cursor) {
      console.log({ cursor });
      let apiEndPoint = `https://deep-index.moralis.io/api/v2/${CONTRACT_ADDRESS}?chain=eth&from_date=2022-09-01T07%3A00%3A00.000Z&to_date=2022-11-04T07%3A00%3A00.000Z`;
      if (cursor) {
        apiEndPoint = apiEndPoint + `&cursor=${cursor}`;
      }

      const response = await axios.get(apiEndPoint, {
        headers: {
          "x-api-key": API_KEY,
        },
      });

      const data = response.data;
      firstFetch = false;
      cursor = data.cursor;

      console.log({ page: data.page });

      data.result.forEach((tx: any) => {
        if (tx.value === "20000000000000000") {
          wallets.push(tx.from_address);
        }
      });

      console.log({ wallets });
    }

    fs.writeFile("./wallets.json", JSON.stringify(wallets), (err: any) => {
      if (err) {
        console.error(err);
      }
      // file written successfully
    });
  } catch (err) {
    console.error(err);
  }
}

main();
