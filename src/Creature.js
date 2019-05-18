import { getNearestDetails } from "./Helpers";
import {MUTATE_CHANCE, KINETIC_ENERGY, RED, PREDATION, PREDATION_SIZE_MARKUP} from "./Constants";
import Genes from "./Genes";

export default class Creature {
  constructor(x, y, genes) {
    this.x = x;
    this.y = y;
    this.genes = genes;
    this.foodEaten = 0;

    this.size = Math.sqrt(this.genes.size) * 10 + 5;

    /*** Convert genes to real numbers ***/
    // Calculate speed based on mass & kinetic energy equation
    // const kinetic = this.genes.speed * KINETIC_ENERGY;
    // this.speed = Math.sqrt((2*kinetic)/(3.14 * Math.pow(this.size, 2))) + 0.5;

    this.speed = Math.sqrt(genes.speed) + 0.5;

    this.distance_remaining = genes.distance * 100;

    this.color = [255,0,0];

    this.dead = false;
  }

  draw(p5) {
    if (this.dead) return;

    if (this.speed === 0) {
      this.color = [50,50,50];
    }

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
    if (this.dead || this.speed === 0) return;

    this.distance_remaining -= this.speed;
    if (this.distance_remaining <= 0) {
      this.speed = 0;
    }
    this.state = state;


    if (this.state.food.length === 0) {
      return;
    }
    let nearestCreature;
    if (PREDATION) nearestCreature = getNearestDetails(this, this.state.creatures.filter((creature) => creature !== this && !creature.dead));
    const nearestFood = getNearestDetails(this, this.state.food);

    if (nearestCreature.ref.canEat(this) && nearestCreature.distance < nearestFood.distance) {
      this.color = [0, 255, 0];
      this.runAwayFrom(nearestCreature.ref);
    } else if (this.canEat(nearestCreature.ref) && nearestCreature.distance < nearestFood.distance) {
      this.color = [255,0,0];
      this.moveTowards(nearestCreature.ref);
    } else {
      this.color = [128, 128, 255];
      this.moveTowards(nearestFood.ref);
    }

    if (this.touching(nearestFood)) {
      // in range, eat food
      this.eat(nearestFood.ref);
    }

    if (this.canEat(nearestCreature.ref) && this.touching(nearestCreature)) {
      // in range, eat food
      this.eatCreature(nearestCreature.ref);
    }
  }

  touching(other) {
    if (!other.distance) {
      throw Error("No distance");
    }
    return other.distance < other.ref.size/2 + this.size/2
  }

  canEat(other) {
    return PREDATION && this.speed > 0 && other.size * PREDATION_SIZE_MARKUP < this.size && other.speed < this.speed;
  }

  eatCreature(creature) {
    this.foodEaten++;
    creature.dead = true;
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

    // Move towards
    this.x += toOtherX * this.speed;
    this.y += toOtherY * this.speed;
  }

  runAwayFrom(obj) {
    // Calculate direction towards food
    let toOtherX = obj.x - this.x;
    let toOtherY = obj.y - this.y;

    // Normalize
    const toPlayerLength = Math.hypot(toOtherX, toOtherY);
    toOtherX /= toPlayerLength;
    toOtherY /= toPlayerLength;

    // Run away
    this.x -= toOtherX * this.speed;
    this.y -= toOtherY * this.speed;
  }

  json() {
    return this;
  }
}