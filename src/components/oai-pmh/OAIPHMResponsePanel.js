import React from 'react';
import { Accordion, Button, Card } from 'react-bootstrap';

const getFields = (xml, verb) => {
  const error = xml.getElementsByTagName("error");
  if (error.length > 0) {
    if(error[0].getAttribute("code") === "noRecordsMatch") {
      return "No hay resultados";
    } else {
      return "Ocurrió un error. Consulte la respuesta en crudo para ver los detalles."
    }
  }

  switch (verb) {
    case "Identify":
      const repositoryNameTags = xml.getElementsByTagName("repositoryName");
      if (repositoryNameTags.length === 0) {
        return <span>"Respuesta incorrecta!"</span>;
      }
      const repositoryName = repositoryNameTags[0].textContent;

      const baseUrls = xml.getElementsByTagName("baseURL");
      if (baseUrls.length === 0) {
        return <span>"Respuesta incorrecta!"</span>;
      }
      const baseUrl = baseUrls[0].textContent;

      const adminEmails = xml.getElementsByTagName("adminEmail");
      if (adminEmails.length === 0) {
        return <span>"Respuesta incorrecta!"</span>;
      }
      const adminEmail = adminEmails[0].textContent;

      return (<ul>
        <li>
          <b>Nombre del repositorio [repositoryName]: </b> {repositoryName}
        </li>
        <li>
          <b>URL base (de este contexto) [baseURL]:</b> {baseUrl}
        </li>
        <li>
          <b>Casilla de administración [adminEmail]:</b> {adminEmail}
        </li>
      </ul>)
    case "ListMetadataFormats":
      const formats = [];
      const metadataFormats = xml.getElementsByTagName("metadataFormat");
      for (let index = 0; index < metadataFormats.length; index++) {
        formats.push(metadataFormats[index]);
      }
      return (
        <ul>
          {formats.map((x, index) => {
            const prefix = x.getElementsByTagName("metadataPrefix")[0].textContent;
            const schema = x.getElementsByTagName("schema")[0].textContent;
            const namespace = x.getElementsByTagName("metadataNamespace")[0].textContent;
            return (<li key={index}><b>Prefijo:</b> {prefix}
              <ul>
                <li>Schema [schema]: {schema}</li>
                <li>Namespace [metadataNamespace]: {namespace}</li>
              </ul>
            </li>)
          })}
        </ul>
      )
    case "ListSets":
      const sets = [];
      const xmlSets = xml.getElementsByTagName("set");
      for (let index = 0; index < xmlSets.length; index++) {
        sets.push(xmlSets[index]);
      }
      let listSetstoken = xml.getElementsByTagName("resumptionToken")[0];
      let listSetsresumptionToken = listSetstoken.textContent;
      let listSetssize = listSetstoken.getAttribute("completeListSize");
      let listSetscursor = listSetstoken.getAttribute("cursor");
      return (
        <>
          <ul>
            <li>
              <b>Cantidad total de elementos [completeListSize]: </b> {listSetssize} (100 por página)
            </li>
            <li>
              <b>Token de continuación (tomar nota para pedir la siguiente página) [resumptionToken]:</b> {listSetsresumptionToken}
            </li>
            <li>
              <b>Página [cursor + 1]:</b> {parseInt(listSetscursor) + 1}
            </li>
          </ul>
          <ul>
            {sets.map((x, index) => {
              const spec = x.getElementsByTagName("setSpec")[0].textContent;
              const name = x.getElementsByTagName("setName")[0].textContent;
              return (<li key={index}><b>Set encontrado No.{index + 1 + parseInt(listSetscursor)}:</b>
                <ul>
                  <li>Nombre [setName]: {name}</li>
                  <li>Identificador [setSpec]: {spec}</li>
                </ul>
              </li>)
            })}
          </ul>
        </>);
    case "ListIdentifiers":
      const headers = [];
      const xmlHeaders = xml.getElementsByTagName("header");
      for (let index = 0; index < xmlHeaders.length; index++) {
        headers.push(xmlHeaders[index]);
      }
      const lTokens = xml.getElementsByTagName("resumptionToken");
      let listIdresumptionToken;
      let listIdsize;
      let listIdcursor;
      if (lTokens.length > 0) {
        const listIdtoken = lTokens[0];
        listIdresumptionToken = listIdtoken.textContent;
        listIdsize = listIdtoken.getAttribute("completeListSize");
        listIdcursor = listIdtoken.getAttribute("cursor");
      } else {
        listIdresumptionToken = "";
        listIdsize = 1;
        listIdcursor = 0;
      }
      return (
        <>
          <ul>
            <li>
              <b>Cantidad total de elementos [completeListSize]: </b> {listIdsize} (100 por página)
            </li>
            <li>
              <b>Token de continuación (tomar nota para pedir la siguiente página) [resumptionToken]:</b> {listIdresumptionToken}
            </li>
            <li>
              <b>Página [cursor + 1]:</b> {parseInt(listIdcursor) + 1}
            </li>
          </ul>
          <ul>
            {headers.map((x, index) => {
              const identifier = x.getElementsByTagName("identifier")[0].textContent;
              const datestamp = x.getElementsByTagName("datestamp")[0].textContent;
              const headerSets = []
              const xmlSets = x.getElementsByTagName("setSpec");
              for (let index = 0; index < xmlSets.length; index++) {
                headerSets.push(xmlSets[index]);
              }
              return (<li key={index}><b>Recurso encontrado No.{index + 1 + 100 * parseInt(listIdcursor)}:</b>
                <ul>
                  <li>Identificador [identifier]: {identifier}</li>
                  <li>Fecha [datestamp]: {datestamp}</li>
                  <li>Pertenece a los conjuntos [setSpec]:
                    <ul>
                      {headerSets.map((y, index2) =>
                        <li key={`set-${index}-${index2}`}>
                          {y.textContent}
                        </li>)}
                    </ul>
                  </li>
                </ul>
              </li>
              )
            })}
          </ul>
        </>);
    case "ListRecords":
      const records = [];
      const listMetadata = [];
      const xmlRecords = xml.getElementsByTagName("header");
      for (let index = 0; index < xmlRecords.length; index++) {
        records.push(xmlRecords[index]);
        const aMetadataCollection = xmlRecords[index].nextSibling.firstChild.children  //Nota: solo funciona si manda primero el header
        const aMetadataArray = [];
        for (let index = 0; index < aMetadataCollection.length; index++) {
          const dc = aMetadataCollection[index];
          aMetadataArray.push(dc);
        }
        listMetadata.push(aMetadataArray);
      }
      const listRectoken = xml.getElementsByTagName("resumptionToken")[0];
      const listRecresumptionToken = listRectoken.textContent;
      const listRecsize = listRectoken.getAttribute("completeListSize");
      const listReccursor = listRectoken.getAttribute("cursor");
      return (
        <>
          <ul>
            <li>
              <b>Cantidad total de elementos [completeListSize]: </b> {listRecsize} (100 por página)
            </li>
            <li>
              <b>Token de continuación (tomar nota para pedir la siguiente página) [resumptionToken]:</b> {listRecresumptionToken}
            </li>
            <li>
              <b>Página [cursor + 1]:</b> {parseInt(listReccursor) + 1}
            </li>
          </ul>
          <ul>
            {records.map((x, index) => {
              const identifier = x.getElementsByTagName("identifier")[0].textContent;
              const datestamp = x.getElementsByTagName("datestamp")[0].textContent;
              const headerSets = [];
              const xmlSets = x.getElementsByTagName("setSpec");
              for (let index = 0; index < xmlSets.length; index++) {
                headerSets.push(xmlSets[index]);
              }
              return (<li key={index}><b>Recurso encontrado No.{index + 1 + 100 * parseInt(listReccursor)}:</b>
                <ul>
                  <li>Identificador [identifier]: {identifier}</li>
                  <li>Fecha [datestamp]: {datestamp}</li>
                  <li>Pertenece a los conjuntos [setSpec]:
                    <ul>
                      {headerSets.map((y, index2) =>
                        <li key={`set-${index}-${index2}-1`}>
                          {y.textContent}
                        </li>)}
                    </ul>
                  </li>
                  <Accordion>
                    <Card>
                      <Card.Header>
                        <Accordion.Toggle as={Button} variant="link" eventKey={toString(index)}>
                          Metadatos
                    </Accordion.Toggle>
                      </Card.Header>
                      <Accordion.Collapse eventKey={toString(index)}>
                        <Card.Body>
                          <ul>
                            {listMetadata[index].map((y, index2) =>
                              <li key={`set-${index}-${index2}-2`}>
                                {y.tagName}: {y.textContent}
                              </li>)}
                          </ul>
                        </Card.Body>
                      </Accordion.Collapse>
                    </Card>
                  </Accordion>
                </ul>
              </li>
              )
            })}
          </ul>
        </>)
    case "GetRecord":
      const getrecords = xml.getElementsByTagName("record");
      if (getrecords.length === 0) {
        return "No se encontraron registros";
      }
      const getidentifier = getrecords[0].getElementsByTagName("identifier")[0].textContent;
      const getdatestamp = getrecords[0].getElementsByTagName("datestamp")[0].textContent;
      const getheaderSets = [];
      const getxmlSets = getrecords[0].getElementsByTagName("setSpec");
      for (let index = 0; index < getxmlSets.length; index++) {
        getheaderSets.push(getxmlSets[index]);
      }
      const getMetadata = [];
      const getMetadataXml = getrecords[0].getElementsByTagName("metadata")[0].firstChild.children;
      for (let index = 0; index < getMetadataXml.length; index++) {
        getMetadata.push(getMetadataXml[index]);
      }
      return (<><b>Recurso encontrado:</b>
        <ul>
          <li>Identificador [identifier]: {getidentifier}</li>
          <li>Fecha [datestamp]: {getdatestamp}</li>
          <li>Pertenece a los conjuntos [setSpec]:
                <ul>
              {getheaderSets.map((y, index2) =>
                <li key={`set-${index2}-1`}>
                  {y.textContent}
                </li>)}
            </ul>
          </li>
          <Accordion>
            <Card>
              <Card.Header>
                <Accordion.Toggle as={Button} variant="link" eventKey={"0"}>
                  Metadatos
                </Accordion.Toggle>
              </Card.Header>
              <Accordion.Collapse eventKey={"0"}>
                <Card.Body>
                  <ul>
                    {getMetadata.map((y, index2) =>
                      <li key={`set-${index2}-2`}>
                        {y.tagName}: {y.textContent}
                      </li>)}
                  </ul>
                </Card.Body>
              </Accordion.Collapse>
            </Card>
          </Accordion>
        </ul>
      </>
      )
    default:
      break;
  }
}

const OAIPMHResponsePanel = ({ xml, verb }) => {
  return (
    <>
      <h4>Extracto de la respuesta</h4>
      { getFields(xml, verb)}
    </>
  )
}

export default OAIPMHResponsePanel;