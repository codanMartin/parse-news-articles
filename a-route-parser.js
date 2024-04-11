import {getBaseUrl, retrieveDom, writeSetInJson} from "./c-utils.js";

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

const initialDomains = new Set(["https://www.hotnews.ro"])

//TODO Ideal sa coincida macar cu initialDomains daca nu se vrea a se adauga mai multe
const targetSubdomains = ["https://www.hotnews.ro"]

//TODO Hint, foloseste macar 100 de iteratii (numar iteratii === numar linkuri pe care le primesti inapoi)
const parsedLinks = await parseDynamicRoutes(initialDomains, new Set(), 100, targetSubdomains)

//TODO Asigura-te ca aa-rute-parsate.json este gol sau sters
await writeSetInJson(parsedLinks, `aa-rute-parsate.json`)