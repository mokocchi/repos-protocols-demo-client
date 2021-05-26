import React, { Component } from 'react';
import RepositoryClient from '../../utils/RepositoryClient';
import OpenSearchPanel from './OpenSearchPanel';
class OpenSearchPanelContainer extends Component {
    constructor() {
        super();
        this.state = {
            parameters: {
                format: "atom",
                query: "",
                scope: "",
                rpp: "10"
            },
            GETQuery: "format=atom&rpp=10",
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
            `${(parameters.format !== "") ? `format=${parameters.format}&` :
                ""}${(parameters.scope !== "") ? `scope=${parameters.scope}&` :
                    ""}${(parameters.query !== "") ? `query=${parameters.query}&` :
                        ""}${(parameters.rpp !== "") ? `rpp=${parameters.rpp}&` :
                            ""}`;
        if (params[params.length - 1] === "&") {
            return params.slice(0, params.length - 1);
        } else {
            return params;
        }
    }

    onChangeFormat = (e) => {
        const params = this.state.parameters;
        params.format = e.target.value;
        this.setState({
            parameters: params,
            GETQuery: this.getParameters(params),
            response: ""
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

    onChangeScope = (e) => {
        const params = this.state.parameters;
        params.scope = e.target.value;
        this.setState({
            parameters: params,
            GETQuery: this.getParameters(params)
        })
    }

    onChangeRpp = (e) => {
        const params = this.state.parameters;
        params.rpp = e.target.value;
        this.setState({
            parameters: params,
            GETQuery: this.getParameters(params)
        })
    }

    onChangeOrder = (e) => {
        const params = this.state.parameters;
        params.order = e.target.value;
        this.setState({
            parameters: params,
            GETQuery: this.getParameters(params)
        })
    }

    onClickLanzar = async _ => {
        this.setState({
            loading: true
        })
        const response = await RepositoryClient.openSearchRequest(`?${this.state.GETQuery}`);
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
            <OpenSearchPanel callbacks={{
                onChangeFormat: this.onChangeFormat,
                onChangeScope: this.onChangeScope,
                onChangeQuery: this.onChangeQuery,
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

export default OpenSearchPanelContainer;