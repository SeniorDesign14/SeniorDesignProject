import scrapy

class MenudataSpider(scrapy.Spider):
    name = "menudata"
    allowed_domains = ["dining.uconn.edu","nutritionanalysis.dds.uconn.edu"] # dont go on dining. connection will be throttled after x connects
    start_urls = ["https://nutritionanalysis.dds.uconn.edu/shortmenu.aspx?sName=UCONN+Dining+Services&locationNum=03&locationName=Connecticut+Dining+Hall&naFlag=1"]

    # Initialize the spider to receive the 'mode' argument
    def __init__(self, mode=None, *args, **kwargs):
        super(MenudataSpider, self).__init__(*args, **kwargs)
        self.mode = int(mode)  # Store mode value as an attribute

    def parse(self, response):
        '''Goes to each dining hall "page" to get menus'''

        dining_hall_menu_links = ['https://nutritionanalysis.dds.uconn.edu/shortmenu.aspx?sName=UCONN+Dining+Services&locationNum=03&locationName=Connecticut+Dining+Hall&naFlag=1',
                'https://nutritionanalysis.dds.uconn.edu/shortmenu.aspx?sName=UCONN+Dining+Services&locationNum=07&locationName=North+Campus+Dining+Hall&naFlag=1',
                'https://nutritionanalysis.dds.uconn.edu/shortmenu.aspx?sName=UCONN+Dining+Services&locationNum=06&locationName=Putnam+Dining+Hall&naFlag=1',
                'https://nutritionanalysis.dds.uconn.edu/shortmenu.aspx?sName=UCONN+Dining+Services&locationNum=42&locationName=Gelfenbien+Commons,%20Halal+%26+Kosher&naFlag=1',                
                'https://nutritionanalysis.dds.uconn.edu/shortmenu.aspx?sName=UCONN+Dining+Services&locationNum=15&locationName=Northwest+Marketplace&naFlag=1',
                'https://nutritionanalysis.dds.uconn.edu/shortmenu.aspx?sName=UCONN+Dining+Services&locationNum=01&locationName=Whitney+Dining+Hall&naFlag=1',
                'https://nutritionanalysis.dds.uconn.edu/shortmenu.aspx?sName=UCONN+Dining+Services&locationNum=05&locationName=McMahon+Dining+Hall&naFlag=1',
                'https://nutritionanalysis.dds.uconn.edu/shortmenu.aspx?sName=UCONN+Dining+Services&locationNum=16&locationName=South+Campus+Marketplace&naFlag=1'
                ]
        
        # Iterate through list and yield each link
        for i in dining_hall_menu_links:
            yield response.follow(i,callback=self.parse_dining_hall)

        # yield response.follow(dining_hall_menu_links[2],callback=self.parse_dining_hall)


    def parse_dining_hall(self,response):
        '''For dining hall X, get the menu links and go to each menu'''

        dates = response.css('span.dateselections a::text').getall() # List with date for each menu. Example dates: Friday Nov 9, Saturday Nov 10, Sunday Nov 11
        menu_links = response.css('span.dateselections a::attr(href)').getall() # List with links for each menu.
    
        base_url = 'https://nutritionanalysis.dds.uconn.edu/'

        # TODO make the below stuff a different mode to get only one day worth of menu
        # complete_url = f"{base_url}{menu_links[-1]}"

        # yield response.follow(complete_url,callback=self.parse_menu)

        for link in menu_links:
            complete_url = f"{base_url}{link}" # Base url + menu link
            yield response.follow(complete_url,callback=self.parse_menu)


    def parse_menu(self,response):
        '''Gets every item from the menu. Output results to csv file'''

        meal_times = response.css('div.shortmenumeals::text').getall() # list of meal times. Example: Lunch and Dinner
        menus = response.xpath('//table[@border="0" and @width="100%" and @height="100%" and @cellpadding="0" and @cellspacing="0"]') # THIS MIGHT BE CORRECT FOR MENUS
        base_url = 'https://nutritionanalysis.dds.uconn.edu/'

        # If it is a weekday menu (breakfast,lunch,dinner)
        if len(meal_times) == 3:
            # Get the text from html for each menu
            breakfast_menu = menus[0].css('span::text').getall()
            lunch_menu = menus[1].css('span::text').getall()
            dinner_menu = menus[2].css('span::text').getall()

            # Remove any spaces in lists
            clean_breakfast_menu = [item.strip() for item in breakfast_menu if item.strip()]
            clean_lunch_menu = [item.strip() for item in lunch_menu if item.strip()]
            clean_dinner_menu = [item.strip() for item in dinner_menu if item.strip()]

            # Format Allergens to insert in csv. Replace the "," in each item with "|". Example "Allergens: Milk, Eggs" -> "Allergens: Milk| Eggs"
            clean_breakfast_menu = [item.replace(',', '|') if ',' in item else item for item in clean_breakfast_menu]
            clean_lunch_menu = [item.replace(',', '|') if ',' in item else item for item in clean_lunch_menu]
            clean_dinner_menu = [item.replace(',', '|') if ',' in item else item for item in clean_dinner_menu]

            # Nutrition info links
            breakfast_nutrition_info_link = menus[0].css('a::attr(href)').get()
            lunch_nutrition_info_link = menus[1].css('a::attr(href)').get()
            dinner_nutrition_info_link = menus[2].css('a::attr(href)').get()

            # Dining hall name
            dining_hall = response.css('div.headlocation::text').get()

            # Menu Date
            menu_date = response.css('div.shortmenutitle::text').get().replace("Menus for", "").strip()

            item = {    
                'Dining Hall': dining_hall,
                'Menu Date': menu_date,
                'Breakfast': clean_breakfast_menu,
                'Lunch': clean_lunch_menu,
                'Dinner': clean_dinner_menu
            }
            
            if self.mode == 0: # yeild menu info
                yield item
            if self.mode == 1:  # yeild nutrition info
                yield response.follow(f"{base_url}{breakfast_nutrition_info_link}",callback=self.parse_nutrition_links)
                yield response.follow(f"{base_url}{lunch_nutrition_info_link}",callback=self.parse_nutrition_links)
                yield response.follow(f"{base_url}{dinner_nutrition_info_link}",callback=self.parse_nutrition_links)

        # If weekend menu
        elif len(meal_times) == 2:

            # Check if it is weekend menu (Lunch and Dinner)
            if meal_times[0] == 'Lunch' and meal_times[1] == 'Dinner':
                # Get the text from html for each menu
                lunch_menu = menus[0].css('span::text').getall()
                dinner_menu = menus[1].css('span::text').getall()

                # Clean lists for any spaces
                clean_lunch_menu = [item.strip() for item in lunch_menu if item.strip()]
                clean_dinner_menu = [item.strip() for item in dinner_menu if item.strip()]

                # Format Allergens to insert in csv. Replace the "," in each item with "|". Example "Allergens: Milk, Eggs" -> "Allergens: Milk| Eggs"
                clean_lunch_menu = [item.replace(',', '|') if ',' in item else item for item in clean_lunch_menu]
                clean_dinner_menu = [item.replace(',', '|') if ',' in item else item for item in clean_dinner_menu]
                
                # Nutrition info links
                lunch_nutrition_info_link = menus[0].css('a::attr(href)').get()
                dinner_nutrition_info_link = menus[1].css('a::attr(href)').get()

                # Dining hall name
                dining_hall = response.css('div.headlocation::text').get()

                # Date that menus are for
                menu_date = response.css('div.shortmenutitle::text').get().replace("Menus for", "").strip()

                item = {    
                    'Dining Hall': dining_hall,
                    'Menu Date': menu_date,
                    'Breakfast': None,
                    'Lunch': clean_lunch_menu,
                    'Dinner': clean_dinner_menu
                }
                
                if self.mode == 0:
                    yield item
                if self.mode == 1:
                    yield response.follow(f"{base_url}{lunch_nutrition_info_link}",callback=self.parse_nutrition_links)
                    yield response.follow(f"{base_url}{dinner_nutrition_info_link}",callback=self.parse_nutrition_links)

            # Check if it is edge case menu (Breakfast and Lunch)
            elif meal_times[0] == 'Breakfast' and meal_times[1] == 'Lunch':
                # Get the text from html for each menu
                breakfast_menu = menus[0].css('span::text').getall()
                lunch_menu = menus[1].css('span::text').getall()

                # Clean lists for any spaces
                clean_breakfast_menu = [item.strip() for item in breakfast_menu if item.strip()]
                clean_lunch_menu = [item.strip() for item in lunch_menu if item.strip()]

                # Format Allergens to insert in csv. Replace the "," in each item with "|". Example "Allergens: Milk, Eggs" -> "Allergens: Milk| Eggs"
                clean_breakfast_menu = [item.replace(',', '|') if ',' in item else item for item in clean_breakfast_menu]
                clean_lunch_menu = [item.replace(',', '|') if ',' in item else item for item in clean_lunch_menu]
                
                # Nutrition info links
                breakfast_nutrition_info_link = menus[0].css('a::attr(href)').get()
                lunch_nutrition_info_link = menus[1].css('a::attr(href)').get()

                # Dining hall name
                dining_hall = response.css('div.headlocation::text').get()

                # Date that menus are for
                menu_date = response.css('div.shortmenutitle::text').get().replace("Menus for", "").strip()

                item = {    
                    'Dining Hall': dining_hall,
                    'Menu Date': menu_date,
                    'Breakfast': clean_breakfast_menu,
                    'Lunch': clean_lunch_menu,
                    'Dinner': None
                }
                
                if self.mode == 0:
                    yield item
                if self.mode == 1:
                    yield response.follow(f"{base_url}{breakfast_nutrition_info_link}",callback=self.parse_nutrition_links)
                    yield response.follow(f"{base_url}{lunch_nutrition_info_link}",callback=self.parse_nutrition_links)

        # If menu is empty
        elif len(meal_times) == 0:
            dining_hall = response.css('div.headlocation::text').get()
            menu_date = response.css('div.shortmenutitle::text').get().replace("Menus for", "").strip()

            item = {    
                    'Dining Hall': dining_hall,
                    'Menu Date': menu_date,
                    'Breakfast': None,
                    'Lunch': None,
                    'Dinner': None
                }
            
            if self.mode == 0:
                yield item


    # Get nution information for each item
    def parse_nutrition_links(self,response):
        '''Get nutrition info links from the menu and go to each link'''

        # links for each items nutrion information
        nutrition_links = response.css('div.longmenucoldispname a::attr(href)').getall()

        base_url = 'https://nutritionanalysis.dds.uconn.edu/'
        # complete_url = f"{base_url}{nutrtion_links[1]}"
        # yield response.follow(complete_url,callback=self.parse_nutrition_information)

        for link in nutrition_links:
            complete_url = f"{base_url}{link}"
            yield response.follow(complete_url,callback=self.parse_nutrition_information)
            


    def parse_nutrition_information(self,response):
        '''Get nutrition info for each item. Output results to csv file'''

        # Some items(Manager's Choice) has no nutrition information. skip item if index error. 
        try:
            # Food name
            item_name = response.css('div.labelrecipe::text').get()

            # Get unbolded text 
            unbolded_text = response.css('span.nutfactstopnutrient::text').getall()

            # Get bolded text  
            bolded_text = response.css('span.nutfactstopnutrient b::text').getall()

            # Get servings per X
            servings = response.css('div.nutfactsservpercont::text').get()

            # Get serving size
            serving_size = response.css('div.nutfactsservsize::text').getall()

            # Get cals per serving
            cals_per_serving = response.css('td.nutfactscaloriesval::text').get()

            Total_Fat = f"{unbolded_text[0].strip()} {bolded_text[1].strip()}"
            Total_Carb = f"{unbolded_text[1].strip()} {bolded_text[3].strip()}"
            Sat_Fat = f"{unbolded_text[2].strip()} {bolded_text[4].strip()}"
            Dietary_Fiber = f"{unbolded_text[3].strip()} {bolded_text[5].strip()}"
            Trans_Fat = f"Trans {unbolded_text[5].strip()}"
            Total_Sugar = f"{unbolded_text[6].strip()}"
            Cholesterol = f"{unbolded_text[7].strip()} {bolded_text[9].strip()}" 
            Added_Sugars = f"{unbolded_text[8].strip()} {bolded_text[10].strip()}"
            Sodium = f"{unbolded_text[9].strip()} {bolded_text[12].strip()}"
            Protein = f"{unbolded_text[10].strip()}"

            Calcium = f"{unbolded_text[11].strip()} {unbolded_text[12].strip()}"
            Iron = f"{unbolded_text[13].strip()} {unbolded_text[14].strip()}"
            Vitamin_D = f"{unbolded_text[15].strip()} {unbolded_text[16].strip()}"
            Potassium = f"{unbolded_text[17].strip()} {unbolded_text[18].strip()}"

            # Total_Fat = f"{bolded_text[0].strip()} {unbolded_text[0].strip()} {bolded_text[1].strip()}"
            # Total_Carb = f"{bolded_text[2].strip()} {unbolded_text[1].strip()} {bolded_text[3].strip()}"
            # Sat_Fat = f"{unbolded_text[2].strip()} {bolded_text[4].strip()}"
            # Dietary_Fiber = f"{unbolded_text[3].strip()} {bolded_text[5].strip()}"
            # Trans_Fat = f"Trans {unbolded_text[5].strip()}"
            # Total_Sugar = f"{unbolded_text[6].strip()}"
            # Cholesterol = f"{bolded_text[8].strip()} {unbolded_text[7].strip()} {bolded_text[9].strip()}" 
            # Added_Sugars = f"{unbolded_text[8].strip()} {bolded_text[10].strip()}"
            # Sodium = f"{bolded_text[11].strip()} {unbolded_text[9].strip()} {bolded_text[12].strip()}"
            # Protein = f"{bolded_text[13].strip()} {unbolded_text[10].strip()}"

            # Calcium = f"{unbolded_text[11].strip()} {unbolded_text[12].strip()}"
            # Iron = f"{unbolded_text[13].strip()} {unbolded_text[14].strip()}"
            # Vitamin_D = f"{unbolded_text[15].strip()} {unbolded_text[16].strip()}"
            # Potassium = f"{unbolded_text[17].strip()} {unbolded_text[18].strip()}"
            
            item1= {
                'Item Name': item_name,
                'Servings per': servings,
                'Serving Size': serving_size,
                'Calories per serving': cals_per_serving,
                'Total Fat':Total_Fat,
                'Total Carbohydrate':Total_Carb,
                'Saturated Fat':Sat_Fat,
                'Dietary Fiber':Dietary_Fiber,
                'Trans Fat':Trans_Fat,
                'Total Sugar':Total_Sugar,
                'Cholesterol':Cholesterol,
                'Added Sugars':Added_Sugars,
                'Sodium':Sodium,
                'Protein':Protein,
                'Calcium':Calcium,
                'Iron': Iron,
                'Vitamin D': Vitamin_D,
                'Potassium': Potassium
            }
            yield item1  # TODO remove dups from csv
        except:
            pass
    

            


