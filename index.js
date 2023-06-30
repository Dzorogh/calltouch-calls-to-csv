import 'dotenv/config'
import fetch from "node-fetch";
import { appendFileSync } from 'fs';

const siteId = process.env.SITE_ID;
const clientApiId = process.env.TOKEN;
const dateFrom = process.env.DATE_FROM;
const dateTo = process.env.DATE_TO;
const baseUrl = `https://api.calltouch.ru/calls-service/RestAPI/${siteId}/calls-diary/calls`;

const settings = {
    method: "Get",
};

let totalPages = 0;

const fileName = 'calls ' + new Date() + '.csv'

console.log(`Writing to file: ${fileName}`);

const getData = (page = 1) => {
    const url = baseUrl + "?" + new URLSearchParams({
        clientApiId,
        dateFrom,
        dateTo,
        page: String(page)
    });

    console.log(`Get: ${url}`)

    fetch(url, settings)
        .then(res => res.json())
        .then(async (json) => {
            if (json.pageTotal) {
                totalPages = json.pageTotal
            }

            if (json.records) {
                for (const item of json.records) {
                    const line = Object.values(item).join(', ') + '\n'

                    appendFileSync(fileName, line, 'utf8')
                }

                if (page !== totalPages) {
                    getData(page + 1);
                }
            }
        });
}

getData()
