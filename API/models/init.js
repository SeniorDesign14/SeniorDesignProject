import DiningHalls from "./diningHalls.js";
import DiningHours from "./diningHours.js";
import DiningStations from "./diningStations.js";
import ScheduleItems from "./scheduleItems.js";
import FavoriteFoods from "./favoriteFoods.js";
import Users from "./users.js";
import Menu from "./menu.js";
import NutritionalInfo from "./nutritionalInfo.js";


// Set up associations
DiningHalls.associate({ DiningHours, DiningStations });
DiningHours.associate({ DiningHalls });
DiningStations.associate({ DiningHalls, ScheduleItems });
ScheduleItems.associate({ DiningStations });


export { DiningHalls, DiningHours, ScheduleItems, DiningStations, FavoriteFoods, Users, Menu, NutritionalInfo };