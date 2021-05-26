import React from 'react';
import { Accordion, Button, Card, Col, Form, Row, Spinner } from 'react-bootstrap';
import XMLViewer from 'react-xml-viewer'
import OpenSearchResponsePanel from './OpenSearchResponsePanel';

const OpenSearchPanel = ({ loading, parameters, GETQuery, response, xml, callbacks }) => {
    return (
        <div>
            <Row>
                <h3>Parámetros</h3>
            </Row>
            <Row>
                <Col md={3}>
                    <Form.Group>
                        <Form.Label>Formato (format)</Form.Label>
                        <Form.Control as="select" onChange={callbacks.onChangeFormat}>
                            <option value="atom">Atom</option>
                            <option value="rss">RSS</option>
                        </Form.Control>
                        <Form.Text>Formato de la respuesta, apto para interactuar con lectores de sindicación o plugins.</Form.Text>
                    </Form.Group>
                </Col>
                <Col md={3}>
                    <Form.Group>
                        <Form.Label>Resultados por página (rpp)</Form.Label>
                        <Form.Control as="input" defaultValue={parameters.rpp} onChange={callbacks.onChangeRpp} />
                    </Form.Group>
                </Col>
                <Col md={3}>
                    <Form.Group>
                        <Form.Label>Colección o comunidad (scope)</Form.Label>
                        <Form.Control as="input" placeholder="10915/36" onChange={callbacks.onChangeScope} />
                        <Form.Text>Pista: usar ListSets en el panel de OAI-PMH, las colecciones (col) o comunidades (com) que salen como com_AAAAA_BBB tienen como handle AAAAA/BBB.</Form.Text>
                    </Form.Group>
                </Col>
            </Row>
            <Row>
                <Col>
                    <Form.Group>
                        <Form.Label>Consulta (query)</Form.Label>
                        <Form.Control as="input" onChange={callbacks.onChangeQuery} />
                    </Form.Group>
                </Col>
            </Row>
            <Row>
                <Col>
                    <Accordion>
                        <Card>
                            <Card.Header>
                                <Accordion.Toggle as={Button} variant="link" eventKey="1">
                                    Referencia para el campo Consulta
                            </Accordion.Toggle>
                            </Card.Header>
                            <Accordion.Collapse className={"query-reference"} eventKey="1">
                                <Col>
                                    Formato (siempre entre paréntesis):
                                <ul>
                                        <li>
                                            Búsqueda por campo de metadatos (sólo funcionan algunos campos):
                                            <pre>(dc.subject:"Object-oriented Programming")</pre>
                                            <pre>(dc.title:"Parte-del-titulo")</pre>
                                            <pre>(sedici.subtype: "Tesis de grado")</pre>
                                        </li>
                                        <li>
                                            Búsqueda libre:
                                            <pre>("Microservicios")</pre>
                                        </li>
                                        <li>
                                            Búsqueda combinada:
                                            <pre>((sedici.subtype: "Tesis de grado") AND (dc.subject:"Microservicios"))</pre>
                                        </li>
                                    </ul>
                                    <p>

                                    </p>
                                </Col>
                            </Accordion.Collapse>
                        </Card>
                    </Accordion>
                </Col>
            </Row>
            <Row>
                <h3>Petici&oacute;n</h3>
            </Row>
            <Row>
                <Col>
                    <span>http://sedici.unlp.edu.ar/open-search/discover?{GETQuery}</span>
                </Col>
            </Row>
            <Row>
                <Col>
                    {loading? <Spinner animation="border" role="status"/> : <Button onClick={callbacks.onClickLanzar}>Lanzar petición</Button>}
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
                            <OpenSearchResponsePanel xml={xml} label="Feed" format={parameters.format} />
                        </Col>
                    </Row>
                </>
            }
        </div>
    )
}

export default OpenSearchPanel;