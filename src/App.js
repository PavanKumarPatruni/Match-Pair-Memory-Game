import React, {Component} from 'react';

import angry from './assets/images/icon-angry.png';
import cool from './assets/images/icon-cool.png';
import happy from './assets/images/icon-happy.png';
import lol from './assets/images/icon-lol.png';
import evil from './assets/images/icon-evil.png';
import love from './assets/images/icon-in-love.png';
import kiss from './assets/images/icon-kiss.png';
import neutral from './assets/images/icon-neutral.png';
import puzzled from './assets/images/icon-puzzled.png';
import sad from './assets/images/icon-sad.png';
import surprised from './assets/images/icon-surprised.png';
import tongue from './assets/images/icon-tongue-out.png';
import wink from './assets/images/icon-wink.png';
import face from './assets/images/icon-face.png';
import hand from './assets/images/icon-helping-hand.png';
import swearing from './assets/images/icon-swearing.png';
import drama from './assets/images/icon-drama.png';
import comedy from './assets/images/icon-comedy.png';

class App extends Component {

  constructor(context, props) {
    super(context, props);

    this.state = {
      gridSize: 4,
      originalImageArray: [
        happy, angry, lol, cool, evil, love, kiss, neutral, puzzled, sad, surprised, tongue, wink, face, hand, swearing, drama, comedy
      ],
      imageArray: [],
      gridArray: [],
      activeArray: [],
      lastActive: -1,
      lastActivePosition: -1,
      guessCount: 0,
      start: true,
      success: true,
      disbleClick: false,
      level: 1
    };

  }

  componentDidMount() {
    let localData = JSON.parse(localStorage.getItem('memory-game-level'));
    if (localData) {
      let {level, gridSize} = localData;
      this.setState({
        level,
        gridSize
      });
    }
  }

  shuffle(array) {
    var currentIndex = array.length, temporaryValue, randomIndex;
  
    // While there remain elements to shuffle...
    while (0 !== currentIndex) {
  
      // Pick a remaining element...
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex -= 1;
  
      // And swap it with the current element.
      temporaryValue = array[currentIndex];
      array[currentIndex] = array[randomIndex];
      array[randomIndex] = temporaryValue;
    }

    return array;
  }

  getSuffledArray(size) {
    let array = [];
    for (let index = 0; index < size; index++) {
      array.push(index);
    }
    
    return this.shuffle(array);
  }

  getFullArray(size) {
    let array1 = [], array2 = [];
    array1 = this.getSuffledArray(size);
    array2 = this.getSuffledArray(size);

    let array = array1.concat(array2);

    return array;
  }

  resetComponent() {
    let {gridSize,originalImageArray,imageArray,level} = this.state;
    let imageArrayLength = (gridSize * gridSize) / 2;

    imageArray = [];
    for (let index = 0; index < imageArrayLength; index++) {
      imageArray[index] = originalImageArray[index];
    }

    this.setState({
      imageArray
    });

    let array = this.getFullArray(imageArrayLength);
    
    let arraylength = array.length;
    let activeArray = [];
    for (let index = 0; index < arraylength; index++) {
      activeArray[index] = true;
    }

    this.setState({
      gridArray: array,
      activeArray
    });

    let timeoutLimit = 5000;
    if (level > 1) {
      timeoutLimit = 10000;
    }

    setTimeout(function() {
      for (let index = 0; index < arraylength; index++) {
        activeArray[index] = false;
      }

      this.setState({
        activeArray
      });
    }.bind(this), timeoutLimit);
  }

  onItemClick(context) {
    let position = context.target.id;
    
    let {activeArray,lastActive,gridArray,lastActivePosition,guessCount,imageArray,success,disbleClick} = this.state;

    let gridArrayValue = gridArray[position];

    if (!disbleClick && !activeArray[position]) {
      if (lastActive === -1) {
        activeArray[position] = true;
        lastActive = gridArrayValue;
        lastActivePosition = position;
      } else {
        let newActive = gridArrayValue;
        if (lastActive === newActive) {
          activeArray[position] = true;
          guessCount++;
          lastActive = -1;
          lastActivePosition = -1;

          success = guessCount === imageArray.length;

        } else {
          activeArray[lastActivePosition] = true;
          activeArray[position] = true;
          disbleClick = true;

          setTimeout(function() {
            activeArray[lastActivePosition] = false;
            activeArray[position] = false;
            disbleClick = false;
            lastActive = -1;
            lastActivePosition = -1

            this.setState({
              activeArray,
              lastActive,
              lastActivePosition,
              disbleClick
            });
          }.bind(this), 1000);
        }
      }

      this.setState({
        activeArray,
        lastActive,
        lastActivePosition,
        guessCount,
        success,
        disbleClick
      });
    }
  }

  onStartClick() {
    this.setState({
      gridArray: [],
      activeArray: [],
      lastActive: -1,
      lastActivePosition: -1,
      guessCount: 0,
      start: true,
      success: false,
      disbleClick: false
    }, function() {
      this.resetComponent();
    });
  }

  onLevelUp() {
    let {level, gridSize} = this.state;
    level++;
    gridSize += 2;

    this.setState({
      imageArray: [],
      gridSize: gridSize,
      level: level,
      gridArray: [],
      activeArray: [],
      lastActive: -1,
      lastActivePosition: -1,
      guessCount: 0,
      start: false,
      success: false,
      disbleClick: false
    }, function() {
      this.resetComponent();
    });

    localStorage.setItem('memory-game-level', JSON.stringify({level, gridSize}));
  }

  onLevelDown() {
    let {level, gridSize} = this.state;
    level--;
    gridSize -= 2;

    this.setState({
      imageArray: [],
      gridSize: gridSize,
      level: level,
      gridArray: [],
      activeArray: [],
      lastActive: -1,
      lastActivePosition: -1,
      guessCount: 0,
      start: false,
      success: false,
      disbleClick: false
    }, function() {
      this.resetComponent();
    });

    localStorage.setItem('memory-game-level', JSON.stringify({level, gridSize}));
  }

  render() {
    let {gridSize,gridArray,imageArray,activeArray,success,start,level} = this.state;
    let finalComponent = null;
    
    let levelUpComponent = null;
    if (level === 1) {
      levelUpComponent = <button className="button-class level-up" onClick={() => this.onLevelUp()}>Level Up</button>
    } else {
      levelUpComponent = <button className="button-class level-up" onClick={() => this.onLevelDown()}>Start Again</button>
    }

    if (!start) {
      finalComponent = <div className="success-div">
        <h3>LEVEL {level}</h3>
        <button className="button-class" onClick={() => this.onStartClick()}>Start</button>
      </div>
    } else {
      if (success) {
        finalComponent = <div className="success-div">
          <h3>SUCCESS</h3>
          <div>
            { levelUpComponent }
            <button className="button-class" onClick={() => this.onStartClick()}>Restart</button>
          </div>
        </div>
      } else {
        let position = 0;
        let verticalGrid = [];

        for (let vIndex = 0; vIndex < gridSize; vIndex++) {
          let horizontalGrid = [];
          for (let hIndex = 0; hIndex < gridSize; hIndex++) {

            let overlayComponent = null;
            if (!activeArray[position]) {
              overlayComponent = <div className="grid-item overlay" id={position} onClick={this.onItemClick.bind(this)}></div>
            }
            horizontalGrid.push(
              <div className="horizontal-grid-item" key={position}>
                { overlayComponent }
                <img className="grid-item" alt={position} src={imageArray[gridArray[position]]}></img>
              </div>);

            position++;
          }

          let horizontalGridParent = <div className="horizontal-grid" key={vIndex}> { horizontalGrid } </div>
          verticalGrid.push(horizontalGridParent);
        }

        finalComponent = verticalGrid;
      }
    }

    return (
      <div className="App">
        <h1>Memory Game</h1>
        <span>Guess the pair</span>
        <div className="game-div">
          <div className="parent-grid">
            { finalComponent }
          </div>
        </div>
      </div>
    );
  }
}

export default App;
