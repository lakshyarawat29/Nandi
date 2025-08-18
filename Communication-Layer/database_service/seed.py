# database_service/seed.py
''' 
This script connects to the MongoDB instance and populates it with
initial mock data for farmers. It's run once by the db_seeder service.
'''

import os
import logging
from pymongo import MongoClient

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

MONGO_URI = os.environ.get("MONGO_URI", "mongodb://localhost:27017/")

FARMERS_DATA = [
  {
    "_id": "+919876543210",
    "name": "Rohan Deshmukh",
    "aadhar_number": "112233445566",
    "primary_language": "Marathi",
    "secondary_language": "Hindi",
    "location": {"state": "maharashtra", "district": "pune", "village/town": "lonavala", "coordinates": [73.8567, 18.5204]},
    "farm_size_acres": 7.5
  },
  {
    "_id": "+919988776655",
    "name": "Deepa Hegde",
    "aadhar_number": "223344556677",
    "primary_language": "Kannada",
    "secondary_language": "English",
    "location": {"state": "karnataka", "district": "bengaluru", "village/town": "devanahalli", "coordinates": [77.5946, 12.9716]},
    "farm_size_acres": 4
  },
  {
    "_id": "+919123456789",
    "name": "Krishna Reddy",
    "aadhar_number": "334455667788",
    "primary_language": "Telugu",
    "secondary_language": "English",
    "location": {"state": "andhra pradesh", "district": "visakhapatnam", "village/town": "anakapalle", "coordinates": [83.2185, 17.6888]},
    "farm_size_acres": 20
  },
  {
    "_id": "+918876543210",
    "name": "Fatima Beevi",
    "aadhar_number": "445566778899",
    "primary_language": "Malayalam",
    "secondary_language": "English",
    "location": {"state": "kerala", "district": "kochi", "village/town": "aluva", "coordinates": [76.2673, 9.9312]},
    "farm_size_acres": 1.5
  },
  {
    "_id": "+917765432109",
    "name": "Ishaan Sharma",
    "aadhar_number": "556677889900",
    "primary_language": "Hindi",
    "secondary_language": "English",
    "location": {"state": "rajasthan", "district": "jaipur", "village/town": "sanganer", "coordinates": [75.7873, 26.9124]},
    "farm_size_acres": 18
  },
  {
    "_id": "+919000111222",
    "name": "Aarav Tiwari",
    "aadhar_number": "667788990011",
    "primary_language": "Hindi",
    "secondary_language": "English",
    "location": {"state": "madhya pradesh", "district": "indore", "village/town": "mhow", "coordinates": [75.8577, 22.7196]},
    "farm_size_acres": 10
  },
  {
    "_id": "+918111222333",
    "name": "Manish Kumar",
    "aadhar_number": "778899001122",
    "primary_language": "Bhojpuri",
    "secondary_language": "Hindi",
    "location": {"state": "bihar", "district": "patna", "village/town": "danapur", "coordinates": [85.1376, 25.5941]},
    "farm_size_acres": 3
  },
  {
    "_id": "+917222333444",
    "name": "Sunita Pradhan",
    "aadhar_number": "889900112233",
    "primary_language": "Odia",
    "secondary_language": "Hindi",
    "location": {"state": "odisha", "district": "bhubaneswar", "village/town": "jatani", "coordinates": [85.8245, 20.2961]},
    "farm_size_acres": 6
  },
  {
    "_id": "+919333444555",
    "name": "Bikash Gogoi",
    "aadhar_number": "990011223344",
    "primary_language": "Assamese",
    "secondary_language": "Bengali",
    "location": {"state": "assam", "district": "guwahati", "village/town": "dispur", "coordinates": [91.7362, 26.1445]},
    "farm_size_acres": 5
  },
  {
    "_id": "+918444555666",
    "name": "Pawan Yadav",
    "aadhar_number": "101020203030",
    "primary_language": "Haryanvi",
    "secondary_language": "Hindi",
    "location": {"state": "haryana", "district": "gurgaon", "village/town": "manesar", "coordinates": [77.0266, 28.4595]},
    "farm_size_acres": 25
  },
  {
    "_id": "+917555666777",
    "name": "Syed Ahmed",
    "aadhar_number": "202030304040",
    "primary_language": "Telugu",
    "secondary_language": "Urdu",
    "location": {"state": "telangana", "district": "hyderabad", "village/town": "gachibowli", "coordinates": [78.4867, 17.3850]},
    "farm_size_acres": 9
  },
  {
    "_id": "+919666777888",
    "name": "Pooja Mishra",
    "aadhar_number": "303040405050",
    "primary_language": "Hindi",
    "secondary_language": "English",
    "location": {"state": "uttar pradesh", "district": "lucknow", "village/town": "kakori", "coordinates": [80.9462, 26.8467]},
    "farm_size_acres": 11
  },
  {
    "_id": "+918777888999",
    "name": "Jignesh Shah",
    "aadhar_number": "404050506060",
    "primary_language": "Gujarati",
    "secondary_language": "Hindi",
    "location": {"state": "gujarat", "district": "surat", "village/town": "hazira", "coordinates": [72.8311, 21.1702]},
    "farm_size_acres": 14
  },
  {
    "_id": "+917888999000",
    "name": "Aditi Banerjee",
    "aadhar_number": "505060607070",
    "primary_language": "Bengali",
    "secondary_language": "English",
    "location": {"state": "west bengal", "district": "kolkata", "village/town": "baranagar", "coordinates": [88.3639, 22.5726]},
    "farm_size_acres": 2.2
  },
  {
    "_id": "+919990001111",
    "name": "Karthik Subramanian",
    "aadhar_number": "606070708080",
    "primary_language": "Tamil",
    "secondary_language": "English",
    "location": {"state": "tamil nadu", "district": "chennai", "village/town": "tambaram", "coordinates": [80.2707, 13.0827]},
    "farm_size_acres": 8
  },
  {
    "_id": "+918000111222",
    "name": "Harleen Kaur",
    "aadhar_number": "707080809090",
    "primary_language": "Punjabi",
    "secondary_language": "Hindi",
    "location": {"state": "punjab", "district": "amritsar", "village/town": "ajnala", "coordinates": [74.8723, 31.6340]},
    "farm_size_acres": 30
  },
  {
    "_id": "+917111222333",
    "name": "Omar Abdullah",
    "aadhar_number": "808090901010",
    "primary_language": "Kashmiri",
    "secondary_language": "Urdu",
    "location": {"state": "jammu and kashmir", "district": "srinagar", "village/town": "pampore", "coordinates": [74.7973, 34.0837]},
    "farm_size_acres": 12
  },
  {
    "_id": "+919222333444",
    "name": "Aditya Thakur",
    "aadhar_number": "909010102020",
    "primary_language": "Hindi",
    "secondary_language": "English",
    "location": {"state": "himachal pradesh", "district": "shimla", "village/town": "kufri", "coordinates": [77.1734, 31.1048]},
    "farm_size_acres": 6.5
  },
  {
    "_id": "+918333444555",
    "name": "Gaurav Rawat",
    "aadhar_number": "121223233434",
    "primary_language": "Garhwali",
    "secondary_language": "Hindi",
    "location": {"state": "uttarakhand", "district": "dehradun", "village/town": "rishikesh", "coordinates": [78.0322, 30.3165]},
    "farm_size_acres": 4.8
  },
  {
    "_id": "+917444555666",
    "name": "Neha Sahu",
    "aadhar_number": "343445455656",
    "primary_language": "Chhattisgarhi",
    "secondary_language": "Hindi",
    "location": {"state": "chhattisgarh", "district": "raipur", "village/town": "arang", "coordinates": [81.6296, 21.2514]},
    "farm_size_acres": 13
  }
]

INTERACTION_LOGS_COLLECTION = "interaction-log"
FARMERS_COLLECTION = "farmers-data"

def seed_database():
    """Connects to MongoDB and inserts mock data if the collection is empty."""
    try:
        logger.info(f"Connecting to MongoDB at {MONGO_URI}...")
        client = MongoClient(MONGO_URI)
        db = client.nandi_system
        
        farmers_collection = db[FARMERS_COLLECTION]
        
        if farmers_collection.count_documents({}) == 0:
            logger.info("Farmers collection is empty. Seeding database...")
            farmers_collection.insert_many(FARMERS_DATA)
            logger.info(f"Successfully inserted {len(FARMERS_DATA)} farmer profiles.")
        else:
            logger.info("Farmers collection already contains data. Skipping seed.")
            
        # Ensure interaction logs collection exists
        if INTERACTION_LOGS_COLLECTION not in db.list_collection_names():
            logger.info(f"Creating '{INTERACTION_LOGS_COLLECTION}' collection...")
            db.create_collection(INTERACTION_LOGS_COLLECTION)
            logger.info(f"Created '{INTERACTION_LOGS_COLLECTION}' collection.")

        client.close()
        logger.info("Database connection closed.")

    except Exception as e:
        logger.error(f"An error occurred while seeding the database: {e}")
        raise

if __name__ == "__main__":
    seed_database()
