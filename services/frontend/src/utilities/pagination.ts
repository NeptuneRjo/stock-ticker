export const applyCountToArray = <Type,>(elements: Type[], count: number): Type[][] => {
    let countedArray = []

    for (let i = 0; i < elements.length; i += count) {
        countedArray.push(elements.slice(i, i+count))
    }

    return countedArray
  }