import DiningHalls from "./diningHalls.js";
import DiningHours from "./diningHours.js";
import DiningStations from "./diningStations.js";
import ScheduleItems from "./scheduleItems.js";


// Set up associations
DiningHalls.associate({ DiningHours, DiningStations });
DiningHours.associate({ DiningHalls });
DiningStations.associate({ DiningHalls, ScheduleItems });
ScheduleItems.associate({ DiningStations });


export { DiningHalls, DiningHours, ScheduleItems, DiningStations };