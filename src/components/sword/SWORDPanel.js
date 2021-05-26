import React from 'react';
import { Accordion, Button, Card, Col, Form, Row, Spinner } from 'react-bootstrap';
import XMLViewer from 'react-xml-viewer'
import base64 from 'base-64';
import SWORDResponsePanel from './SWORDResponsePanel';

const SWORDPanel = ({ entry, loading, user, pass, step, operation, route, endpoint, handle, response, xml, callbacks }) => {
    return (
        <div>
            <Row>
                <Col md={6}>
                    <Form.Group>
                        <Form.Label>Operación</Form.Label>
                        <Form.Control as="select" onChange={callbacks.onChangeOperation}>
                            <option value="servicedocument">Obtener colecciones disponibles (servicedocument)</option>
                            <option value="deposit">Depositar</option>
                            <option value="get">Comprobar depósito (via REST, ajeno a SWORD)</option>
                        </Form.Control>
                        <Form.Text>Tipos de operaciones posibles [1]</Form.Text>
                    </Form.Group>
                </Col>
            </Row>
            {operation !== "get" &&
                <>
                    <Row>
                        <h3>Headers</h3>
                    </Row>
                    <Row>
                        <Col md={3}>
                            <Form.Group>
                                <Form.Label>Usuario</Form.Label>
                                <Form.Control as="input" onChange={callbacks.onChangeUser} />
                                <Form.Text><ul>
                                    <li>
                                        dspacedemo+admin[at]gmail.com [2]
                            </li>
                                    <li>
                                        dspacedemo+submit[at]gmail.com [2]
                                </li>
                                </ul></Form.Text>
                            </Form.Group>
                        </Col>
                        <Col md={3}>
                            <Form.Group>
                                <Form.Label>Contraseña</Form.Label>
                                <Form.Control as="input" type="password" onChange={callbacks.onChangePass} />
                                <Form.Text>Empieza con dsp y termina con ace (6 letras) [2]</Form.Text>
                            </Form.Group>
                        </Col>
                        {(operation === "deposit") &&
                            <Col md={3}>
                                <Form.Group>
                                    <Form.Label>En nombre de (opcional)</Form.Label>
                                    <Form.Control as="input" onChange={callbacks.onChangeObo} />
                                    <Form.Text>En nombre de quién se deposita el archivo</Form.Text>
                                </Form.Group>
                            </Col>
                        }
                    </Row>
                </>
            }
            <Row>
                <h3>URI</h3>
            </Row>
            <Row>
                {(operation === "deposit") && (step === 1) &&
                    <Col md={3}>
                        <Form.Group>
                            <Form.Label>Colección</Form.Label>
                            <Form.Control as="input" onChange={callbacks.onChangeHandle} />
                            <Form.Text>Obtenga el listado de las colecciones posibles con la operación servicedocument</Form.Text>
                        </Form.Group>
                    </Col>
                }
                {operation === "get" &&
                    <Col md={3}>
                        <Form.Group>
                            <Form.Label>Recurso</Form.Label>
                            <Form.Control as="input" onChange={callbacks.onChangeHandle} />
                            <Form.Text>Handle del recurso que acaba de crear</Form.Text>
                        </Form.Group>
                    </Col>
                }
            </Row>
            {(operation === "deposit") && (step === 1) &&
                <>
                    <Row>
                        <h3>Cuerpo</h3>
                    </Row>
                    <Row>
                        <h5>Metadatos</h5>
                    </Row>
                    <Row>
                        <Col md={3}>
                            <Form.Group>
                                <Form.Label>Título</Form.Label>
                                <Form.Control as="input" onChange={callbacks.onChangeTitle} />
                                <Form.Text>Título del recurso</Form.Text>
                            </Form.Group>
                        </Col>
                        <Col md={3}>
                            <Form.Group>
                                <Form.Label>ID</Form.Label>
                                <Form.Control as="input" onChange={callbacks.onChangeID} />
                                <Form.Text>Identificador del recurso</Form.Text>
                            </Form.Group>
                        </Col>
                        <Col md={3}>
                            <Form.Group>
                                <Form.Label>Autor</Form.Label>
                                <Form.Control as="input" onChange={callbacks.onChangeAuthor} />
                                <Form.Text>Nombre completo del autor</Form.Text>
                            </Form.Group>
                        </Col>
                    </Row>
                    <Row>
                        <Col md={3}>
                            <Form.Group>
                                <Form.Label>Descripción (summary)</Form.Label>
                                <Form.Control as="input" onChange={callbacks.onChangeSummary} />
                                <Form.Text>Descripción del recurso</Form.Text>
                            </Form.Group>
                        </Col>
                        <Col md={3}>
                            <Form.Group>
                                <Form.Label>Abstract</Form.Label>
                                <Form.Control as="input" onChange={callbacks.onChangeAbstract} />
                                <Form.Text>Abstract del recurso</Form.Text>
                            </Form.Group>
                        </Col>
                        <Col md={3}>
                            <Form.Group>
                                <Form.Label>Disponible desde</Form.Label>
                                <Form.Control as="input" onChange={callbacks.onChangeAvailable} />
                                <Form.Text>Desde cuando está disponible el recurso</Form.Text>
                            </Form.Group>
                        </Col>
                    </Row>
                    <Row>
                    </Row>
                </>
            }
            <Row>
                <h3>Petici&oacute;n</h3>
            </Row>
            <Row>
                <Col>
                    <span>http://demo.dspace.org/{route}/{endpoint}/{["get", "deposit"].includes(operation) && handle}{operation === "get" && "?expand=metadata"}</span>
                    <h5>Headers</h5>
                    <ul>
                        <li>Authorization: Basic {base64.encode(`${user}:${pass}`)}</li>
                    </ul>
                    {((operation === "deposit") && (step === 1)) &&
                        <>
                            <h5>Cuerpo de la petición</h5>
                            <Accordion>
                                <Card>
                                    <Card.Header>
                                        <Accordion.Toggle as={Button} variant="link" eventKey="1">
                                            Ver cuerpo en crudo
                            </Accordion.Toggle>
                                    </Card.Header>
                                    <Accordion.Collapse className={"xml-card"} eventKey="1">
                                        <Col>
                                            <XMLViewer xml={entry} />
                                        </Col>
                                    </Accordion.Collapse>
                                </Card>
                            </Accordion>
                        </>
                    }
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
                            {xml &&
                                <SWORDResponsePanel xml={xml} operation={operation} />
                            }
                        </Col>
                    </Row>
                </>
            }
            <Row>
                <Col>
                    <h3>Referencias</h3>
                    <ol>
                        <li>
                            <a href="https://github.com/swordapp/swordappv2-php-library/blob/521f12baf8b9fb9fe0fd1ea3fb9f2dd399433722/examples/archivematica/archivematica.php">swordappv2-php-library archivematica.php</a>
                        </li>
                        <li>
                            <a href="http://demo.dspace.org/xmlui/">DSPACE Demo UI</a>
                        </li>
                        <li>
                            <a href="https://wiki.lyrasis.org/display/DSDOC6x/SWORDv2+Server">DSPACE 6 SWORD Docs</a>
                        </li>
                        <li>
                            <a href="https://github.com/swordapp/swordappv2-php-library/blob/521f12baf8b9fb9fe0fd1ea3fb9f2dd399433722/swordappclient.php">swordappv2-php-library SWORDAPPClient.php</a>
                        </li>
                    </ol>
                </Col>
            </Row>
        </div >
    )
}

export default SWORDPanel;