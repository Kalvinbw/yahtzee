import './App.css';
import React from "react";
import logo from './images/YahtzeePic.png';
import images from './images';
//import rollDie from './js/rollDice';

function Header(props) {
  return (
    <div className="heading">
      <div className="head_img">
        <img className="YahtzeeImg" src={logo} alt="Yahzee Logo"></img>
      </div>
    </div>
  );
}

class InputForm extends React.Component {
  constructor(props) {
    super(props);
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleChange(e) {
    this.props.onChange(e);
  }

  handleSubmit(e) {
    this.props.onClick(e);
  }

  render() {
    return (
      <div className="inputArea">
        <label>
          <input 
            type="text" 
            name="chosenDie"
            onChange={this.handleChange}
            value={this.props.chosenDie}
            placeholder="Enter a number between 1-6"
            size="22"
            ></input>
        </label>
        <input type="button" value="Click to Roll" onClick={this.handleSubmit} />
      </div>    
    );
  }

}

class Dice extends React.Component {
  constructor(props) {
    super(props);
    this.state = {}
    this.handleChange = this.handleChange.bind(this);
  }

  handleChange(e) {
    this.props.onChange(e);
  }

  render() {
    let final = [];
    let mynum = this.props.num !== 'undefined' ? this.props.num : 0;
    for (let i = 0; i < 5; i++) {
      final.push(<div className="dieImg"><img key={images[i].id} src={images[mynum].src} alt="die"></img></div> )
    }
    return (
      <div className="dieImg">
        {final}
      </div>

    );
  }
}

class DieArea extends React.Component {
  constructor(props) {
    super(props);
    this.state = {array: images}
    this.handleChange = this.handleChange.bind(this);
  }

  handleChange(e) {
    this.props.onChange(e);
  }

  render() {
    return (
      <div className="inputArea">
        <Dice num={this.props.num} onChange={this.props.onChange}/>
      </div>
    );
  }
}

class Out extends React.Component {
  constructor(props) {
    super(props);
    this.handleChange = this.handleChange.bind(this);
  }

  handleChange(e) {
    this.props.onChange(e);
  }

  render() {
    let final = [];
    for (let i = 0; i < 5; i++) {
      let n = i + 1;
      let phrase = "Dice " + n + " rolls = " + this.props.rolls[i];
      final.push(<div className="dieOutput"><p key={i}>{phrase}</p></div> )
    }
    return (
      <div className="inputArea">
        {final}
      </div>

    );
  }
}

class OutputArea extends React.Component {
  constructor(props) {
    super(props);
    this.state = {array: images}
  }

  render() {
    if (!this.props.show) {
      return (
        <div></div>
      );
    }

    return (
      <span>
        <div className="inputArea">
          <Out rolls={this.props.results}/>
        </div>
        <div>
          <p>Total Rolls: {this.props.total}</p>
        </div>
      </span>
    );
  }
}

class App extends React.Component {
  constructor() {
    super();
    this.state = {
      apiData: '',
      chosenDie: 1,
      flag: false,
      imageArray: images,
      clicked: false,
      totalRolls: 0,
      resultArray: [0, 0, 0, 0, 0, 0]
    }
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleChange(e) {
    let nam = e.target.name;
    let num = parseInt(e.target.value);
    if (num < 1 || num > 6 || typeof(num) === 'undefined' || isNaN(num)) {
      this.setState({flag: true, chosenDie: 1});
    } else {
      if (isNaN(num)) {
        num = 1;
      }
      this.setState({[nam]: num, flag: false, clicked: false});
    }
  }

  handleSubmit(e) {
    e.preventDefault();
    let num = this.state.chosenDie;
    let array = [];
    let total = 0;
    let rolled;
    let j = 0;
    for (let i = 0; i < 6; i++) {
      j = 0;
      do {
        rolled = (Math.floor(Math.random() * 6) + 1);
        if (rolled === num) {
          ++total;
          ++j;
          array.push(j);
        } else {
          ++j;
          ++total;
        }
      } while (rolled !== num);
    }
    this.setState({resultArray: array, clicked: true, totalRolls: total});
  }

  callAPI() {
    fetch("/api")
      .then((res) => res.json())
      .then((data) => this.setState({apiData: data.message}));
  }

  componentWillMount() {
    this.callAPI();
  }

  render() {
    let arrNum = this.state.chosenDie - 1;
    let alert;
    if (this.state.flag === true) {
      alert = <div><p>Please enter a valid number between 1 and 6</p></div>;
      arrNum = 1;
    } else {
      alert = <div></div>;
    }

    return (
      <div className="App">
        <Header />
        <InputForm value={this.state.chosenDie} onChange={this.handleChange} onClick={this.handleSubmit} />
        {alert}
        <DieArea num={arrNum} onChange={this.handleChange} />
        <OutputArea results={this.state.resultArray} show={this.state.clicked} total={this.state.totalRolls}/>
      </div>
    );
  }
}

export default App;
