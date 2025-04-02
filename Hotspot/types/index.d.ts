declare interface DiningHall {
    dininghallid: number;
    hallname: string;
    location: string;
    hours: Array<{
        dininghourid: number;
        dininghallid: number;
        dayofweek: string;
        mealperiod: string;
        hours: string;
    }>;
}

declare interface NutritionalInfo {
    foodid: number;
    food: string;
    servingspercontainer: number;
    servingsize: string;
    calories: number;
    totalfat: number;
    totalfatdv: number;
    saturatedfat: number;
    saturatedfatdv: number;
    transfat: number;
    cholesterol: number;
    cholesteroldv: number;
    sodium: number;
    sodiumdv: number;
    carbs: number;
    carbsdv: number;
    fiber: number;
    fiberdv: number;
    sugars: number;
    addedsugars: number;
    addedsugarsdv: number;
    protein: number;
    calcium: number;
    calciumdv: number;
    iron: number;
    irondv: number;
    vitamind: number;
    vitaminddv: number;
    potassium: number;
    potassiumdv: number;
}

declare interface Schedule {
    scheduleid: number,
    scheduledate: string,
    foodid: number,
    food: string,
    isbreakfast: boolean,
    islunch: boolean,
    isdinner: boolean,
    allergens: string,
    summary: null,
    imagelink: null,
    diningstationid: number,
    dininghallid: number,
    station: {
        diningstationid: number,
        dininghallid: number,
        stationname: string
    },
    hall: {
        dininghallid: number,
        hallname: string,
        location: string,
    },
    time: string
}
  
declare interface Food {
    foodid: number,
    food: string
}

declare interface FoodItem {
    foodid: number;
    food: string;
    isFavorited: boolean;
}