import Creature from "./Creature";

function getRandomInt(max) {
  return Math.floor(Math.random() * Math.floor(max));
}

export default class Game {
  constructor(width, height, n) {
    this.width = width;
    this.height = height;

    this.creatures = [];


    for (let i = 0; i < n; i++) {
      this.creatures.push(new Creature(getRandomInt(width),getRandomInt(height), {
        size: getRandomInt(50)
      }))
    }
  }
  draw(p5) {
    this.creatures.forEach((creature) => creature.draw(p5));
  }
}