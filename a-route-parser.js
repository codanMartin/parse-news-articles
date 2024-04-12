import {getBaseUrl, joinSets, retrieveDom, writeSetInJson} from "./c-utils.js";

const parseDynamicRoutes = async (linksToParse, parsedLinks, iterations, targetDomains) => {
    if (iterations > 0) {
        const link = linksToParse.values().next().value;
        linksToParse.delete(link);
        if (!parsedLinks.has(link)) {
            console.log("reading: ", link);
            parsedLinks.add(link);
            try {
                const pageDom = await retrieveDom(link);
                const externalLinks = pageDom.querySelectorAll('a');

                for (const externalLink of externalLinks) {
                    const linkRef = externalLink.getAttribute('href');
                    if (linkRef && linkRef.length > 0) {
                        let fullRef = linkRef.trim();
                        if (linkRef.charAt(0) === "/") fullRef = `${getBaseUrl(link)}${linkRef}`.trim();

                        if (link !== fullRef && targetDomains.find(domain => fullRef.includes(domain)) && !linksToParse.has(fullRef) && !parsedLinks.has(fullRef)) linksToParse.add(fullRef)
                    }
                }
            } catch (error) {
                console.log(error);
            }
        }
        if (iterations > 1) await parseDynamicRoutes(linksToParse, parsedLinks, iterations -= 1, targetDomains);
    }
    return parsedLinks;
};

export const parseMultipleInitialDomains = async (initialDomains, targetSubdomains, iterationsPerDomain) => {
    let result = new Set()
    for (const domain of initialDomains) {
        const parsedLinks = await parseDynamicRoutes(new Set([domain]), new Set(), iterationsPerDomain, targetSubdomains)
        result = joinSets(result, parsedLinks)
    }
    await writeSetInJson(result, "aa-rute-parsate.json")
}

//TODO Linkurile nu trebuie sa se termine in "/"
const initialDomains = ["https://www.hotnews.ro", "https://www.realitatea.net"]

//TODO Ideal sa coincida macar cu initialDomains daca nu se vrea a se adauga mai multe
//TODO Linkurile nu trebuie sa se termine in "/"
const targetSubdomains = ["https://www.realitatea.net", "https://www.hotnews.ro"]

//TODO Hint, foloseste macar 50 de iteratii (numar iteratii === numar linkuri pe care le primesti inapoi / domeniu initial)
//TODO Asigura-te ca aa-rute-parsate.json este gol sau sters

await parseMultipleInitialDomains(initialDomains, targetSubdomains, 2)
