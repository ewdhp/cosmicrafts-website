import json
from ic.client import Client
from ic.identity import Identity
from ic.agent import Agent
from ic.candid import encode, decode, Types

# Load canister IDs
with open('canister_ids.json') as f:
    canister_ids = json.load(f)

# Set up the client and agent
client = Client(url="http://localhost:8000")
identity = Identity()
agent = Agent(identity, client)

# Canister ID
canister_id = canister_ids['your_canister_name']['local']

# Function to call getAchievementsByCategoryForCaller
def get_achievements_by_category_for_caller(category_id):
    # Encode the arguments
    args = encode([Types.Nat(category_id)])
    
    # Call the canister method
    response = agent.query_raw(canister_id, "getAchievementsByCategoryForCaller", args)
    
    # Decode the response
    result = decode(response, Types.Vec(Types.Record({
        'id': Types.Nat,
        'name': Types.Text,
        'description': Types.Text,
        'categoryId': Types.Nat
    })))
    
    return result

# Test the function
category_id = 1  # Replace with the actual category ID

achievements = get_achievements_by_category_for_caller(category_id)
print("Achievements by Category:", achievements)