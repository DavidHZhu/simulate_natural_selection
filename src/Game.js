import Creature from "./Creature";
import Food from "./Food";
import {BLUE, MIN_SIZE, RED, TICKS_PER_FRAME} from "./Constants";
import {getRandomInt} from "./Helpers";

export default class Game {
  constructor(width, height, n) {
    this.width = width;
    this.height = height;
    this.generations = [];
    this.gen = 0;

    this.randomGen(n);
  }

  draw(p5) {
    p5.fill(p5.color(...RED));
    this.creatures.forEach((creature) => creature.draw(p5));
    p5.fill(p5.color(...BLUE));
    this.food.forEach((food) => food.draw(p5));

    this.tick();
  }

  tick() {
    for (let i = 0; i < TICKS_PER_FRAME; i++) {
      this.creatures.forEach((creature) => creature.tick(this.state()));

      if (this.food.length === 0) {
        this.nextGen();
      }
    }
  }

  state() {
    // return {
    //   creatures: this.creatures,
    //   food: this.food
    // }

    return this;
  }

  json() {
    // return JSON.stringify({
    //   data: this.generations
    // });

    return this.generations;
  }

  nextGen() {
    let avg = 0;

    this.creatures.forEach((creature) => avg += creature.genes.size);

    this.generations.push({
      gen: this.gen++,
      creatures: this.creatures,
      avg_size: avg/this.creatures.length
    });

    const oldCreatures = this.creatures;

    this.creatures = [];

    // breed
    for (let creature of oldCreatures) {
      for (let i = 0; i < creature.foodEaten; i++) {
        this.creatures.push(creature.birthChild());
      }
    }

    this.creatures.map((creature) => {
      creature.x = getRandomInt(this.width);
      creature.y = getRandomInt(this.height);
    });

    this.genFood(this.creatures.length);

    console.log(this.generations);

  }

  randomGen(n) {
    this.creatures = [];

    for (let i = 0; i < n; i++) {
      this.creatures.push(new Creature(getRandomInt(this.width),getRandomInt(this.height), {
        size: getRandomInt(50 - MIN_SIZE) + MIN_SIZE,
        speed: 1
      }))
    }

    this.genFood(n );
  }

  genFood(n) {
    this.food = [];

    for (let i = 0; i < n; i++) {
      this.food.push(new Food(getRandomInt(this.width),getRandomInt(this.height)));
    }
  }
}