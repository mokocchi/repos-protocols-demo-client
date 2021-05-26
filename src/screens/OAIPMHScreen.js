import React from 'react';
import { Alert} from 'react-bootstrap';
import OAIPMHPanelContainer from '../components/oai-pmh/OAIPMHPanelContainer';

const OAIPMHScreen = () => (
    <div>
        <h2>OAI-PMH</h2>
        <Alert variant={"info"}>OAI-PMH es un prococolo usado para cosecha de metadatos. Notar que se usa para obtención masiva de metadatos, no para buscar.</Alert>
        <OAIPMHPanelContainer/>
    </div>
)

export default OAIPMHScreen;