import DiningHalls from "./diningHalls.js";
import DiningHours from "./diningHours.js";
import DiningStations from "./diningStations.js";
import ScheduleItems from "./scheduleItems.js";
import FavoriteFoods from "./favoriteFoods.js";
import Users from "./users.js";
import Menu from "./menu.js";
import NutritionalInfo from "./nutritionalInfo.js";
import FoodImages from "./foodImages.js";


// Set up associations
DiningHalls.associate({ DiningHours, DiningStations, ScheduleItems });
DiningHours.associate({ DiningHalls });
DiningStations.associate({ DiningHalls, ScheduleItems });
ScheduleItems.associate({ DiningStations, DiningHalls });
Menu.associate({ FoodImages });


export { DiningHalls, DiningHours, ScheduleItems, DiningStations, FavoriteFoods, Users, Menu, NutritionalInfo, FoodImages };