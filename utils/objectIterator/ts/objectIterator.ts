export type TStep = { done: boolean, value: any };
export type TNext = () => TStep;
export type TIterator = { next: TNext };

function objectIterator(): TIterator {
  // get the properties of the object 
  const properties: string[] = Object.keys(this);
  let count: number = 0;
  // set to true when the loop is done 
  let isDone: boolean = false;

  // define the next method, need for iterator 
  const next: TNext = () => {
    // control on last property reach 
    if (count >= properties.length) {
      isDone = true;
    }
    
    const result = { done: isDone, value: this[properties[count]] };
    count += 1;

    return result;
  }

  // return the next method used to iterate 
  return { next };
};

export default objectIterator;
