import {retrieveDom, writeSetInJson} from "./c-utils.js";
import routes from "./aa-rute-parsate.json" assert {type: "json"}


const standardStrategy = (route, data, result) => {
    console.log("Applying standard strategy")
    const article_data = {source: route}
    article_data.content = data
    if (!result.has(article_data)) {
        result.add(article_data)
    }
}

const graphStrategy = (route, data, result) => {
    console.log("Applying @graph strategy")
    data["@graph"].filter(obj => obj["@type"] === "NewsArticle").forEach(elem => {
        standardStrategy(route, elem, result)
    })
}


const arrayOfScriptStrategy = (route, data, result) => {
    console.log("Applying array of scripts strategy")
    for (const elem of data) {
        if (elem["@type"] === "NewsArticle") {
            standardStrategy(route, elem, result)
        }
    }
}

const retrieveArticlesFromRoutes = async (routesSet) => {
    const parserDataResult = new Set();

    for (const route of routesSet) {
        console.log("reading: ", route);
        try {
            const pageDom = await retrieveDom(route)
            const scriptsOfPage = pageDom.querySelectorAll('script[type="application/ld+json"]');

            for (const script of scriptsOfPage) {
                const jsonData = JSON.parse(script.textContent);
                if (Array.isArray(jsonData)) {
                    arrayOfScriptStrategy(route, jsonData, parserDataResult)
                } else if (jsonData["@type"] === "NewsArticle") {
                    standardStrategy(route, jsonData, parserDataResult)
                } else if (jsonData["@graph"]) {
                    graphStrategy(route, jsonData, parserDataResult)
                }
            }

        } catch (error) {
            console.error("Error:", error);
        }
    }

    return parserDataResult
}

//TODO Asigura-te ca param routes este importat din fisierul corespunzator si are lungime
const parsedArticles = await retrieveArticlesFromRoutes(new Set(routes))

//TODO Asigura-te ca bb-articole-parsate.json este gol sau sters
await writeSetInJson(parsedArticles, `bb-articole-parsate.json`)