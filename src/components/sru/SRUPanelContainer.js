import React, { Component } from 'react';
import RepositoryClient from '../../utils/RepositoryClient';
import SRUPanel from './SRUPanel';

class SRUPanelContainer extends Component {
    constructor() {
        super();
        this.state = {
            parameters: {
                operation: "explain",
                scanClause: "",
                query: "",
                maximumRecords: "",
                recordSchema: ""
            },
            GETQuery: "operation=explain",
            response: "",
            parsedXML: null,
            loading: false
        }
    }

    getParameters = (parameters = []) => {
        const values = Object.values(parameters);
        if (values.length === 0) {
            return "";
        }
        const some = values.reduce((prev, curr) => (curr !== "") || prev);
        const params = some &&
            `${(parameters.operation !== "") ? `operation=${parameters.operation}&` :
                ""}${(parameters.scanClause !== "") ? `scanClause=${parameters.scanClause}&` :
                    ""}${(parameters.maximumRecords !== "") ? `maximumRecords=${parameters.maximumRecords}&` :
                        ""}${(parameters.recordSchema !== "") ? `recordSchema=${parameters.recordSchema}&` :
                            ""}${(parameters.query !== "") ? `query=${parameters.query}&` :
                                ""}`;
        if (params[params.length - 1] === "&") {
            return params.slice(0, params.length - 1);
        } else {
            return params;
        }
    }

    onChangeOperation = (e) => {
        this.setState({
            parameters: {
                operation: e.target.value,
                scanClause: "",
                query: "",
                maximumRecords: "",
                recordSchema: ""
            },
            GETQuery: `operation=${e.target.value}`,
            response: "",
        })
    }

    onChangeScanClause = (e) => {
        const params = this.state.parameters;
        params.scanClause = e.target.value;
        this.setState({
            parameters: params,
            GETQuery: this.getParameters(params)
        })
    }

    onChangeQuery = (e) => {
        const params = this.state.parameters;
        params.query = e.target.value;
        this.setState({
            parameters: params,
            GETQuery: this.getParameters(params)
        })
    }

    onChangeMaximumRecords = (e) => {
        const params = this.state.parameters;
        params.maximumRecords = e.target.value;
        this.setState({
            parameters: params,
            GETQuery: this.getParameters(params)
        })
    }

    onChangeRecordSchema = (e) => {
        const params = this.state.parameters;
        params.recordSchema = e.target.value;
        this.setState({
            parameters: params,
            GETQuery: this.getParameters(params),
            response: ""
        })
    }

    onClickLanzar = async _ => {
        this.setState({
            loading: true
        })
        const response = await RepositoryClient.sruRequest(`?${this.state.GETQuery}`);
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
            <SRUPanel callbacks={{
                onChangeOperation: this.onChangeOperation,
                onChangeScanClause: this.onChangeScanClause,
                onChangeQuery: this.onChangeQuery,
                onChangeMaximumRecords: this.onChangeMaximumRecords,
                onChangeRecordSchema: this.onChangeRecordSchema,
                onClickLanzar: this.onClickLanzar,
            }}
                parameters={this.state.parameters}
                GETQuery={this.state.GETQuery}
                response={this.state.response}
                xml={this.state.parsedXML}
                loading={this.state.loading}
            />
        )
    }
}

export default SRUPanelContainer;