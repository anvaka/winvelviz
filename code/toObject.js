function toObject(arrayOfKeyValues) {
  return arrayOfKeyValues.reduce((prev, current) => {
    prev[current.key] = current.value;
    return prev;
  }, {});
}
exports.toObject = toObject;
