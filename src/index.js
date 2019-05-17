import Game from "./Game";
import * as p5 from './p5.min.js';


const g = new Game();

let s = (sk) => {
  sk.setup = () =>{
    sk.createCanvas(window.innerWidth,window.innerHeight);
    sk.background(40);
    console.log('test');
  }

  sk.draw = () =>{

  }
}

const P5 = new p5(s);
