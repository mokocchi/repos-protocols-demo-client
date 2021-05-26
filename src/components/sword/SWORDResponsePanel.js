import React from 'react';
const atom = "http://www.w3.org/2005/Atom";
const getServiceDocumentFields = (xml) => {
  const title = xml.getElementsByTagNameNS(atom, "title")[0].textContent;
  const collectionsXML = xml.getElementsByTagName("collection");
  const collections = [];
  for (let index = 0; index < collectionsXML.length; index++) {
    collections.push(collectionsXML[index]);
  }
  return (
    <>
      <h3>Service Document (Colecciones disponibles)</h3>
      <h4>{title} (Nombre: ID de collección)</h4>
      <ul>
        {collections.map((item, index) => {
          const href = item.getAttribute("href");
          const split = href.split("/");
          const collectionHandle = `${split[split.length - 2]}/${split[split.length - 1]}`;
          const itTitlexml = item.getElementsByTagNameNS(atom, "title");
          let itTitle;
          if (itTitlexml.length === 0) {
            itTitle = "(Título no disponible)"
          } else {
            itTitle = itTitlexml[0].textContent;
          }
          return (<li>{itTitle}: {collectionHandle}</li>)
        })}
      </ul>
    </>
  )
}
const getGetFields = (xml) => {
  const name = xml.getElementsByTagName("name")[0].textContent;
  const lastModified = xml.getElementsByTagName("lastModified")[0].textContent;
  const metadataxml = xml.getElementsByTagName("metadata");
  const metadata = [];
  for (let index = 0; index < metadataxml.length; index++) {
    metadata.push(metadataxml[index]);  
  }
  return (<>
  <ul>
    <li>Título: {name}</li>
    <li>
      Modificado por última vez: {lastModified}
    </li>
    <li>
      Metadatos:
      <ul>
        {metadata.map((item, index) =>{
          const key = item.getElementsByTagName("key")[0].textContent;
          const value = item.getElementsByTagName("value")[0].textContent;
          return (<li key={index}>{key}: {value}</li>)
        })
        }
      </ul>
    </li>
  </ul>
  </>)
}

const getDepositFields = (xml) => {
  if(xml) {
    const treatment = xml.getElementsByTagName("treatment")[0].textContent;
    return(
      "Resultado: " + treatment
    )
  } else {
    return "error"
  }
}

const getFields = (xml, operation) => {
  switch (operation) {
    case "servicedocument":
      return getServiceDocumentFields(xml);
    case "get":
      return getGetFields(xml);
    case "deposit": 
      return getDepositFields(xml);
    default:
      break;
  }
}

const SWORDResponsePanel = ({ xml, operation, format }) => {
  return (
    <>
      { getFields(xml, operation, format)}
    </>
  )
}

export default SWORDResponsePanel;