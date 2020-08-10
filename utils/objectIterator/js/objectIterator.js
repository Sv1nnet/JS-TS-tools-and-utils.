function objectIterator() {
  // get the properties of the object 
  const properties = Object.keys(this);
  let count = 0;
  // set to true when the loop is done 
  let isDone = false;

  // define the next method, need for iterator 
  const next = () => {
    // control on last property reach 
    if (count >= properties.length) {
      isDone = true;
    }

    const result = { done: isDone, value: this[properties[count]] };
    count += 1;

    return result;
  };

  // return the next method used to iterate 
  return { next };
}

export default objectIterator;
