import React from 'react';
import { Alert } from 'react-bootstrap';
import OpenSearchPanelContainer from '../components/opensearch/OpenSearchPanelContainer';

const OpenSearchScreen = () => (
    <div>
        <h2>OpenSearch</h2>
        <Alert variant={"info"}>OpenSearch es una tecnología utilizada para realizar búsquedas sobre los recursos del repositorio. <br />
        La URL resultante puede cargarse en cualquier lector de noticias RSS/Atom.</Alert>
        <OpenSearchPanelContainer />
    </div>
)

export default OpenSearchScreen;