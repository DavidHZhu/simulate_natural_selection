import Game from "./Game";
import * as p5 from './p5.min.js';

const g = new Game();
let ANGLE = 0;

let s = (p5) => {
  p5.setup = () =>{
    p5.createCanvas(window.innerWidth,window.innerHeight, p5.WEBGL);
    p5.background(40);
    console.log('test');
  };

  p5.draw = () => {
    ANGLE += 0.01;
    p5.background(0);
    p5.camera(80, -100, 80, 0, 0, 0, 0, 1, 0);
    p5.rotateY(ANGLE);
    p5.box(100, 10, 100);
  }
};

const P5 = new p5(s);
