import React from 'react';
import { Alert } from 'react-bootstrap';
import SRUPanelContainer from '../components/sru/SRUPanelContainer';

const SRUScreen = () => (
    <div>
        <h2>SRU</h2>
        <Alert variant={"info"}>SRU es una tecnología utilizada para realizar búsquedas sobre los recursos del repositorio.</Alert>
        <SRUPanelContainer />
    </div>
)

export default SRUScreen;