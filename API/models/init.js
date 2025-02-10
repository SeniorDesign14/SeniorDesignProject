import DiningHalls from "./diningHalls.js";
import DiningHours from "./diningHours.js";
import ScheduleItems from "./scheduleItems.js";


// Set up associations
DiningHalls.associate({ DiningHours });
DiningHours.associate({ DiningHalls });

export { DiningHalls, DiningHours, ScheduleItems };