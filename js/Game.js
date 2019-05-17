import Creature from "./Creature";

export default class Game {
  constructor() {
    this.creatures = [];

    this.creatures.push(new Creature(50,50, {
      size: 30
    }))
  }
  draw() {
    this.creatures.forEach((creature) => creature.draw());
  }
}