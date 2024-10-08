import json
import subprocess
import random
import string
import time
import re

# Configuration
USERS_CANISTER = "cosmicrafts"  # Replace with your actual 'users' canister name if different

# Function to run a command and get the output
def run_command(command, capture_output=True, text=True):
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

# Function to set the default identity
def set_default_identity():
    command = ["dfx", "identity", "use", "default"]
    run_command(command)

# Function to create a post
def create_post(principal, username, content):
    command = [
        "dfx", "canister", "call", USERS_CANISTER,
        "createPost",
        f"'(principal \"{principal}\", \"{username}\", null, \"{content}\")'"
    ]
    output = run_command(command)
    # Extract the post ID from the output
    match = re.search(r'\(post_id: (\d+)\)', output)
    if match:
        return match.group(1)
    return None

# Function to create a comment
def create_comment(post_id, principal, username, content):
    command = [
        "dfx", "canister", "call", USERS_CANISTER,
        "createComment",
        f"'({post_id}, principal \"{principal}\", \"{username}\", \"{content}\")'"
    ]
    output = run_command(command)
    # Extract the comment ID from the output
    match = re.search(r'\(comment_id: (\d+)\)', output)
    if match:
        return match.group(1)
    return None

# Function to like a post
def like_post(post_id, like_id, principal, username):
    current_time = int(time.time() * 1_000_000_000)  # Convert to nanoseconds
    command = [
        "dfx", "canister", "call", USERS_CANISTER,
        "likePost",
        f"'({post_id}, {like_id}, principal \"{principal}\", \"{username}\", {current_time})'"
    ]
    return run_command(command)

# Function to like a comment
def like_comment(comment_id, like_id, principal, username):
    current_time = int(time.time() * 1_000_000_000)  # Convert to nanoseconds
    command = [
        "dfx", "canister", "call", USERS_CANISTER,
        "likeComment",
        f"'({comment_id}, {like_id}, principal \"{principal}\", \"{username}\", {current_time})'"
    ]
    return run_command(command)

# Function to generate random content
def generate_random_content(length=10):
    return ''.join(random.choices(string.ascii_letters + string.digits, k=length))

# Main function
def main():
    set_default_identity()
    principal_id = "3s2fs-u7klb-jmedr-ekalt-oxxmm-u35zu-stqv5-55af6-5osat-gct7a-gqe"
    if not principal_id:
        print("Failed to get principal ID.")
        return

    print(f"Principal ID: {principal_id}")

    username = "default_user"  # Replace with the actual username if needed

    post_ids = []
    for _ in range(3):
        content = generate_random_content()
        post_id = create_post(principal_id, username, content)
        if post_id:
            post_ids.append(post_id)
        else:
            print("Failed to create post.")

    for post_id in post_ids:
        comment_ids = []
        for _ in range(2):
            content = generate_random_content()
            comment_id = create_comment(post_id, principal_id, username, content)
            if comment_id:
                comment_ids.append(comment_id)
            else:
                print("Failed to create comment.")

        like_post(post_id, 1, principal_id, username)
        for comment_id in comment_ids:
            like_comment(comment_id, 1, principal_id, username)

if __name__ == "__main__":
    main()