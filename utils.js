const { BadRequestError } = require("./expressError");


/** Convert strNums like ["1","2","3"] to [1, 2, 3]. */

function convertStrNums(strNums) {
  // if the conversion isn't successful, throw a BadRequestError and will
  // be handled in your route

  // let nums = [];

  // for (let val of strNums) {
  //   let num = Number(val);
  //   if (!num) throw new BadRequestError(`${val} is not a number`);
  //   nums.push(num);
  // }

  // return nums;

  return strNums.map((val) => {
    let num = Number(val);
    if (!num) throw new BadRequestError(`${val} is not a number`);
    return num
  });
}


module.exports = { convertStrNums };