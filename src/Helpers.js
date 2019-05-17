export function getNearestDetails(target, others) {
  const distances = [...others].map((other) => {
    return {
      distance: Math.hypot(other.x - target.x, other.y - target.y),
      ref: other
    }
  });

  let min = distances[0], max = distances[0];

  for (let i = 1, len=distances.length; i < len; i++) {
    let v = distances[i];
    min = (v.distance < min.distance) ? v : min;
    max = (v.distance > max.distance) ? v : max;
  }

  return min;
}

export function getNearest(target, others) {
  return getNearestDetails(target, others).ref;
}

export function getRandomInt(max) {
  // not including max
  return Math.floor(Math.random() * Math.floor(max));
}

export function getRandomFloat(max) {
  // not including max
  return Math.random() * max;
}