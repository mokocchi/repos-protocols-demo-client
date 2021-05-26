import React, { Component } from 'react';
import { Route, HashRouter } from 'react-router-dom';
import { Container } from 'react-bootstrap'
import './App.css';
import Menu from './components/main/Menu';
import HomeScreen from './screens/HomeScreen';
import OAIPMHScreen from './screens/OAIPMHScreen';
import OpenSearchScreen from './screens/OpenSearchScreen';
import SRUScreen from './screens/SRUScreen';
import SWORDScreen from './screens/SWORDScreen';
import { GATEWAY_URL } from './env';

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}


class App extends Component {
  constructor() {
    super();
    this.state = {
      gateway_online: false
    }
  }
  
  pingGateway = async () => {
    fetch(GATEWAY_URL)
      .then(r => this.setState({
        gateway_online: true
      }))
      .catch(async e => {
        await sleep(15000);
        this.pingGateway();
      })
  }
  
  componentDidMount() {
    this.pingGateway()
  }

  render() {
    return (
      <HashRouter basename="/">
        <Menu />
        {this.state.gateway_online ?
          <Container style={{ marginTop: '1em' }}>
            <Route path="/" exact component={HomeScreen} />
            <Route path="/oai-pmh" exact component={OAIPMHScreen} />
            <Route path="/open-search" exact component={OpenSearchScreen} />
            <Route path="/sru" exact component={SRUScreen} />
            <Route path="/sword" exact component={SWORDScreen} />
          </Container>
          : <div>
            Esperando al gateway... (<a href={GATEWAY_URL}>{GATEWAY_URL}</a>)
        </div>
        }
      </HashRouter>
    )
  }
}

export default App;
