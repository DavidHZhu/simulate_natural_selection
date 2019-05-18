import Game from "./Game";
import * as p5 from 'p5';
import {N_FOOD, TICKS_PER_FRAME} from "./Constants";
import Button from "./Button";


let s = (p5) => {
  let game;
  let cur_speed;
  // let ANGLE = 0;
  const buttons = [];

  p5.setup = () =>{
    game = new Game(window.innerWidth, window.innerHeight, N_FOOD);
    cur_speed = TICKS_PER_FRAME;

    p5.createCanvas(window.innerWidth,window.innerHeight);
    p5.background(40);

    buttons.push(new Button(10,80,100,13, "Download JSON️", () => {
      p5.saveJSON(game.json(), `ns_${game.gen}gens.json`);
    }));

    buttons.push(new Button(10,60,50,13, "<-", () => {
      if (cur_speed > 0) cur_speed--;
    }));

    buttons.push(new Button(65,60,45,13, "        ->", () => {
      cur_speed++;
    }));

    document.addEventListener('keydown', (event) => {
      if (event.key === "ArrowLeft") {
        cur_speed -= 1;
      } else if (event.key === "ArrowRight") {
        cur_speed += 1;
      }
      if (cur_speed < 0) {
        cur_speed = 0;
      }
      // console.log("SPEED: " + cur_speed)
    });
  };
  p5.draw = () => {
    // ANGLE += 0.01;
    p5.background(0);
    // p5.camera(80, -1.00, 80, 0, 0, 0, 0, 1, 0);
    // p5.rotateY(ANGLE);
    // p5.box(100, 10, 100);
    game.draw(p5);
    for (let i = 0; i < cur_speed; i++) {
      game.tick();
    }

    p5.textSize(20);
    p5.fill(255, 255, 255);
    p5.text(`Speed ${cur_speed}x`, 10, 30);
    p5.textSize(15);
    p5.text(`Gen ${game.gen}`, 10, 50);


    buttons.forEach((button) => button.draw(p5));
  };

  p5.mousePressed = () => {
    buttons.forEach((button) => button.checkPress(p5.mouseX, p5.mouseY));
  }
};

const P5 = new p5(s);
