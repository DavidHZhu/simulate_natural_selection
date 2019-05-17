export default class Creature {
  constructor(x, y, genes) {
    this.x = x;
    this.y = y;
    this.genes = genes;
  }

  draw(p5) {
    p5.ellipse(this.x, this.y, this.x + this.genes.size,this.y + this.ggienes.size);
  }
}