import React from 'react';
import { Alert } from 'react-bootstrap';
import SWORDPanelContainer from '../components/sword/SWORDPanelContainer';

const SWORDScreen = () => (
    <div>
        <h2>SWORD</h2>
        <Alert variant={"info"}>SWORD es una tecnología utilizada para realizar depósito remoto de documentos en el repositorio.</Alert>
        <SWORDPanelContainer />
    </div>
)

export default SWORDScreen;