import React from 'react';
import { Accordion, Button, Card, Col, Form, Row, Spinner } from 'react-bootstrap';
import XMLViewer from 'react-xml-viewer'
import SRUResponsePanel from './SRUResponsePanel';

const SRUPanel = ({ loading, parameters, GETQuery, response, xml, callbacks }) => {
    return (
        <div>
            <Row>
                <h3>URI</h3>
            </Row>
            <Row>
                <Col md={6}>
                    <Form.Group>
                        <Form.Label>Operación (operation)</Form.Label>
                        <Form.Control as="select" onChange={callbacks.onChangeOperation}>
                            <option value="explain">Explain: obtener datos del repositorio</option>
                            <option value="searchRetrieve">SearchRetrieve: obtener listado de registros</option>
                            <option value="scan">Scan: obtener términos cercanos (no siempre está soportado)</option>
                        </Form.Control>
                        <Form.Text>Tipos de operaciones posibles [1]</Form.Text>
                    </Form.Group>
                </Col>
            </Row>
            { (parameters.operation !== "explain") &&
                <>
                    <Row>
                        <h3>Parámetros</h3>
                    </Row>
                    {(parameters.operation === "scan") &&
                        <Row>
                            <Col md={3}>
                                <Form.Group>
                                    <Form.Label>Condición de escaneo (scanClause)</Form.Label>
                                    <Form.Control as="input" onChange={callbacks.onChangeScanClause} />
                                    <Form.Text>Término según el cual se va a escanear</Form.Text>
                                </Form.Group>
                            </Col>
                        </Row>
                    }
                    {(parameters.operation === "searchRetrieve") &&
                        <>
                            <Row>
                                <Col md={3}>
                                    <Form.Group>
                                        <Form.Label>Cantidad de registros (maximumRecords)</Form.Label>
                                        <Form.Control as="input" onChange={callbacks.onChangeMaximumRecords} />
                                        <Form.Text>Cantidad de registros a mostrar.</Form.Text>
                                    </Form.Group>
                                </Col>
                                <Col md={3}>
                                    <Form.Group>
                                        <Form.Label>Esquema de metadatos (recordSchema)</Form.Label>
                                        <Form.Control as="input" onChange={callbacks.onChangeRecordSchema} />
                                        <Form.Text>Necesario para mostrar los registros. Pista: buscar con Explain los formatos disponibles (marcxml - dc - mods2 - mods).</Form.Text>
                                    </Form.Group>
                                </Col>
                            </Row>
                            <Row>
                                <Col md={6}>
                                    <Form.Group>
                                        <Form.Label>Consulta (query)</Form.Label>
                                        <Form.Control as="input" onChange={callbacks.onChangeQuery} />
                                        <Form.Text>
                                            Consulta a realizar. Los campos a consultar están listados en Índices al hacer una petición Explain.<br />
                                            Ejemplos:
                                            <ul>
                                                <li>dc.title=microservices</li>
                                                <li>dc.author=newman</li>
                                                <li>dc.author=newman and microservices</li>
                                                <li>bath.isbn=978-1-491-95035-7</li>
                                            </ul>
                                        </Form.Text>
                                    </Form.Group>
                                </Col>
                            </Row>
                        </>
                    }
                </>
            }

            <Row>
                <h3>Petici&oacute;n</h3>
            </Row>
            <Row>
                <Col>
                    <span>https://sru.api.melinda.kansalliskirjasto.fi/bib?{GETQuery}</span>
                </Col>
            </Row>
            <Row>
                <Col>
                    {loading ? <Spinner animation="border" role="status" /> : <Button onClick={callbacks.onClickLanzar}>Lanzar petición</Button>}
                </Col>
            </Row>
            {
                (response !== "") &&
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
                            <SRUResponsePanel xml={xml} operation={parameters.operation} format={parameters.recordSchema} />
                        </Col>
                    </Row>
                </>
            }
            <Row>
                <Col>
                    <h3>Referencias</h3>
                    <ol>
                        <li>
                            <a href="http://www.loc.gov/standards/sru/index.html">SRU- Search/Retrieve via URL</a>
                        </li>
                    </ol>
                </Col>
            </Row>
        </div >
    )
}

export default SRUPanel;