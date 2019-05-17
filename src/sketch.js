//import Game from "./Game";

//const game = new Game();

function setup() {
  createCanvas(640, 480, WEBGL);
}

function draw() {
  //game.draw();
  ANGLE += 0.01;
  background(0);
  camera(80, -100, 80, 0, 0, 0, 0, 1, 0);
  rotateY(ANGLE);
  box(100, 10, 100);
}