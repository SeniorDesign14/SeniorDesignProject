import pandas as pd
import csv
import re

def parse_menu_data():
    '''Clean menu data'''
    df = pd.read_csv('menuinfo.csv')

    file = open('clean_menu.csv','w',newline='')
    writer = csv.writer(file)
    writer.writerow(['Breakfast','Lunch','Dinner','Item Name','Dining Hall','Menu Date','Station','Allergens'])

    for index, row in df.iterrows():
        # if index == 1:
        item_data = []
        dining_hall = row['Dining Hall']
        date = row['Menu Date']

        item_data.append(row['Breakfast'])
        item_data.append(row['Lunch'])
        item_data.append(row['Dinner'])

        # Iterate through menus
        for menu_index,menu in enumerate(item_data):
            # Check if menu is empty(nan). Some weekend menus dont serve breakfast.
            if pd.isna(menu):
                continue
            else:  # [[],[],[]]
                # Check which menu (breakfast,lunch dinner) it is. Use index to mark which menu, item is on.
                if menu_index == 0:
                    breakfast_index = 1
                    lunch_index = 0
                    dinner_index = 0
                elif menu_index == 1:
                    breakfast_index = 0
                    lunch_index = 1
                    dinner_index = 0
                elif menu_index == 2:
                    breakfast_index = 0
                    lunch_index = 0
                    dinner_index = 1

                menu_data = menu.split(',')
                clean_menu = [item.replace('|', ',') for item in menu_data]

                for index1, item in enumerate(clean_menu):  # Iterate through each item in menu
                    # Seperates items by station and pairs them with their allergens
                    if item.startswith('--') and item.endswith('--'):
                        curr_sec = item.strip('-').strip()  # Remove '-' and white space

                    elif curr_sec: 
                        # Edge case for only two items on menu
                        if index1+1 == len(clean_menu):
                            continue

                        # If food has allergen
                        if "Allergens" not in item and "Allergens" in clean_menu[index1+1]:
                            item_allergens = clean_menu[index1+1].replace("Allergens:", "")
                            writer.writerow([breakfast_index,lunch_index,dinner_index,item,dining_hall,date,curr_sec,item_allergens])
                

                        # If food doesnt have allergen
                        if "Allergens" not in item and "Allergens" not in clean_menu[index1+1]:
                            writer.writerow([breakfast_index,lunch_index,dinner_index,item,dining_hall,date,curr_sec])
        
def parse_nutrition_info():
    '''Clean nutrition info'''
    df = pd.read_csv('nutritioninfo.csv')
    file = open('clean_nutrition.csv','w',newline='')
    writer = csv.writer(file)
    writer.writerow(['Item Name','Servings per','Serving Size','Calories','Total Fat','Total FatDV','Saturated Fat', 'Saturated_FatDV'
                     ,'Trans Fat','Cholesterol','CholesterolDV','Sodium','SodiumDV','Carbs','CarbsDV','Fiber','FiberDV','Sugars',
                     'Added Sugars','Added SugarsDV','Protein','Calcium','CalciumDV','Iron','IronDV','VitaminD','VitaminDDV'
                     ,'Potassium','PotassiumDV'])

    df_clean = df.drop_duplicates(subset=['Item Name'],keep='first') # Remove duplicate items 
        
    for index, row in df_clean.iterrows():
        # if index == 0:

            n_servings = re.search(r'\d+',row['Servings per'])[0] # get num of servings per dish

            serving_size = row['Serving Size'].split(',',1)[1]

            Total_Fat = re.findall(r"\d+\.?\d*", row['Total Fat']) 

            Total_Carb = re.findall(r"\d+\.?\d*", row['Total Carbohydrate']) 

            Saturated_Fat = re.findall(r"\d+\.?\d*", row['Saturated Fat'])

            Dietary_Fiber = re.findall(r"\d+\.?\d*", row['Dietary Fiber'])

            if '-'  in row['Trans Fat']:
                Trans_Fat = 0
            else: 
                Trans_Fat = re.findall(r"\d+\.?\d*", row['Trans Fat'])[0]
        
            Total_Sugars = re.findall(r"\d+\.?\d*", row['Total Sugar'])[0]
            Cholesterol = re.findall(r"\d+\.?\d*", row['Cholesterol'])
            Added_Sugars = re.findall(r"\d+\.?\d*", row['Added Sugars'])
            Sodium = re.findall(r"\d+\.?\d*", row['Sodium'])
            Protein = re.findall(r"\d+\.?\d*", row['Protein'])[0]

            # Check if num in string
            if bool(re.search(r"\d", row['Calcium'])) == False:
                Calcium = [0,0]
            else:
                Calcium = re.findall(r"\d+\.?\d*", row['Calcium'])

            Iron = re.findall(r"\d+\.?\d*", row['Iron'])

            # Check if num in string
            if bool(re.search(r"\d", row['Vitamin D'])) == False:
                Vitamin_D = [0,0]
            else:
                Vitamin_D = re.findall(r"\d+\.?\d*", row['Vitamin D'])

             # Check if num in string
            if bool(re.search(r"\d", row['Potassium'])) == False:
                Potassium = [0,0]
            else:
                Potassium = re.findall(r"\d+\.?\d*", row['Potassium'])           

            writer.writerow([row['Item Name'],int(n_servings),str(serving_size),int(row['Calories per serving']),float(Total_Fat[0]),int(Total_Fat[1]),float(Saturated_Fat[0]),int(Saturated_Fat[1])
                     ,float(Trans_Fat),float(Cholesterol[0]),int(Cholesterol[1]),float(Sodium[0]),int(Sodium[1]),float(Total_Carb[0]),int(Total_Carb[1]),float(Dietary_Fiber[0]),int(Dietary_Fiber[1]),float(Total_Sugars),
                     float(Added_Sugars[0]),int(Added_Sugars[1]),float(Protein),float(Calcium[0]),int(Calcium[1]),float(Iron[0]),int(Iron[1]),float(Vitamin_D[0]),int(Vitamin_D[1])
                     ,float(Potassium[0]),int(Potassium[1])])

        
if __name__ == '__main__':
    parse_menu_data()
    parse_nutrition_info()
