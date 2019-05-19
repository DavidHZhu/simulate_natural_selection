export function getNearestDetails(target, others, max_distance) {
  let distances = [...others].map((other) => {
    return {
      distance: getDistance(target, other),
      ref: other
    }
  });

  if (max_distance) {
    distances = distances.filter((other) => other.distance <= max_distance);
  }

  if (distances.length === 0) {
    return null;
  }

  let min = distances[0], max = distances[0];

  for (let i = 1, len=distances.length; i < len; i++) {
    let v = distances[i];
    min = (v.distance < min.distance) ? v : min;
    max = (v.distance > max.distance) ? v : max;
  }

  return min;
}

export function getDistance(obj1, obj2) {
  return Math.hypot(obj2.x - obj1.x, obj2.y - obj1.y);
}

export function getNearest(target, others, max_distance) {
  return getNearestDetails(target, others, max_distance).ref;
}

export function getRandomInt(max) {
  // not including max
  return Math.floor(Math.random() * Math.floor(max));
}

export function getRandomFloat(max) {
  // not including max
  return Math.random() * max;
}

export function round(n, precision) {
  return n.toFixed(precision);
}