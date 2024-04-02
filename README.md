<h1>Abstract</h1>
	The project described in this document is a parallel web crawler capable of scrapping multiple URLs at once. Technologies used in this project are Node.js, Puppeteer, Redis, RabbitMQ and MongoDB. For distributing the workload, Puppeteer Cluster was used alongside with storing technologies like MongoDB and Redis for caching.
The project is available at: https://github.com/LucaPetrescu/web-crawler-v3.
Setting up the project
Assuming that prior software tools (Node.js and Git) are installed on yout system, for setting up the project, the GitHub repository will need to be cloned on the local machine. 
```git clone https://github.com/LucaPetrescu/web-crawler-v3.git```
After that, you will need to install the dependencies:
npm install
Before running the app, the application also has a Redis server configured for caching. So first of all, you will need to setup Redis on your machine. Check the Redis docs here. For a better visualization of your Redis database, you can also install RedisInsight, a graphical UI for visualizing all the Redis databases.
If you are using a Linux machine, open a terminal window and start the Redis server:
redis-server
If you are using a Windows machine, then you will need to setup a WSL environment. Once you have it, run the above command.
In case you want to have a better view of you redis database, install the RedisInsight client.
The crawler stores the data inside a local MongoDB database. First, you will need to install MongoDB on your local machine. Check the MongoDB documentation here. If you do not want to setup a cluster for MongoDB and want a straighforward setup and usage, then you will need to install MongoDB Compass. The connection is already handle in the code of the applicaition. The only things needed are to create a local database with the name Locations and a colleciton with the name locations.
The application also uses RabbitMQ as one of the methods for distributing the workload of the crawler. So you will also need to setup RabbitMQ on your local machine.

Before installing RabbitMQ, make sure you have Erlang installed on your computer. You can donwload and install Erlang from here. After installing Erlang, you can download the Windows installer for RabbitMQ here. 
To start the RabbitMQ server, you will need to navigate to the sbin directory of the RabbitMQ installation folder. From there, you will need to open a terminal and type in the following:
rabbitmq-plugins enable rabbitmq_management
	The RabbitMQ server is now available at http://localhost:15672/ with credentials guest:guest.
	To this point, the project is setted up. Now, to run the crawler, you will need to run the script with node cluster.js by changing the directory to /cluster. However, this will run the crawler with Puppeteer Cluster.
	To run the project with RabbitMQ, first you will need to switch to /rabbitmq directory and first run the publishUrl.js and then run pm2 start ./rabbitmq/consumeUrl.js -i 10. However, this is not recommended because this variant is not optimized and memory shortages will arise.
Design and Implementation
	For having a bigger picture of the design, I have used Chapter 9: Design a Web Crawler in System Design Interview: An Insider’s Guide book by Alex Wu. There, the author goes in detail on how a crawler should be designed. However, the author assumes that the reader has the tools, knowledge and infrastructure to design a highly scalable and efficient crawler. Personally, I did not have all of these things, so I only took the parts that were „doable”. Here are those things:
1.	The crawler should be highly scalable – In order to achieve this, the crawler should be distributed on multiple servers, where each server crawls and processes a certain batch of URLs. Since i do not have a server infrastructure, I had to rely on Chrome processes using Puppeteer Cluster. This is one of the methods that the crawler can achieve parallelism. Another way would be using RabbitMQ. The URLs are added inside a queue, where they will be consumed by some workers, hence the using of pm2 library which creates multiple workers for consuming the URLs.

2.	DNS Caching – If a URL was already crawled, there is no need in crawling it again since it is a waste of time and resources. So therefore, the crawled URLs will be stored in a Redis cache.

3.	Timeout – If a page cannot be crawled, than the crawler should move on and crawl other pages. In our crawler, this is achieved by closing the specific page or browser instance when that page throws an error.

4.	Data storage – After crawling the URLs, the data will need to be stored in a database, in our case is MongoDB.

5.	Politness – If a website recieves multiple requests from the same IP address in a short time, it will deny access for that IP. So therefore, requests need to be made after a certain amount of time to avoid being „impolite”.

Handling the page and address crawling
	In orther to have an efficient crawler, we will need to crawl only the data that is required, in this case the addresses. So we have to think, where are the addresses on a website? Usually, they are on the contact page, about us page or any other similar pages. In orther to crawl only these certain pages and not waste time on other pages, I used a regex to identify the URLs for these specific pages on each website.
	Moving on, we need to keep in mind that the addresses are in certain HTML elements like paragraphs, divs, headings etc. So we will need to only crawl these elements. In order to recognize the text which is similar to an address, we will need another regex.
	Once the addresses are found, they need to be normalized. For this, I used a library called node-geocoder which is a wrapper for APIs that actually normalize addresses. In this case, I used the API from OpenCage. Once the addressed are normalized, they will be uploaded to the local MongoDB database.
	As I have mentioned earlier, the crawler is parallelized using Puppeteer Cluster, since Puppeteer is the only library that offers an out-of-the-box parallelizing system. This works adding the URLs in a queue, where they will be consumed by a Google Chrome process. Once the crawling is done, the browser is closed.
	The other way is by using RabbitMQ. This method works, however it is not optimized and it is not recommended to be executed because it can lead to memory shortages. 
Conslusions
	When designing a system like a crawler, you will need to keep in mind the essentials, since there is no need for wasting time and resources, so therefore having a high-level design for the entire system. 
Chosing the technologies and libraries in implementing the system plays a crucial role, since it can give you a very good functional product or it can leave you with headaches. I could have choosen using Cherio instead of Puppeteer beacuse Cherio does not open browsers to make a request, instead it just makes a request to a certain URL and returns the HTML. So the RabbitMQ method would have worked better if I have used this variant instead. However, Cherio does not come with an out-of-the-box solution for parallelization. 
Your solution should be optimized as much as possible. However, I did not get to optimize the RabbitMQ solution, so I could not make an efficient comparison between the two methods. At least, the Puppeteer Cluster variant uses as little resources as possible.





References
1.	Alex Wu, System Design Interview An Insider’s Guide -https://github.com/G33kzD3n/Catalogue/blob/master/System%20Design%20Interview%20An%20Insider%E2%80%99s%20Guide%20by%20Alex%20Xu%20(z-lib.org).pdf
2.	Distributed Web Crawling Made Easy: System and Architecture - https://www.zenrows.com/blog/distributed-web-crawling#celery-redis-intro
3.	Node.js Puppeteer Tutorial - https://www.youtube.com/watch?v=Bo6n7rrkA60&list=PLuJJZ-W1NwdqgvE0D-1SMS7EpWIC5cKqu&index=4

