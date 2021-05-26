import React, { useRef } from 'react';
import { Accordion, Button, Card, Col, Form, Overlay, Row, Spinner, Tooltip } from 'react-bootstrap';
import XMLViewer from 'react-xml-viewer'
import OAIPMHResponsePanel from './OAIPHMResponsePanel';

const OAIPMHPanel = ({ loading, verb, context, parameters, missingMetadataFormat, metadataFormatPresentError, GETQuery, response, xml, callbacks }) => {
    const target = useRef(null);
    return (
        <div>
            <Row>
                <h3>URI</h3>
            </Row>
            <Row>
                <Col md={3}>
                    <Form.Group>
                        <Form.Label>Contexto [específico de XOAI]</Form.Label>
                        <Form.Control as="select" onChange={callbacks.onChangeContext}>
                            <option value="request">Default</option>
                            <option value="driver">Driver</option>
                            <option value="openaire">OpenAIRE</option>
                            <option value="snrd">SNRD</option>
                            <option value="doaj">DOAJ</option>
                        </Form.Control>
                        <Form.Text>El contexto define los esquemas de metadatos disponibles y los items alcanzados [1]</Form.Text>
                    </Form.Group>
                </Col>
                <Col md={6}>
                    <Form.Group>
                        <Form.Label>Verbo (verb)</Form.Label>
                        <Form.Control as="select" onChange={callbacks.onChangeVerb}>
                            <option value="Identify">Identify: obtener datos del repositorio</option>
                            <option value="ListMetadataFormats" >ListMetadataFormats: obtener listado de formatos de metadatos</option>
                            <option value="ListSets">ListSets: obtener listado de conjuntos</option>
                            <option value="ListIdentifiers">ListIdentifiers: obtener listado de cabeceras de registros</option>
                            <option value="ListRecords">ListRecords: obtener listado de registros</option>
                            <option value="GetRecord">GetRecord: obtener un único registro</option>
                        </Form.Control>
                        <Form.Text>Los verbos de OAI-PMH son los tipos de peticiones posibles [2]</Form.Text>
                    </Form.Group>
                </Col>
            </Row>
            { (verb !== "Identify") &&
                <>
                    <Row>
                        <h3>Parámetros</h3>
                    </Row>
                    <Row>
                        {["GetRecord", "ListIdentifiers", "ListRecords"].includes(verb) &&
                            <Col md={3}>
                                <Form.Group>
                                    <Form.Label>Prefijo de metadatos (metadataPrefix)</Form.Label>
                                    <Form.Control ref={target} as="input" placeholder="formato" onChange={callbacks.onChangeMetadataPrefix} value={parameters.metadataPrefix} />
                                    <Overlay target={target.current} show={missingMetadataFormat} placement="right">
                                        {(props) => (
                                            <Tooltip id="overlay" {...props}>
                                                El prefijo de metadatos es obligatorio
                                            </Tooltip>
                                        )}
                                    </Overlay>
                                    <Overlay target={target.current} show={metadataFormatPresentError} placement="right">
                                        {(props) => (
                                            <Tooltip id="overlay" {...props}>
                                                El prefijo de metadatos no va en esta petición
                                            </Tooltip>
                                        )}
                                    </Overlay>
                                    <Form.Text>Esquema de metadatos a usar [3]. Se puede consultar los esquemas disponibles para el contexto elegido usando ListMetadataFormats.</Form.Text>
                                </Form.Group>
                            </Col>
                        }
                        {["ListIdentifiers", "ListRecords"].includes(verb) &&
                            <Col md={3}>
                                <Form.Group>
                                    <Form.Label>A partir de [opcional] (from)</Form.Label>
                                    <Form.Control as="input" placeholder="YYYY-MM-DD" onChange={callbacks.onChangeFrom} value={parameters.from} />
                                    <Form.Text>Trae los elementos con fecha de creación o modificiación posterior a la indicada.</Form.Text>
                                </Form.Group>
                            </Col>
                        }
                        {["ListIdentifiers", "ListRecords"].includes(verb) &&
                            <Col md={3}>
                                <Form.Group>
                                    <Form.Label>Hasta [opcoinal] (until) </Form.Label>
                                    <Form.Control as="input" placeholder="YYYY-MM-DD" onChange={callbacks.onChangeUntil} value={parameters.until} />
                                    <Form.Text>Trae los elementos con fecha de creación o modificación anterior a la indicada.</Form.Text>
                                </Form.Group>
                            </Col>
                        }
                        {["GetRecord", "ListMetadataFormats"].includes(verb) &&
                            <Col md={3}>
                                <Form.Group>
                                    <Form.Label>Identificador del elemento (identifier)</Form.Label>
                                    <Form.Control as="input" placeholder="oai:sedici.unlp.edu.ar:10915/1234" onChange={callbacks.onChangeIdentifier} value={parameters.identifier} />
                                    <Form.Text>Especifica cuál registro traer. En el caso de Metadata Formats, son los formatos disponibles para ese elemento (opcional).</Form.Text>
                                </Form.Group>
                            </Col>
                        }
                        {["ListIdentifiers", "ListRecords"].includes(verb) &&
                            <Col md={3}>
                                <Form.Group>
                                    <Form.Label>Conjunto [opcional] (set)</Form.Label>
                                    <Form.Control as="input" onChange={callbacks.onChangeSet} value={parameters.set} />
                                    <Form.Text>Especifica de qué conjunto se traerán los registros o los identificadores. Se puede obtener desde ListSets.</Form.Text>
                                </Form.Group>
                            </Col>
                        }
                    </Row>
                    <Row>
                        {["ListIdentifiers", "ListRecords", "ListSets"].includes(verb) &&
                            <Col md={3}>
                                <Form.Group>
                                    <Form.Label>Token de continuación [opcional] (resumptionToken)</Form.Label>
                                    <Form.Control as="input" onChange={callbacks.onChangeResumptionToken} value={parameters.resumptionToken} />
                                    <Form.Text>Indica desde dónde empezar el listado. Se obtiene del resultado anterior.</Form.Text>
                                </Form.Group>
                            </Col>
                        }
                    </Row>
                </>
            }

            <Row>
                <h3>Petici&oacute;n</h3>
            </Row>
            <Row>
                <Col>
                    <span>http://sedici.unlp.edu.ar/oai/<b>{context}</b>?verb=<b>{verb}</b>{GETQuery && `&${GETQuery}`}</span>
                </Col>
            </Row>
            <Row>
                <Col>
                    {loading ? <Spinner animation="border" role="status"/> : <Button onClick={callbacks.onClickLanzar}>Lanzar petición</Button>}
                </Col>
            </Row>
            {(response !== "") &&
                <>
                    <Row>
                        <Col>
                            <Accordion>
                                <Card>
                                    <Card.Header>
                                        <Accordion.Toggle as={Button} variant="link" eventKey="0">
                                            Ver respuesta en crudo
                            </Accordion.Toggle>
                                    </Card.Header>
                                    <Accordion.Collapse className={"xml-card"} eventKey="0">
                                        <Col>
                                            <XMLViewer xml={response} />
                                        </Col>
                                    </Accordion.Collapse>
                                </Card>
                            </Accordion>
                        </Col>
                    </Row>
                    <Row>
                        <Col>
                            <OAIPMHResponsePanel xml={xml} verb={verb} />
                        </Col>
                    </Row>
                </>
            }
            <Row>
                <Col>
                    <h3>Referencias</h3>
                    <ol>
                        <li>
                            <a href="https://wiki.lyrasis.org/display/DSDOC5x/OAI+2.0+Server">DSPACE OAI 2.0 Server Docs</a>
                        </li>
                        <li>
                            <a href="http://www.openarchives.org/OAI/openarchivesprotocol.html#ProtocolMessages">OAI docs - Protocol Messages</a>
                        </li>
                        <li>
                            <a href="http://www.openarchives.org/OAI/openarchivesprotocol.html#MetadataNamespaces">OAI docs - Metadata Namespaces</a>
                        </li>
                    </ol>
                </Col>
            </Row>
        </div>
    )
}

export default OAIPMHPanel;