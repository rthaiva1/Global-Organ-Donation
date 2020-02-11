import React, { Component } from 'react';
import './App.css';
import Web3 from 'web3';
import patient from '../abis/patient.json'

const ipfsClient = require('ipfs-http-client')
const ipfs = ipfsClient({ host: 'ipfs.infura.io', port: 5001, protocol: 'https' })

class App extends Component {

  async loadBlockchainData() {
    const web3 = window.web3
    const accounts = await web3.eth.getAccounts()
    this.setState({ account: accounts[0] })
    const networkId = await web3.eth.net.getId()
    const networkData = patient.networks[networkId]
    if(networkData) {
      const contract = web3.eth.Contract(patient.abi, networkData.address)
      this.setState({ contract })
      const haship = await contract.methods.get().call()
      this.setState({ haship })
    } else {
      window.alert('Smart contract not deployed to this network.')
    }
  }

  async componentWillMount() {
    await this.loadWeb3()
    await this.loadBlockchainData()
  }

  async loadWeb3() {
    if (window.web3) {
      window.web3 = new Web3(window.web3.currentProvider)
    }
    else {
      window.alert('Install Meta Mask!')
    }
  }

  constructor(props)
  {
    super(props);
    this.state = {
      haship: 'QmUQQRxcmYSH75Daiv2sJZ3gUCfywoDCvym3FCcwAZ9Nzm', //default hash
      buffer: null
    };
  }
  captureFile = (event) => {
    event.preventDefault()
    const file = event.target.files[0]
    const reader = new window.FileReader()
    reader.readAsArrayBuffer(file)
    reader.onloadend = () =>  {
      this.setState({buffer: Buffer(reader.result)})
    }
  }

  onSubmit = (event) => {
    event.preventDefault()
    ipfs.add(this.state.buffer, (error, result) => {
      const haship = result[0].hash
      this.setState({ haship })
      if(error) {
        console.error(error)
        return
      }
      this.state.contract.methods.set(result[0].hash,"deafult_pairID","Valid").send({ from: this.state.account }).then((r) => {
        return this.setState({ hash: result[0].hash }, { id: "deafult_pairID" }, { validity: "Valid" } )
      })
   })
 }
  render() {
    return (
      <div >
        <div className="container-fluid mt-5">
          <div className="row">
            <h1>Organ Donation using Blockchain</h1>
          </div>
          <div className="row">
            <h2>Create Pair :</h2>
          </div>
          <div class="content">
            <div class="blue">
              <p> Recipient: </p>
              <label for="Name">Name</label> &nbsp;
              <input type="textbox" id="name_r" name="name"/>
              <label for="Age">Age</label> &nbsp;
              <input type="textbox" id="age_r" name="age"/>
              <p> Blood Type &nbsp;
              <input type="radio" name="blood" value="A"/> A &nbsp;
              <input type="radio" name="blood" value="B"/> B &nbsp;
              <input type="radio" name="blood" value="A"/> AB &nbsp;
              <input type="radio" name="blood" value="B"/> O &nbsp;
              </p>
              <p> Medical Emergency &nbsp;
              <input type="radio" name="priority" value="1"/> 1 &nbsp;
              <input type="radio" name="priority" value="2"/> 2 &nbsp;
              <input type="radio" name="priority" value="3"/> 3 &nbsp;
              <input type="radio" name="priority" value="4"/> 4 &nbsp;
              <input type="radio" name="priority" value="NA"/> NA &nbsp;
              </p>
              <p> Operation Eligibility &nbsp;
              <input type="radio" name="eligibility" value="True"/> True &nbsp;
              <input type="radio" name="eligibility" value="False"/> False &nbsp;
              </p>
            </div>
            <div class="green">
              <p> Donar: </p>
                <label for="Name">Name</label> &nbsp;
                <input type="textbox" id="name_d" name="name"/>
                <label for="Age">Age</label> &nbsp;
                <input type="textbox" id="age_d" name="age"/>
              <p> Blood Type &nbsp;
              <input type="radio" name="blood" value="A"/> A &nbsp;
              <input type="radio" name="blood" value="B"/> B &nbsp;
              <input type="radio" name="blood" value="A"/> AB &nbsp;
              <input type="radio" name="blood" value="B"/> O &nbsp;
              </p>
              <p> Medical Emergency &nbsp;
              <input type="radio" name="priority" value="1"/> 1 &nbsp;
              <input type="radio" name="priority" value="2"/> 2 &nbsp;
              <input type="radio" name="priority" value="3"/> 3 &nbsp;
              <input type="radio" name="priority" value="4"/> 4 &nbsp;
              <input type="radio" name="priority" value="NA"/> NA &nbsp;
              </p>
              <p> Operation Eligibility &nbsp;
              <input type="radio" name="eligibility" value="True"/> True &nbsp;
              <input type="radio" name="eligibility" value="False"/> False &nbsp;
              </p>
            </div>
          </div>
          <div>
            <p> Vaidity &nbsp;
              <input type="radio" name="eligibility" value="True"/> True &nbsp;
              <input type="radio" name="eligibility" value="False"/> False &nbsp;
              <input type='file'/>
            </p>
          </div>
          <div>
          <p>
            <button type="button">Generate New Pair ID</button> &nbsp;
            <input type="textbox" id="newpair" name="newpair"/> &nbsp;
            Create new Pair Information &nbsp;<input type='submit'/>
          </p>
        </div>
          <div className="row">
            <main role="main" className="col-lg-12 d-flex text-center">
              <div className="content">
                <a>
                  <object data={`https://ipfs.infura.io/ipfs/${this.state.haship}`} />
                </a>
                <form onSubmit ={this.onSubmit}>
                  <input type='file' onChange ={this.captureFile}/>
                  <input type='submit'/>
                </form>
              </div>
            </main>
          </div>
        </div>
      </div>
    );
  }
}

export default App;
