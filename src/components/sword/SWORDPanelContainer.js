import React, { Component } from 'react';
import RepositoryClient from '../../utils/RepositoryClient';
import SWORDPanel from './SWORDPanel';

class SWORDPanelContainer extends Component {
    constructor() {
        super();
        this.state = {
            endpoint: "servicedocument",
            route: "swordv2",
            user: "",
            pass: "",
            obo: "",
            operation: "servicedocument",
            handle: "",
            response: "",
            parsedXML: null,
            loading: false,
            file: "",
            step: 1,
            editLink: "",
            metadata: {
                title: "",
                id: "",
                author: "",
                summary: "",
                abstract: "",
                available: ""
            }
        }
    }

    onChangeOperation = (e) => {
        let endpoint;
        switch (e.target.value) {
            case "servicedocument":
                endpoint = "servicedocument";
                break;
            case "deposit":
                endpoint = "collection";
                break;
            case "get":
                endpoint = "handle";
                break;
            default:
                break;
        }
        this.setState({
            operation: e.target.value,
            response: "",
            route: e.target.value === "get" ? "rest" : "swordv2",
            endpoint
        })
    }

    onChangeUser = (e) => {
        this.setState({
            user: e.target.value,
        })
    }

    onChangeTitle = (e) => {
        const metadata = this.state.metadata;
        metadata.title = e.target.value;
        this.setState({
            metadata
        })
    }

    onChangeID = (e) => {
        const metadata = this.state.metadata;
        metadata.id = e.target.value;
        this.setState({
            metadata
        })
    }

    onChangeAuthor = (e) => {
        const metadata = this.state.metadata;
        metadata.author = e.target.value;
        this.setState({
            metadata
        })
    }

    onChangeSummary = (e) => {
        const metadata = this.state.metadata;
        metadata.summary = e.target.value;
        this.setState({
            metadata
        })
    }

    onChangeAbstract = (e) => {
        const metadata = this.state.metadata;
        metadata.abstract = e.target.value;
        this.setState({
            metadata
        })
    }

    onChangeAvailable = (e) => {
        const metadata = this.state.metadata;
        metadata.available = e.target.value;
        this.setState({
            metadata
        })
    }

    onChangePass = (e) => {
        this.setState({
            pass: e.target.value,
        })
    }

    onChangeHandle = (e) => {
        this.setState({
            handle: e.target.value,
        })
    }

    depositStepOne = async () => {

    }

    onChangeFile = (e) => {
        this.setState({
            file: e.target.files[0]
        })
    }

    getXMLEntry = _ => {
        return (
            `<?xml version="1.0"?>
<entry xmlns="http://www.w3.org/2005/Atom" xmlns:dcterms="http://purl.org/dc/terms/">
<title>${this.state.metadata.title}</title>
<id>${this.state.metadata.id}</id>
<author><name>${this.state.metadata.author}</name></author>
<summary>${this.state.metadata.summary}</summary>
<dcterms:abstract>${this.state.metadata.abstract}</dcterms:abstract>
<dcterms:available>${this.state.metadata.available}</dcterms:available>
<dcterms:creator>${this.state.metadata.author}</dcterms:creator>
<dcterms:identifier>${this.state.metadata.id}</dcterms:identifier>
<dcterms:title>${this.state.metadata.title}</dcterms:title>
</entry>`
        );
    }


    onClickLanzar = async _ => {
        this.setState({
            loading: true
        })
        let response;
        switch (this.state.operation) {
            case "get":
                response = await RepositoryClient.restRequest("/handle", this.state.handle);
                break;
            case "servicedocument":
                response = await RepositoryClient.swordRequest(this.state.user, this.state.pass);
                break;
            case "deposit":
                switch (this.state.step) {
                    case 1:
                        this.setState({
                            editLink: ""
                        })
                        const entry = this.getXMLEntry();
                        response = await RepositoryClient.swordStepOne(this.state.user, this.state.pass, this.state.handle, entry, this.state.obo, this.state.file);
                        break;
                    case 2:
                        response = await RepositoryClient.swordStepTwo(this.state.user, this.state.pass, this.state.editLink, this.state.obo);
                        break;
                    default:
                        break;
                }
                break;
            default:
                response = "";
                break;
        }
        this.setState({
            loading: false
        })
        const parser = new DOMParser();
        if (response === "Unauthorized") {
            this.setState({
                response: "<xml><error>No autorizado</error></xml>",
                parsedXML: null
            });
            return;
        } else if (response === "Bad Request") {
            this.setState({
                response: "<xml><error>Petición errónea</error></xml>",
                parsedXML: null
            });
            return;
        } else {
            if (response.includes("ERROR")) {
                this.setState({
                    response: "<xml><error>Petición errónea</error></xml>",
                    parsedXML: null
                });
                return;
            }
            if (this.state.operation === "deposit") {
                this.setState({
                    step: response.includes("has been created") ? 2 : 1
                })
            }
            const xmlDoc = parser.parseFromString(response, "text/xml");
            const error = xmlDoc.getElementsByTagName("parsererror");
            const parsedXML = error.length > 0 ? null : xmlDoc;
            if (parsedXML) {
                if ((this.state.operation === "deposit") && (this.state.step === 2)) {
                    const linksXML = parsedXML.getElementsByTagName("link");
                    for (let index = 0; index < linksXML.length; index++) {
                        if (linksXML[index].getAttribute("rel") === "edit") {
                            const parts = linksXML[index].getAttribute("href").split("/");
                            this.setState({
                                editLink: parts[parts.length - 1]
                            })
                            break;
                        }
                    }
                }
            }
            this.setState({ response, parsedXML })
        }
    }

    render() {
        return (
            <SWORDPanel callbacks={{
                onChangeOperation: this.onChangeOperation,
                onChangeUser: this.onChangeUser,
                onChangePass: this.onChangePass,
                onChangeHandle: this.onChangeHandle,
                onChangeFile: this.onChangeFile,
                onChangeTitle: this.onChangeTitle,
                onChangeID: this.onChangeID,
                onChangeAuthor: this.onChangeAuthor,
                onChangeSummary: this.onChangeSummary,
                onChangeAbstract: this.onChangeAbstract,
                onChangeAvailable: this.onChangeAvailable,
                onClickLanzar: this.onClickLanzar,
            }}
                operation={this.state.operation}
                response={this.state.response}
                xml={this.state.parsedXML}
                loading={this.state.loading}
                endpoint={this.state.endpoint}
                route={this.state.route}
                user={this.state.user}
                pass={this.state.pass}
                handle={this.state.handle}
                step={this.state.step}
                entry={this.getXMLEntry()}
            />
        )
    }
}

export default SWORDPanelContainer;