const dict_to_array = (dict) => {
  let array = [];
  Object.keys(dict).forEach((name, index) => {
    let value = dict[name];
    if (value) {
      array.push({ text: value, value: name });
    }
  });
  return array;
}

export default dict_to_array;