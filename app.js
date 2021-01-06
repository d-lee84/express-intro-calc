/** Simple demo Express app. */

const express = require("express");
const fsP = require("fs/promises");
const app = express();

// useful error class to throw
const { NotFoundError, BadRequestError } = require("./expressError");

const { convertStrNums } = require("./utils");
const {
  findMean,
  findMedian,
  findMode,
} = require("./stats");

const MISSING = "Expected key `nums` with comma-separated list of numbers.";


/** Finds mean of nums in qs: returns {operation: "mean", result } */
app.get("/mean", function (req, res, next) {
  if (!req.query.nums) throw new BadRequestError(MISSING);
  
  let numStrArr = req.query.nums.split(",");
  let numsArr = convertStrNums(numStrArr);

  let mean = findMean(numsArr);
  
  let content = {
    response: {
      operation: "mean",
      value: mean,
    }
  };

  if (req.query.save === "true") {
    writeToFile(JSON.stringify(content));
  }
  
  return res.json(content);

});

/* Takes string content and writes it to results.json file */
async function writeToFile(content) {
  try {
    await fsP.writeFile("./results.json", content, "utf8");
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
  
  console.log("Successfully wrote file");
}

/** Finds median of nums in qs: returns {operation: "median", result } */
app.get("/median", function (req, res, next) {
  if (!req.query.nums) throw new BadRequestError(MISSING);

  let numStrArr = req.query.nums.split(",");
  let numsArr = convertStrNums(numStrArr);

  let median = findMedian(numsArr);
  
  return res.json({
    response: {
      operation: "median",
      value: median,
    }
  });

});

/** Finds mode of nums in qs: returns {operation: "mean", result } */
app.get("/mode", function (req, res, next) {
  if (!req.query.nums) throw new BadRequestError(MISSING);

  let numStrArr = req.query.nums.split(",");
  let numsArr = convertStrNums(numStrArr);

  let mode = findMode(numsArr);
  
  return res.json({
    response: {
      operation: "mode",
      value: mode,
    }
  });

});

/** Finds mean, median, and mode of nums in qs: returns {operation: "mean", "median", "mode", result } */
app.get("/all", function (req, res, next) {
  if (!req.query.nums) throw new BadRequestError(MISSING);

  let numStrArr = req.query.nums.split(",");
  let numsArr = convertStrNums(numStrArr);

  let mean = findMean(numsArr);
  let median = findMedian(numsArr);
  let mode = findMode(numsArr);
  
  return res.json({
    response: {
      operation: "all",
      mean: mean,
      median: median,
      mode: mode,
    }
  });

});

/** 404 handler: matches unmatched routes; raises NotFoundError. */
app.use(function (req, res, next) {
  return next(new NotFoundError());
});

/** Error handler: logs stacktrace and returns JSON error message. */
app.use(function (err, req, res, next) {
  const status = err.status || 500;
  const message = err.message;
  if (process.env.NODE_ENV !== "test") console.error(status, err.stack);
  return res.status(status).json({ error: { message, status } });
});



module.exports = app;