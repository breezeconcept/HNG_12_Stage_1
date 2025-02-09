const express = require("express");
const axios = require("axios");
const cors = require("cors");

const app = express();
app.use(cors());

// Function to check if a number is prime
const isPrime = (num) => {
  if (num < 2) return false;
  for (let i = 2; i * i <= num; i++) {
    if (num % i === 0) return false;
  }
  return true;
};

// Function to check if a number is an Armstrong number
const isArmstrong = (num) => {
  let sum = 0;
  const digits = num.toString().split("").map(Number);
  const power = digits.length;
  for (let digit of digits) {
    sum += Math.pow(digit, power);
  }
  return sum === num;
};

// Function to check if a number is a perfect number
const isPerfect = (num) => {
  let sum = 1;
  for (let i = 2; i * i <= num; i++) {
    if (num % i === 0) {
      sum += i;
      if (i !== num / i) sum += num / i;
    }
  }
  return sum === num && num !== 1;
};

// Function to calculate the sum of digits
const getDigitSum = (num) => {
  return num.toString().split("").reduce((sum, digit) => sum + parseInt(digit), 0);
};

// API endpoint
app.get("/api/classify-number", async (req, res) => {
  const { number } = req.query;

  // Validate input
  if (!number || isNaN(number)) {
    return res.status(400).json({ number, error: true });
  }

  const num = parseInt(number);
  const properties = [];
  
  if (isArmstrong(num)) properties.push("armstrong");
  properties.push(num % 2 === 0 ? "even" : "odd");

  try {
    // Fetch fun fact from Numbers API
    const funFactResponse = await axios.get(`http://numbersapi.com/${num}/math?json`);
    const funFact = funFactResponse.data.text;

    res.json({
      number: num,
      is_prime: isPrime(num),
      is_perfect: isPerfect(num),
      properties,
      digit_sum: getDigitSum(num),
      fun_fact: funFact,
    });
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch fun fact." });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
