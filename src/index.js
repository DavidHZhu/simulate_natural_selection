import Game from "./Game";
import * as p5 from './p5.min.js';

const g = new Game();

let ANGLE = 0;

let s = (sk) => {
  sk.setup = () =>{
    sk.createCanvas(window.innerWidth,window.innerHeight, sk.WEBGL);
    sk.background(40);
    console.log('test');
  }

  sk.draw = () =>{
    ANGLE += 0.01;
    sk.background(0);
    sk.camera(80, -100, 80, 0, 0, 0, 0, 1, 0);
    sk.rotateY(ANGLE);
    sk.box(100, 10, 100);
  }
};

const P5 = new p5(s);
