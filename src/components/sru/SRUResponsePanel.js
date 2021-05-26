import React from 'react';
import { Accordion, Button, Card } from 'react-bootstrap';

const getExplainFields = (xml) => {
  const databaseInfo = xml.getElementsByTagName("databaseInfo")[0];
  const databaseTitle = databaseInfo.getElementsByTagName("title")[0].textContent;
  const databaseDescription = databaseInfo.getElementsByTagName("description")[0].textContent;

  const indexInfo = xml.getElementsByTagName("indexInfo")[0];
  const indicesXML = indexInfo.getElementsByTagName("index");
  const indices = [];
  for (let index = 0; index < indicesXML.length; index++) {
    indices.push(indicesXML[index]);
  }

  const schemaInfoXML = xml.getElementsByTagName("schemaInfo")[0].children;
  const schemas = [];
  for (let index = 0; index < schemaInfoXML.length; index++) {
    schemas.push(schemaInfoXML[index]);
  }

  return (<div>
    <h4>{databaseTitle}</h4>
    <p><i>{databaseDescription}</i></p>
    <b>Índices (indexInfo)</b>
    <ul>
      {indices.map((item, index) => {
        const indexTitle = item.getElementsByTagName("title")[0].textContent;
        const schema = item.getElementsByTagName("name")[0].getAttribute("set");
        return (<li key={index}>
          {schema}.{indexTitle}
        </li>)
      })}
    </ul>
    <b>Información sobre esquemas disponibles (schemaInfo)</b>
    <ul>
      {schemas.map((item, index) => {
        const schemaTitle = item.getElementsByTagName("title")[0].textContent;
        const schemaName = item.getAttribute("name");
        return (<li key={index}>
          Esquema: {schemaTitle} ({schemaName})
        </li>)
      })}
    </ul>
  </div>)
}

const getScanFields = (xml) => {
  return (<div>
    <b>Scan (no soportado)</b>
  </div>)
}

const getSearchRetrieveFields = (xml, format) => {
  const numberOfRecords = xml.getElementsByTagNameNS("http://docs.oasis-open.org/ns/search-ws/sruResponse", "numberOfRecords")[0].textContent;
  if (numberOfRecords === "0") {
    return (<div>
      <b>{numberOfRecords} Resultados</b>
    </div>)
  }
  const recordsXML = xml.getElementsByTagNameNS("http://docs.oasis-open.org/ns/search-ws/sruResponse", "record");
  if (recordsXML.length === 0) {
    return (<div>
      <b>{numberOfRecords} Resultados</b>
      <p>Para obtener los registros, defina el esquema de metadatos y la cantidad de registros.</p>
    </div>)
  }
  const records = [];
  for (let index = 0; index < recordsXML.length; index++) {
    records.push(recordsXML[index]);
  }
  return (<div>
    <b>{numberOfRecords} Resultados</b>
    <ul>
      {records.map((item, index) => {
        switch (format) {
          case "dc":
            return parseDC(item, index);
          default:
            return (<li>
              (formato no implementado, usar dc (DublinCore))
            </li>)
        }
      })}
    </ul>
  </div>)
}

const parseDC = (xml, itemIndex) => {
  const metadataTag = xml.getElementsByTagNameNS("info:srw/schema/1/dc-schema", "dc")[0];
  const metadataXML = metadataTag.children;
  const metadata = [];
  for (let index = 0; index < metadataXML.length; index++) {
    metadata.push(metadataXML[index]);
  }
  const title = metadataTag.getElementsByTagName("title")[0].textContent;
  return (<li>
    {title}
    <Accordion>
      <Card>
        <Card.Header>
          <Accordion.Toggle as={Button} variant="link" eventKey={toString(itemIndex)}>
            Metadatos
                </Accordion.Toggle>
        </Card.Header>
        <Accordion.Collapse eventKey={toString(itemIndex)}>
          <Card.Body>
            <ul>
              {metadata.map((y, index2) =>
                <li key={`set-${index2}-2`}>
                  {y.tagName}: {y.textContent}
                </li>)}
            </ul>
          </Card.Body>
        </Accordion.Collapse>
      </Card>
    </Accordion>
  </li>)
}

const getFields = (xml, operation, format) => {
  const diagnostics = xml.getElementsByTagNameNS("http://docs.oasis-open.org/ns/search-ws/sruResponse", "diagnostics");
  if (diagnostics.length > 0) {
    return (
      "Ocurrió un error. Consulte la respuesta en crudo para ver los detalles."
    )
  }
  switch (operation) {
    case "explain":
      return getExplainFields(xml);
    case "scan":
      return getScanFields(xml);
    case "searchRetrieve":
      return getSearchRetrieveFields(xml, format);
    default:
      break;
  }
}

const SRUResponsePanel = ({ xml, operation, format }) => {
  return (
    <>
      { getFields(xml, operation, format)}
    </>
  )
}

export default SRUResponsePanel;