from scrapy.crawler import CrawlerRunner
from scrapy.utils.project import get_project_settings
from scraper.scraper.spiders.menudata import MenudataSpider
from twisted.internet import reactor
import time
import data_sorter

def run_spider(file_name, mode):
    # Set up the crawler runner
    runner = CrawlerRunner(settings={
        'LOG_LEVEL': 'INFO',
        'LOG_STDOUT':True,
        'ROBOTSTXT_OBEY': False,
        'FEEDS': {
            file_name: {  # Output file
                'format': 'csv',  # Export format
                'overwrite': True,  # Overwrite the file if it exists
            }
        },
    })
    
    # Return the deferred for the crawl
    return runner.crawl(MenudataSpider, mode=mode)

def run_multiple_crawls():
    d1 = run_spider('menuinfo.csv', mode=0)
    
    # When the first crawl finishes, run the second crawl
    d1.addCallback(lambda _: run_spider('nutritioninfo.csv', mode=1))
    
    # Stop the reactor when both crawls are finished
    d1.addCallback(lambda _: reactor.stop())

# Start the first crawl
start = time.time()
run_multiple_crawls()

# Start the Twisted event loop (blocks until both crawls finish)
reactor.run()

# Call functions to clean data
data_sorter.parse_menu_data()
data_sorter.parse_nutrition_info()
end = time.time()
print(end-start)
