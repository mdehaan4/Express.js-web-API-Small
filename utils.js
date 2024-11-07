const getRandomElement = arr => {
  if (!Array.isArray(arr)) throw new Error('Expected an array');
  if (arr.length === 0) return null; // Handle empty array
  return arr[Math.floor(Math.random() * arr.length)];
}

module.exports = {
  getRandomElement
};
