import {getDistance, getNearestDetails, getRandomInt} from "./Helpers/Helpers";
import {
  KINETIC_ENERGY,
  MUTATE_CHANCE,
  PREDATION,
  PREDATION_SIZE_MARKUP,
  PREDATION_SPEED_MARKUP, SHOW_GENE_LABEL, USE_KINETIC_ENERGY
} from "./Constants";

export default class Creature {
  constructor(x, y, genes) {
    this.x = x;
    this.y = y;
    this.foodEaten = 0;
    this.color = [255, 0, 0];
    this.dead = false;
    this.genes = genes;

    this.goingTowards = null;

    this.size = Math.sqrt(this.genes.size) * 10 + 5;

    /*** Convert genes to real numbers ***/
    // Calculate speed based on mass & kinetic energy equation
    if (USE_KINETIC_ENERGY) {
      const kinetic = genes.speed * KINETIC_ENERGY;
      this.speed = Math.sqrt((2 * kinetic) / (3.14 * Math.pow(this.size, 2))) + 0.5;
    } else {
      this.speed = genes.speed + 0.5;
    }

    this.distance_remaining = Math.sqrt(genes.distance) * 150;

    this.sense = this.genes.sense * 25 + this.size / 2; // divide by 2 if accurate
  }

  draw(p5) {
    if (this.dead) return;

    if (this.speed === 0) {
      this.color = [50, 50, 50];
    }

    p5.fill(p5.color(...this.color));

    p5.circle(this.x, this.y, this.size);

    p5.fill(p5.color(0, 0, 0, 0));
    p5.stroke(p5.color(128, 128, 128));
    p5.circle(this.x, this.y, this.sense * 2);

    if (SHOW_GENE_LABEL) {
      const fontSize = this.size / 2;
      p5.fill(p5.color(255, 255, 255));
      p5.textSize(fontSize);
      const width = p5.textWidth(this.genes.label);
      p5.text(this.genes.label, this.x - width / 2, this.y + fontSize / 2)
    }
    p5.stroke(p5.color(0, 0, 0));
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

    if (this.distance_remaining <= 0) this.speed = 0;
    this.state = state;

    if (this.state.food.length === 0) return;
    let nearestCreature;

    const aliveCreatures = this.state.creatures.filter((creature) => creature !== this && !creature.dead);
    if (PREDATION) nearestCreature = getNearestDetails(this, aliveCreatures, this.sense);

    const nearestFood = getNearestDetails(this, this.state.food, this.sense);

    if (nearestCreature && nearestCreature.ref.canEat(this) && nearestCreature.distance < this.size * 2) {
      // run away
      this.color = [0, 255, 0];
      this.runAwayFrom(nearestCreature.ref);
    } else if (nearestCreature && this.canEat(nearestCreature.ref) && this.shouldEat(nearestCreature.ref) &&
      (!nearestFood || nearestCreature.distance < nearestFood.distance)) {
      // chase
      this.color = [255, 0, 0];
      this.moveTowards(nearestCreature.ref);
    } else if (nearestFood) {
      // get food
      this.color = [128, 128, 255];
      this.moveTowards(nearestFood.ref);
    } else if (!this.goingTowards || getDistance(this, this.goingTowards) < this.size / 2) {
      // pick random position to go to
      this.color = [128, 128, 128];
      this.goingTowards = {
        x: getRandomInt(state.width),
        y: getRandomInt(state.height)
      }
    } else {
      // go towards random position
      this.color = [128, 128, 128];
      this.moveTowards(this.goingTowards)
    }

    const nearestFoodGlobal = getNearestDetails(this, this.state.food);
    if (this.touching(nearestFoodGlobal)) {
      // in range, eat food
      this.eat(nearestFoodGlobal.ref);
    }

    if (PREDATION && nearestCreature && this.canEat(nearestCreature.ref) && this.touching(nearestCreature)) {
      // in range, eat food
      this.eatCreature(nearestCreature.ref);
    }
  }

  touching(other) {
    if (!other.distance) {
      // throw Error("No distance: " + JSON.stringify(other));
      return false;
    }
    return other.distance < other.ref.size / 2 + this.size / 2
  }

  canEat(other) {
    return PREDATION && this.speed > 0 &&
      other.size * PREDATION_SIZE_MARKUP < this.size;
  }

  shouldEat(other) {
    return other.speed * PREDATION_SPEED_MARKUP < this.speed;
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
    // Calculate direction towards other
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