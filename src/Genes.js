import {getRandomFloat, getRandomInt} from "./Helpers";
import {SKILL_POINTS, SMALL_MUTATIONS} from "./Constants";

export default class Genes {
  constructor(size, speed, distance, sense) {
    this.size = size;
    this.speed = speed;
    this.distance = distance;
    this.sense = sense
  };

  mutatedGenes() {
    if (SMALL_MUTATIONS) {
      let newGenes = [this.size, this.speed, this.distance, this.sense];

      const from = getRandomInt(newGenes.length);
      let to = from;
      while (to === from) {
        to = getRandomInt(newGenes.length);
      }

      let amount = 10;
      while (amount > newGenes[from]) {
        amount = getRandomFloat(SKILL_POINTS);
      }

      newGenes[from] -= amount;
      newGenes[to] += amount;

      return new Genes(...newGenes);
    } else {
      return Genes.randomGenes();
    }
  }

  static randomGenes() {
    let genes = [0,0,0,0]; // one 0 for each gene

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