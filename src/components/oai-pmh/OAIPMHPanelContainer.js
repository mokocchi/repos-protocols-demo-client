import React, { Component } from 'react';
import RepositoryClient from '../../utils/RepositoryClient';
import OAIPMHPanel from './OAIPMHPanel';
class OAIPMHPanelContainer extends Component {
    constructor() {
        super();
        this.state = {
            loading: false,
            context: "request",
            verb: "Identify",
            parameters: {
                metadataPrefix: "",
                from: "",
                until: "",
                identifier: "",
                set: "",
                resumptionToken: ""
            },
            missingMetadataFormat: false,
            metadataFormatPresentError: false,
            GETQuery: "",
            response: "",
            parsedXML: null
        }
    }

    getParameters = (parameters = []) => {
        const values = Object.values(parameters);
        if (values.length === 0) {
            return "";
        }
        const some = values.reduce((prev, curr) => (curr !== "") || prev);
        const params = some &&
            `${(parameters.metadataPrefix !== "") ? `metadataPrefix=${parameters.metadataPrefix}&` :
                ""}${(parameters.from !== "") ? `from=${parameters.from}&` :
                    ""}${(parameters.until !== "") ? `until=${parameters.until}&` :
                        ""}${(parameters.identifier !== "") ? `identifier=${parameters.identifier}&` :
                            ""}${(parameters.set !== "") ? `set=${parameters.set}&` :
                                ""}${(parameters.resumptionToken !== "") ? `resumptionToken=${parameters.resumptionToken}&` :
                                    ""}`;
        if (params[params.length - 1] === "&") {
            return params.slice(0, params.length - 1);
        } else {
            return params;
        }
    }

    onChangeContext = (e) => {
        this.setState({
            context: e.target.value
        })
    }

    onChangeVerb = (e) => {
        this.setState({
            verb: e.target.value,
            parameters: {
                metadataPrefix: "",
                from: "",
                until: "",
                identifier: "",
                set: "",
                resumptionToken: ""
            },
            GETQuery: "",
            response: "",
        })
    }

    onChangeMetadataPrefix = (e) => {
        const params = this.state.parameters;
        params.metadataPrefix = e.target.value;
        this.setState({
            parameters: params,
            GETQuery: this.getParameters(params),
            missingMetadataFormat: (params.metadataPrefix === "") && (this.state.parameters.resumptionToken === ""),
            metadataFormatPresentError: (params.metadataPrefix !== "") && (this.state.parameters.resumptionToken !== "")
        })
    }

    onChangeFrom = (e) => {
        const params = this.state.parameters;
        params.from = e.target.value;
        this.setState({
            parameters: params,
            GETQuery: this.getParameters(params)
        })
    }

    onChangeUntil = (e) => {
        const params = this.state.parameters;
        params.until = e.target.value;
        this.setState({
            parameters: params,
            GETQuery: this.getParameters(params)
        })
    }

    onChangeIdentifier = (e) => {
        const params = this.state.parameters;
        params.identifier = e.target.value;
        this.setState({
            parameters: params,
            GETQuery: this.getParameters(params)
        })
    }

    onChangeSet = (e) => {
        const params = this.state.parameters;
        params.set = e.target.value;
        this.setState({
            parameters: params,
            GETQuery: this.getParameters(params)
        })
    }

    onChangeResumptionToken = (e) => {
        const params = this.state.parameters;
        params.resumptionToken = e.target.value;
        this.setState({
            parameters: params,
            GETQuery: this.getParameters(params)
        })
    }

    onClickLanzar = async _ => {
        if (["GetRecord", "ListIdentifiers", "ListRecords"].includes(this.state.verb)) {
            if ((this.state.parameters.metadataPrefix === "")
                && (this.state.parameters.resumptionToken === "")) {
                this.setState({
                    missingMetadataFormat: true
                })
                return;
            }
            if ((this.state.parameters.metadataPrefix !== "")
                && (this.state.parameters.resumptionToken !== "")) {
                this.setState({
                    metadataFormatPresentError: true
                })
                return;
            }
        }
        this.setState({
            loading: true
        })
        const response = await RepositoryClient.oaiPmhRequest(`${this.state.context}?verb=${this.state.verb}${this.state.GETQuery !== "" ? "&" : ""}${this.state.GETQuery}`);
        this.setState({
            loading: false
        })
        const parser = new DOMParser();
        const xmlDoc = parser.parseFromString(response, "text/xml");
        const error = xmlDoc.getElementsByTagName("parsererror");
        const parsedXML = error.length > 0 ? null : xmlDoc;
        this.setState({ response, parsedXML })
    }

    render() {
        return (
            <OAIPMHPanel callbacks={{
                onChangeVerb: this.onChangeVerb,
                onChangeContext: this.onChangeContext,
                onChangeMetadataPrefix: this.onChangeMetadataPrefix,
                onChangeFrom: this.onChangeFrom,
                onChangeUntil: this.onChangeUntil,
                onChangeIdentifier: this.onChangeIdentifier,
                onChangeSet: this.onChangeSet,
                onChangeResumptionToken: this.onChangeResumptionToken,
                onClickLanzar: this.onClickLanzar,
            }}
                verb={this.state.verb}
                context={this.state.context}
                parameters={this.state.parameters}
                missingMetadataFormat={this.state.missingMetadataFormat}
                metadataFormatPresentError={this.state.metadataFormatPresentError}
                GETQuery={this.state.GETQuery}
                response={this.state.response}
                xml={this.state.parsedXML}
                loading={this.state.loading}
            />
        )
    }
}

export default OAIPMHPanelContainer;