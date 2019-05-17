import {getRandomFloat, getRandomInt} from "./Helpers";
import {SKILL_POINTS} from "./Constants";

export default class Genes {
  constructor(size, speed, distance) {
    this.size = size;
    this.speed = speed;
    this.distance = distance;
  };

  static randomGenes() {
    let genes = [0,0,0]; // one 0 for each gene

    // Generate random percentages
    for (let i = 0; i < genes.length; i++) {
      genes[i] = getRandomFloat(1);
    }

    let sum = 0;

    genes.forEach((gene) => sum += gene);
    genes = genes.map((gene) => (gene/sum) * SKILL_POINTS);

    return new Genes(...genes)
  }
}