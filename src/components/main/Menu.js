import React from 'react';
import { Nav, Navbar } from 'react-bootstrap';

const Menu = () => (
    <Navbar bg="dark" expand="lg">
            <Navbar.Brand href="/"><span className={"nav-text"}>Protocolos</span></Navbar.Brand>
            <Navbar.Toggle aria-controls="basic-navbar-nav" />
            <Navbar.Collapse id="basic-navbar-nav">
                <Nav className="mr-auto">
                    <Nav.Link href="/repos-protocols-demo-client/#/oai-pmh"><span className={"nav-text"}>OAI-PMH</span></Nav.Link>
                </Nav>
                <Nav className="mr-auto">
                    <Nav.Link href="/repos-protocols-demo-client/#/open-search"><span className={"nav-text"}>OpenSearch</span></Nav.Link>
                </Nav>
                <Nav className="mr-auto">
                    <Nav.Link href="/repos-protocols-demo-client/#/sru"><span className={"nav-text"}>SRU</span></Nav.Link>
                </Nav>
                <Nav className="mr-auto">
                    <Nav.Link href="/repos-protocols-demo-client/#/sword"><span className={"nav-text"}>SWORD</span></Nav.Link>
                </Nav>
            </Navbar.Collapse>
        </Navbar>
)

export default Menu;