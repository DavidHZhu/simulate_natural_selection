import Creature from "./Creature";

function getRandomInt(max) {
  return Math.floor(Math.random() * Math.floor(max));
}

export default class Game {
  constructor(width, height, n) {
    this.width = width;
    this.height = height;
    this.generations = [];
    this.gen = 0;

    this.randomGen(n);
  }
  draw(p5) {
    this.creatures.forEach((creature) => creature.draw(p5));
  }

  json() {
    // return JSON.stringify({
    //   data: this.generations
    // });

    return this.generations;
  }

  nextGen() {
    this.generations.push({
      gen: this.gen++,
      creatures: this.creatures
    });

    this.creatures.map((creature) => creature.mutate());
  }

  randomGen(n) {
    this.creatures = [];

    for (let i = 0; i < n; i++) {
      this.creatures.push(new Creature(getRandomInt(this.width),getRandomInt(this.height), {
        size: getRandomInt(50)
      }))
    }
  }
}