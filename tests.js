import articles from "./bb-articole-parsate.json" assert {type: "json"}
import routes from "./aa-rute-parsate.json" assert {type: "json"}

console.log("Numar rute:", routes.length)
console.log("Numar articole:", articles.length)

console.log("Numar articole cu continut: ", articles.filter(article => article.content.articleBody).length)
console.log("Numar articole cu continut mai mare de 100 caractere: ", articles.filter(article => article.content.articleBody && article.content.articleBody.length > 100).length)
console.log("Numar articole cu continut mai mare de 300 caractere: ", articles.filter(article => article.content.articleBody && article.content.articleBody.length > 300).length)
console.log("Numar articole cu continut mai mare de 500 caractere: ", articles.filter(article => article.content.articleBody && article.content.articleBody.length > 500).length)
console.log("Numar articole cu continut mai mare de 700 caractere: ", articles.filter(article => article.content.articleBody && article.content.articleBody.length > 700).length)
