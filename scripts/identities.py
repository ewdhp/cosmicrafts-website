import subprocess
import random
import string
import time

# Configuration
USERS_CANISTER = "users"          # Replace with your actual 'users' canister name if different
REFERRALS_CANISTER = "referrals"  # Replace with your actual 'referrals' canister name if different

def run_command(command, capture_output=True, text=True):
    """
    Helper function to run a shell command.
    """
    try:
        result = subprocess.run(command, capture_output=capture_output, text=text, check=True)
        return result.stdout.strip()
    except subprocess.CalledProcessError as e:
        print(f"Command {' '.join(command)} failed with error: {e.stderr.strip()}")
        return None

def create_identities(num_identities):
    """
    Creates the specified number of identities and retrieves their principals.
    Returns a list of dictionaries with identity names and principals.
    """
    identities = []
    for i in range(num_identities):
        identity_name = f"player{i + 1}"
        print(f"\nCreating identity: {identity_name}")
        try:
            # Create new identity
            run_command(["dfx", "identity", "new", identity_name, "--storage-mode=plaintext"])
            print(f"Identity '{identity_name}' created successfully.")

            # Get the principal of the new identity
            # Temporarily switch to the new identity to get its principal
            run_command(["dfx", "identity", "use", identity_name])
            print(f"Switched to identity '{identity_name}' to retrieve principal.")
            principal = run_command(["dfx", "identity", "get-principal"])
            if principal:
                print(f"Principal for '{identity_name}': {principal}")
                identities.append({
                    "name": identity_name,
                    "principal": principal,
                    "referral_code": None  # To be filled after registration
                })
            else:
                print(f"Failed to retrieve principal for '{identity_name}'.")
        except Exception as e:
            print(f"Error creating identity '{identity_name}': {e}")
    
    # Switch back to default identity after creation
    print("\nSwitching back to 'default' identity for registrations.")
    run_command(["dfx", "identity", "use", "default"])
    return identities

def generate_random_username(length=8):
    """
    Generates a random username consisting of lowercase letters and digits.
    """
    return 'user_' + ''.join(random.choices(string.ascii_lowercase + string.digits, k=length))

def generate_random_avatar_id(max_id=1000):
    """
    Generates a random avatar ID.
    """
    return random.randint(1, max_id)

def get_referral_code(principal):
    """
    Retrieves the referral code for a given principal by calling the referrals canister's getReferralCode function.
    """
    command = [
        "dfx", "canister", "call", REFERRALS_CANISTER,
        "getReferralCode",
        f'\'("{principal}")\''
    ]
    output = run_command(command)
    if output:
        # Expected output format: 'opt "REFERRAL_CODE"' or 'null'
        if output.startswith('opt "'):
            referral_code = output[len('opt "'): -1]
            print(f"Retrieved referral code for principal '{principal}': {referral_code}")
            return referral_code
        elif output == "null":
            print(f"No referral code found for principal '{principal}'.")
            return ""
        else:
            print(f"Unexpected output while retrieving referral code for '{principal}': {output}")
            return ""
    return ""

def register_user(user_id, username, avatar_id, referral_code):
    """
    Registers a user by calling the users canister's registerUserByID function.
    Returns a tuple (success: bool, message: str).
    """
    # Prepare referral_code parameter
    if referral_code:
        referral_code_str = f'"{referral_code}"'
    else:
        referral_code_str = '""'

    # Construct the argument tuple as per Candid syntax
    argument = f'({user_id}, "{username}", {avatar_id}, {referral_code_str})'

    command = [
        "dfx", "canister", "call", USERS_CANISTER,
        "registerUserByID",
        f'\'{argument}\''
    ]
    output = run_command(command)
    if output:
        # Expected output format: '(true, "Registration successful")' or '(false, "Error message")'
        try:
            # Remove parentheses
            output = output.strip("()")
            # Split by first comma to separate Bool and Text
            success_part, message_part = output.split(",", 1)
            success = success_part.strip().lower() == "true"
            # Remove surrounding quotes and whitespace from message
            message = message_part.strip().strip('"')
            print(f"Registration result for '{username}': Success={success}, Message='{message}'")
            return success, message
        except Exception as e:
            print(f"Failed to parse registration response: {output}")
            return False, str(e)
    return False, "No response"

def main():
    print("=== DFX Identity and User Registration Script ===\n")

    # Step 1: Get the number of identities to create
    while True:
        try:
            num_identities = int(input("Enter the number of players to register: "))
            if num_identities <= 0:
                print("Please enter a positive integer.")
            else:
                break
        except ValueError:
            print("Invalid input. Please enter a valid number.")

    # Step 2: Create identities and retrieve principals
    identities = create_identities(num_identities)
    if not identities:
        print("No identities were created. Exiting.")
        return

    # Step 3: Register each user
    registered_users = []
    for idx, user in enumerate(identities):
        print(f"\n--- Registering User {idx + 1}/{num_identities} ---")

        # Generate random username and avatar ID
        username = generate_random_username()
        avatar_id = generate_random_avatar_id()
        print(f"Generated Username: {username}")
        print(f"Generated Avatar ID: {avatar_id}")

        # Determine referral code
        if idx == 0:
            # First player uses a predefined referral code
            referral_code = "first"
            print(f"Assigned referral code for the first user: {referral_code}")
        else:
            # Retrieve the referral code from the last registered user
            last_registered_user = registered_users[-1]
            last_principal = last_registered_user["principal"]
            print(f"Retrieving referral code from the last registered user: {last_registered_user['username']}")
            referral_code = get_referral_code(last_principal)
            if not referral_code:
                print("Failed to retrieve referral code from the last registered user. Using empty string.")
                referral_code = ""

        # Register the user using the default identity
        success, message = register_user(user["principal"], username, avatar_id, referral_code)
        if success:
            if idx == 0:
                # For the first user, assign the predefined referral code "first"
                user_referral_code = "first"
            else:
                # Retrieve and store the user's referral code from referrals canister
                user_referral_code = get_referral_code(user["principal"])
            user["referral_code"] = user_referral_code
            registered_users.append({
                "name": user["name"],
                "principal": user["principal"],
                "username": username,
                "avatar_id": avatar_id,
                "referral_code": user_referral_code
            })
        else:
            print(f"Failed to register user '{username}': {message}")

        # Optional: Small delay to avoid overwhelming the system
        time.sleep(1)

    # Step 4: Summary of Registered Users
    print("\n=== Registration Summary ===")
    for user in registered_users:
        print(f"Username: {user['username']}, Principal: {user['principal']}, Referral Code: {user['referral_code']}")

    print("\nAll users have been processed.")

if __name__ == "__main__":
    main()
