// function greedyPartitioning(array, numberOfSubsets) {
//   const sorted = array.sort((a, b) => b - a); // sort descending

//   const out = [...Array(numberOfSubsets)].map((x) => {
//     return {
//       sum: 0,
//       elements: [],
//     };
//   });

//   for (const elem of sorted) {
//     const chosenSubset = out.sort((a, b) => a.sum - b.sum)[0];
//     chosenSubset.elements.push(elem);
//     chosenSubset.sum += elem;
//   }

//   return out.map((subset) => subset.elements);
// }
