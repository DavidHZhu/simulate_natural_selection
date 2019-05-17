import Game from "./Game";
import * as p5 from 'p5';

let s = (p5) => {
  let game;
  // let ANGLE = 0;

  p5.setup = () =>{
    game = new Game(window.innerWidth, window.innerHeight, 15);

    p5.createCanvas(window.innerWidth,window.innerHeight);
    p5.background(40);

    // document.addEventListener('keydown', () => {
    //   game.nextGen();
    //   console.log(game.json());
    // });
  };

  p5.draw = () => {
    // ANGLE += 0.01;
    p5.background(0);
    // p5.camera(80, -1.00, 80, 0, 0, 0, 0, 1, 0);
    // p5.rotateY(ANGLE);
    // p5.box(100, 10, 100);
    game.draw(p5);
  }
};

const P5 = new p5(s);
