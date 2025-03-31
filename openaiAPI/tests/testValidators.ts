import { isValidDiningHall, isValidFoodItem, isValidDate } from "../src/utils/validators";

async function runTests() {
  console.log("---- Testing Dining Halls ----");
  console.log(await isValidDiningHall("McMahon")); // true
  console.log(await isValidDiningHall("WrongHall")); // false
  console.log(await isValidDiningHall("Northwest")); // true
  console.log(await isValidDiningHall("Tullow")); // false
  console.log(await isValidDiningHall("Towers")); // true


  console.log("\n---- Testing Food Items ----");
  console.log(await isValidFoodItem("Scrambled Eggs")); // true
  console.log(await isValidFoodItem("NonsenseFood")); // false
  console.log(await isValidFoodItem("pizza")); // true
  console.log(await isValidFoodItem("grits")); // true
  console.log(await isValidFoodItem("apapransa")); // false
  console.log(await isValidFoodItem("cheese pizza"));
  console.log(await isValidFoodItem("unicorn steak"));

  console.log("\n---- Testing Dates ----");
  console.log(isValidDate("2025-03-26")); // true
  console.log(isValidDate("26-03-2025")); // false
  console.log(isValidDate("tomorrow")); // false
}

runTests();