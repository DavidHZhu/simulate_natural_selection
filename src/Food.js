import {FOOD_SIZE} from "./Constants";

export default class Food {
  constructor(x, y) {
    this.x = x;
    this.y = y;

    this.size = FOOD_SIZE;
  }

  draw(p5) {
    p5.rect(this.x - this.size/2, this.y - this.size/2, this.size, this.size);
  }
}