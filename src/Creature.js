import { getNearestDetails } from "./Helpers";
import {MUTATE_CHANCE, KINETIC_ENERGY, RED, PREDATION} from "./Constants";
import Genes from "./Genes";

export default class Creature {
  constructor(x, y, genes) {
    this.x = x;
    this.y = y;
    this.genes = genes;
    this.foodEaten = 0;

    this.size = this.genes.size * 10 + 5;

    // Calculate speed based on mass & kinetic energy equation
    // this.speed = Math.sqrt((2*KINETIC_ENERGY)/(3.14 * Math.pow(this.size, 2)));
    this.speed = genes.speed + 0.5;

    this.distance_remaining = genes.distance * 100;

    this.color = [255,0,0];
  }

  draw(p5) {
    p5.fill(p5.color(...this.color));
    p5.circle(this.x, this.y, this.size);
  }

  birthChild() {
    let childGenes = this.genes;

    if (Math.random() < MUTATE_CHANCE) {
      childGenes = childGenes.mutatedGenes();
    }

    return new Creature(this.x, this.y, childGenes);
  }

  tick(state) {
    this.distance_remaining -= this.speed;
    if (this.distance_remaining <= 0) {
      this.speed = 0;
    }
    this.state = state;


    if (this.state.food.length === 0) {
      return;
    }
    let nearestCreature;
    if (PREDATION) nearestCreature = getNearestDetails(this, this.state.creatures.filter((creature) => creature !== this));
    const nearestFood = getNearestDetails(this, this.state.food);

    if (PREDATION && nearestCreature.ref.size < this.size && nearestCreature.distance < nearestFood.distance) {
      this.color = [255,0,0];
      this.moveTowards(nearestCreature.ref);
    } else {
      this.color = [128, 128, 255];
      this.moveTowards(nearestFood.ref);
    }

    if (nearestFood.distance < nearestFood.ref.size/2 + this.size/2) {
      // in range, eat food
      this.eat(nearestFood.ref);
    }

    if (nearestCreature.distance < nearestCreature.ref.size/2 + this.size/2) {
      // in range, eat food
      this.eatCreature(nearestCreature.ref);
    }
  }

  eatCreature(creature) {
    this.foodEaten++;
    this.state.creatures = this.state.creatures.filter((ref) => ref !== creature);
  }

  eat(food) {
    // remove from arr
    this.state.food = this.state.food.filter((ref) => ref !== food);

    this.foodEaten++;
  }

  moveTowards(obj) {
    // Calculate direction towards food
    let toOtherX = obj.x - this.x;
    let toOtherY = obj.y - this.y;

    // Normalize
    const toPlayerLength = Math.hypot(toOtherX, toOtherY);
    toOtherX /= toPlayerLength;
    toOtherY /= toPlayerLength;

    // Move towards the player
    this.x += toOtherX * this.speed;
    this.y += toOtherY * this.speed;
  }

  json() {
    return this;
  }
}