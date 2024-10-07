import json
import subprocess
import random
import string
import time
import sys
import re

# Configuration
USERS_CANISTER = "bkyz2-fmaaa-aaaaa-qaaaq-cai"          # Replace with your actual 'users' canister name if different

# Function to run a command and get the output
def run_command(command, capture_output=True, text=True):
    """
    Helper function to run a shell command.
    """
    try:
        print(f"Running command: {' '.join(command)}")
        result = subprocess.run(command, capture_output=capture_output, text=text, check=True)
        if capture_output:
            output = result.stdout.strip()
            print(f"Command output: {output}")
            return output
        return None
    except subprocess.CalledProcessError as e:
        print(f"Command {' '.join(command)} failed with error: {e.stderr.strip()}")
        return None

# Function to create a post
def add_friend(caller_id, friend_id):
    command = [
        "dfx", "canister", "call", USERS_CANISTER,
        "addFriend",
        f'(principal "{friend_id}")'
    ]
    return run_command(command)

# Function to follow a user
def create_post(user_id, username, content):
    command = [
        "dfx", "canister", "call", USERS_CANISTER,
        "createPost",
        f'(principal "{user_id}", "{username}", null, "{content}")'
    ]
    return run_command(command)

# Function to create a comment
def create_comment(post_id, user_id, username, content):
    command = [
        "dfx", "canister", "call", USERS_CANISTER,
        "createComment",
        f'({post_id}, principal "{user_id}", "{username}", "{content}")'  # Correct parameter order and format
    ]
    return run_command(command)

# Function to follow a user
def like_post(post_id, like_id, user_id, username):
    # Get the current time in seconds since epoch and convert to Nat64
    current_time = int(time.time() * 1_000_000_000)  # Convert to nanoseconds

    command = [
        "dfx", "canister", "call", USERS_CANISTER,
        "likePost",
        f'({post_id}, {like_id}, principal "{user_id}", "{username}", {current_time})'
    ]
    return run_command(command)

# Function to follow a user
def follow_user(caller_id, follow_id):
    command = [
        "dfx", "canister", "call", USERS_CANISTER,
        "followUser",
        f'(principal "{follow_id}")'
    ]
    return run_command(command)

# Function to get created identities from dfx command
def get_created_identities():
    command = ["dfx", "identity", "list"]
    result = subprocess.run(command, capture_output=True, text=True)
    
    identities = []
    if result.returncode == 0:
        # Parse the output to extract principals and usernames
        for line in result.stdout.splitlines():
            if line.strip():
                parts = line.split()
                principal = parts[0]
                username = parts[1] if len(parts) > 1 else "Unnamed"
                identities.append({"principal": principal, "username": username})
    else:
        print(f"Error retrieving identities: {result.stderr.strip()}")

    return identities

# Function to create a post
def create_post(principal, username, content):
    command = [
        "dfx", "canister", "call", "bkyz2-fmaaa-aaaaa-qaaaq-cai",
        "createPost",
        f'({principal}, "{username}", null, "{content}")'  # Pass principal correctly
    ]
    return run_command(command)

# Function to create a comment
def create_comment(post_id, user_id, username, content):
    command = [
        "dfx", "canister", "call", "bkyz2-fmaaa-aaaaa-qaaaq-cai",
        "createComment",
        f'({post_id}, principal "{user_id}", "{username}", "{content}")'  # Pass user ID correctly
    ]
    return run_command(command)

# Function to like a post
def like_post(post_id, like_id, user_id, username):
    current_time = int(time.time() * 1_000_000_000)  # Convert to nanoseconds
    command = [
        "dfx", "canister", "call", "bkyz2-fmaaa-aaaaa-qaaaq-cai",
        "likePost",
        f'({post_id}, {like_id}, principal "{user_id}", "{username}", {current_time})'  # Pass user ID correctly
    ]
    return run_command(command)

# Function to add a friend
def add_friend(user_id, friend_id):
    command = [
        "dfx", "canister", "call", "bkyz2-fmaaa-aaaaa-qaaaq-cai",
        "addFriend",
        f'({friend_id})'
    ]
    return run_command(command)

# Function to run a command and get the output
def run_command(command):
    result = subprocess.run(command, capture_output=True, text=True)
    return result.stdout.strip() if result.returncode == 0 else result.stderr.strip()

# Function to create a post
def create_post(principal, username, content):
    command = [
        "dfx", "canister", "call", "bkyz2-fmaaa-aaaaa-qaaaq-cai",
        "createPost",
        f'({principal}, "{username}", null, "{content}")'  # Ensure the principal is used
    ]
    return run_command(command)

# Function to create a comment
def create_comment(post_id, user_id, username, content):
    command = [
        "dfx", "canister", "call", "bkyz2-fmaaa-aaaaa-qaaaq-cai",
        "createComment",
        f'({post_id}, principal "{user_id}", "{username}", "{content}")'  # Ensure user_id is principal
    ]
    return run_command(command)

# Function to like a post
def like_post(post_id, like_id, user_id, username):
    current_time = int(time.time() * 1_000_000_000)  # Convert to nanoseconds
    command = [
        "dfx", "canister", "call", "bkyz2-fmaaa-aaaaa-qaaaq-cai",
        "likePost",
        f'({post_id}, {like_id}, principal "{user_id}", "{username}", {current_time})'  # Ensure user_id is principal
    ]
    return run_command(command)

# Function to add a friend
def add_friend(user_id, friend_id):
    command = [
        "dfx", "canister", "call", "bkyz2-fmaaa-aaaaa-qaaaq-cai",
        "addFriend",
        f'({friend_id})'  # Ensure friend_id is passed correctly
    ]
    return run_command(command)

# Function to run a command and get the output
def run_command(command):
    result = subprocess.run(command, capture_output=True, text=True)
    if result.returncode != 0:
        print(f"Error executing command '{' '.join(command)}': {result.stderr.strip()}")
    return result.stdout.strip() if result.returncode == 0 else result.stderr.strip()
    
# Function to create a post
def create_post(principal, username, content):
    command = [
        "dfx", "canister", "call", "bkyz2-fmaaa-aaaaa-qaaaq-cai",
        "createPost",
        f'({principal}, "{username}", null, "{content}")'  # Ensure the principal is used
    ]
    return run_command(command)

# Function to create a comment
def create_comment(post_id, user_id, username, content):
    command = [
        "dfx", "canister", "call", "bkyz2-fmaaa-aaaaa-qaaaq-cai",
        "createComment",
        f'({post_id}, principal "{user_id}", "{username}", "{content}")'  # Ensure user_id is principal
    ]
    return run_command(command)

# Function to like a post
def like_post(post_id, like_id, user_id, username):
    current_time = int(time.time() * 1_000_000_000)  # Convert to nanoseconds
    command = [
        "dfx", "canister", "call", "bkyz2-fmaaa-aaaaa-qaaaq-cai",
        "likePost",
        f'({post_id}, {like_id}, principal "{user_id}", "{username}", {current_time})'  # Ensure user_id is principal
    ]
    return run_command(command)

# Function to add a friend
def add_friend(user_id, friend_id):
    command = [
        "dfx", "canister", "call", "bkyz2-fmaaa-aaaaa-qaaaq-cai",
        "addFriend",
        f'(principal "{friend_id}")'  # Ensure friend_id is passed correctly
    ]
    return run_command(command)

# Function to run a command and get the output
def run_command(command):
    result = subprocess.run(command, capture_output=True, text=True)
    if result.returncode != 0:
        print(f"Error executing command '{' '.join(command)}': {result.stderr.strip()}")
    return result.stdout.strip() if result.returncode == 0 else result.stderr.strip()

# Function to create a post
def create_post(principal, username, content):
    command = [
        "dfx", "canister", "call", "bkyz2-fmaaa-aaaaa-qaaaq-cai",
        "createPost",
        f'({principal}, "{username}", null, "{content}")'  # Ensure the principal is used
    ]
    return run_command(command)

# Function to switch to a given identity
def switch_identity(identity):
    command = ["dfx", "identity", "use", identity]
    print(f"Switching to identity: {identity}")  # Debug print
    result = subprocess.run(command, capture_output=True, text=True)

    if result.returncode == 0:
        print(f"Switched to identity '{identity}' successfully.")  # Debug print
    else:
        print(f"Error switching identity '{identity}': {result.stderr.strip()}")

# Function to get principal ID for the currently active identity
def get_principal_id():
    command = ["dfx", "identity", "get-principal"]
    print(f"Running command: {command}")  # Debug print

    result = subprocess.run(command, capture_output=True, text=True)

    if result.returncode == 0:
        principal_id = result.stdout.strip()
        return principal_id
    else:
        print(f"Error retrieving principal: {result.stderr.strip()}")
        return None

# Function to get created identities from dfx command
def get_created_identities():
    command = ["dfx", "identity", "list"]
    print("Running command:", " ".join(command))  # Debug print

    result = subprocess.run(command, capture_output=True, text=True)

    identities = []
    if result.returncode == 0:
        print("Command output:", result.stdout.strip())  # Debug print
        # Parse the output to extract identity names
        for line in result.stdout.splitlines():
            if line.strip() and not line.startswith("*"):  # Ignore the current default identity
                identity_name = line.split()[0]  # The first part is the identity name
                identities.append(identity_name)
    else:
        print(f"Error retrieving identities: {result.stderr.strip()}")

    return identities

# Function to filter identities based on the pattern "player<number>"
def filter_player_identities(identities):
    return [identity for identity in identities if re.match(r'^player\d+$', identity)]

# Function to create a post
def create_post(principal_id, username, content):
    command = [
        "dfx", "canister", "call", "bkyz2-fmaaa-aaaaa-qaaaq-cai", "createPost",
        f'(principal "{principal_id}", "{username}", null, "{content}")'
    ]
    result = subprocess.run(command, capture_output=True, text=True)
    return result.stdout.strip(), result.returncode

# Function to create a comment
def create_comment(post_id, principal_id, username, content):
    command = [
        "dfx", "canister", "call", "bkyz2-fmaaa-aaaaa-qaaaq-cai", "createComment",
        f'({post_id}, principal "{principal_id}", "{username}", "{content}")'
    ]
    result = subprocess.run(command, capture_output=True, text=True)
    return result.stdout.strip(), result.returncode

# Function to like a post
def like_post(post_id, like_id, principal_id, username):
  command = [
      "dfx", "canister", "call", "bkyz2-fmaaa-aaaaa-qaaaq-cai", "likePost",
      f'({post_id}, {like_id}, principal "{principal_id}", "{username}", {int(time.time() * 1_000_000_000)})'
  ]
  result = subprocess.run(command, capture_output=True, text=True)
  return result.stdout.strip(), result.returncode

# Helper function to get random friends to add
def get_random_friends(all_users, current_user, num_friends=2):
    potential_friends = [user for user in all_users if user != current_user]
    return random.sample(potential_friends, min(num_friends, len(potential_friends)))

# Helper function to get random followers to add
def get_random_followers(all_users, current_user, num_followers=2):
    potential_followers = [user for user in all_users if user != current_user]
    return random.sample(potential_followers, min(num_followers, len(potential_followers)))

# Main function to perform social user calls and summary
def main():
    # Retrieve created identities
    identities = get_created_identities()
    
    # Filter identities that match "player<number>"
    player_identities = filter_player_identities(identities)

    # Create a dictionary to hold identity names and their corresponding principal IDs
    identity_principals = {}

    # Get principal IDs for each player identity
    for identity in player_identities:
        switch_identity(identity)  # Switch to the identity
        principal_id = get_principal_id()  # Get the principal ID for the active identity
        if principal_id:
            identity_principals[identity] = principal_id

    # Summary of actions
    summary = {}

    # Initialize post ID counter
    post_id_counter = 1

    # Actions to perform for each player identity
    for identity, principal_id in identity_principals.items():
        username = identity  # Using the identity name as the username

        # Create a post
        post_content = f"This is a post from {username}!"
        post_result, post_code = create_post(principal_id, username, post_content)

        # Assuming post creation is successful
        if post_code == 0:
            print(f"{username} created a post: '{post_content}' - Result: {post_result}")

            # Use the incremented post ID
            current_post_id = post_id_counter

            # Create a comment
            comment_content = f"This is a comment from {username}!"
            comment_result, comment_code = create_comment(current_post_id, principal_id, username, comment_content)
            print(f"{username} commented: '{comment_content}' - Result: {comment_result}")

            # Like the post
            like_id = 1  # This could be incremented or retrieved based on your logic
            like_result, like_code = like_post(current_post_id, like_id, principal_id, username)
            print(f"{username} liked post ID {current_post_id} - Result: {like_result}")

            # Update summary
            summary[username] = {
                "post": post_result,
                "comment": comment_result,
                "like": like_result
            }

            # Increment post ID counter for the next player
            post_id_counter += 1

            # Add some followers and friends
            friends_to_add = get_random_friends(identity_principals.keys(), identity)
            for friend in friends_to_add:
                add_friend_result = add_friend(principal_id, identity_principals[friend])
                print(f"{username} added friend: {friend} - Result: {add_friend_result}")

            followers_to_add = get_random_followers(identity_principals.keys(), identity)
            for follower in followers_to_add:
                follow_result = follow_user(principal_id, identity_principals[follower])
                print(f"{username} followed: {follower} - Result: {follow_result}")

        else:
            print(f"Failed to create post for {username}. Result: {post_result}")

    # Print the summary of actions taken
    print("\nSummary of Actions:")
    for username, actions in summary.items():
        print(f"{username}: {actions}")

if __name__ == "__main__":
    main()