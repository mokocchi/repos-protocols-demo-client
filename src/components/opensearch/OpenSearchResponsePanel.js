import React from 'react';

const parseRss = xml => {
    const channels = xml.getElementsByTagName("channel");
    if ((channels.length === 0)) {
        return "No se puede interpretar la respuesta"
    }
    const title = xml.getElementsByTagName("title")[0].textContent;
    const link = xml.getElementsByTagName("link")[0].textContent;
    const totalResults = xml.getElementsByTagNameNS("http://a9.com/-/spec/opensearch/1.1/", "totalResults")[0].textContent;
    const itemsCollection = xml.getElementsByTagName("item");
    const items = [];
    for (let index = 0; index < itemsCollection.length; index++) {
        items.push(itemsCollection[index]);
    }
    return (<div>
        <h2>Feed RSS</h2>
        <h3><a href={link}>{title}</a> ({totalResults} elementos)</h3>
        {items.map(item => {
            const itemTitle = item.getElementsByTagName("title")[0].textContent;
            const itemLink = item.getElementsByTagName("link")[0].textContent;
            const itemDescription = item.getElementsByTagName("description")[0].textContent;
            const dateItems  = item.getElementsByTagNameNS("http://purl.org/dc/elements/1.1/", "date");
            let date;
            if (dateItems.length > 0) {
                date = dateItems[0].textContent;
            }
            const published = date ? (new Date(date)).toLocaleString("es").split(" ")[0] : "(no disponible)";
            return (<div>
                <h5>{itemTitle} [<a href={itemLink}>Enlace</a>]</h5>
                <ul>
                    <li>Publicado: {published}</li>
                    <p>{itemDescription}</p>
                </ul>
            </div>)
        })}
    </div>)
}

const parseAtom = xml => {
    const titlesXml = xml.getElementsByTagName("title");
    if ((titlesXml.length === 0) || (titlesXml[0].textContent === "An error has occurred")) {
        return "No se puede interpretar la respuesta"
    }
    const id = xml.getElementsByTagName("id")[0].textContent;
    const title = titlesXml[0].textContent;
    const totalResults = xml.getElementsByTagNameNS("http://a9.com/-/spec/opensearch/1.1/", "totalResults")[0].textContent;
    const entriesCollection = xml.getElementsByTagName("entry");
    const entries = [];
    for (let index = 0; index < entriesCollection.length; index++) {
        entries.push(entriesCollection[index]);
    }
    return (<div>
        <h2>Feed Atom</h2>
        <h3><a href={id}>{title}</a> ({totalResults} elementos)</h3>
        {entries.map((item, index) => {
            const itemTitle = item.getElementsByTagName("title")[0].textContent;
            const itemLink = item.getElementsByTagName("id")[0].textContent;
            const authorNamesCollection = item.getElementsByTagName("name");
            const authorNames = [];
            const dateItems = item.getElementsByTagNameNS("http://purl.org/dc/elements/1.1/", "date")
            let published;
            if (dateItems.length > 0) {
                const date = dateItems[0].textContent;
                published = (new Date(date)).toLocaleString("es").split(" ")[0];
            } else {
                const publishedFulls = item.getElementsByTagName("published");
                if (publishedFulls.length > 0) {
                    const publishedFull = publishedFulls[0].textContent;
                    published = (new Date(publishedFull)).toLocaleString("es").split(" ")[0];
                } else {
                    published = "(no disponible)";
                }
            }
            const summary = item.getElementsByTagName("summary")[0].textContent;
            for (let index = 0; index < authorNamesCollection.length; index++) {
                authorNames.push(authorNamesCollection[index]);

            }
            return (<div>
                <h5>{itemTitle} [<a href={itemLink}>Enlace</a>]</h5>
                <ul>
                    <li>Publicado: {published}</li>
                    <li>Autor{(authorNames.length > 1) && "es"}: {authorNames.map(item => item.textContent).reduce((x, y) => `${x}; ${y}`)}</li>
                    <p>{summary}</p>
                </ul>
            </div>)
        })}
    </div>)
}

const getFields = (xml, format) => {


    switch (format) {
        case "rss":
            return parseRss(xml);
        case "atom":
            return parseAtom(xml);
        default:
            break;
    }
}

const OpenSearchResponsePanel = ({ xml, format }) => (
    <>
        { getFields(xml, format)}
    </>
);

export default OpenSearchResponsePanel