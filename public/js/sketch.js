import Game from "./Game";

const game = new Game();

function setup() {
  createCanvas(640, 480);
}

function draw() {
  game.draw();
}