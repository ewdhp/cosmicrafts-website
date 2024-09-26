import os
import subprocess
import random
import string
import asyncio

async def execute_dfx_command(command, log_output=True):
    """Executes a shell command asincrónicamente y registra la salida."""
    print(f"Executing command: {command}")
    process = await asyncio.create_subprocess_shell(command, stdout=subprocess.PIPE, stderr=subprocess.PIPE)
    stdout, stderr = await process.communicate()
    
    if process.returncode != 0:
        error_message = f"Command failed: {command}\n{stderr.decode().strip()}"
        if log_output:
            print(error_message)
        return False, stderr.decode().strip()
    else:
        output = stdout.decode().strip()
        if log_output:
            print(f"Command output: {output}")
        return True, output

async def switch_identity(identity_name):
    """Cambia la identidad de DFX asincrónicamente."""
    command = f"dfx identity use {identity_name}"
    success, _ = await execute_dfx_command(command)
    if not success:
        raise Exception(f"Failed to switch identity: {identity_name}")
    
    # Obtiene el ID principal de la identidad actual
    command = "dfx identity get-principal"
    success, principal_id = await execute_dfx_command(command)
    if not success:
        raise Exception(f"Failed to get principal ID for identity: {identity_name}")
    
    return principal_id.strip()

def generate_random_username(length=12):
    """Genera un nombre de usuario aleatorio con una longitud especificada."""
    letters = string.ascii_lowercase
    return ''.join(random.choice(letters) for i in range(length))

async def create_batch_of_unassigned_codes():
    """Crea un lote de códigos de referencia no asignados."""
    command = f"dfx canister call cosmicrafts createBatchOfUnassignedCodes"
    success, output = await execute_dfx_command(command)
    if not success:
        raise Exception(f"Failed to create unassigned referral codes: {output}")

    parsed_codes = output.strip().replace('(vec {', '').replace('})', '').replace('"', '').replace(';', '').split()

    return parsed_codes

async def get_referral_code(player_principal):
    """Obtiene el código de referencia de un jugador dado."""
    command = f'dfx canister call cosmicrafts getReferralCode \'(principal "{player_principal}")\''
    success, output = await execute_dfx_command(command)
    if not success:
        raise Exception(f"Failed to get referral code for {player_principal}: {output}")

    referral_code = output.strip().replace('(opt "', '').replace('")', '')
    return referral_code

async def register_user(semaphore, user, username, avatar_id, referral_code, registered_players):
    """Cambia la identidad y registra un usuario usando el método registerPlayer del canister."""
    async with semaphore:
        retries = 3
        for attempt in range(retries):
            try:
                if user in registered_players:
                    print(f"User {user} already registered, skipping.")
                    return None

                print(f"Switching to identity {user}")
                player_principal = await switch_identity(user)
                
                print(f"Identity switched to {user} (Principal: {player_principal}), now making canister call")
                command = f'dfx canister call cosmicrafts registerPlayer \'("{username}", {avatar_id}, "{referral_code}")\''
                
                success, output = await execute_dfx_command(command)
                if not success:
                    raise Exception(f"Canister call failed: {output}")
                
                print(f"Finished registration for {user}")
                registered_players.add(user)
                return player_principal  # Devuelve el ID principal para su uso posterior
            except Exception as e:
                error_message = f"Error registering {user} on attempt {attempt + 1}: {e}"
                print(error_message)
                if attempt == retries - 1:
                    raise e
                await asyncio.sleep(1)  # Espera antes de reintentar

def build_hardcoded_tree():
    """Construye la estructura del árbol de referencias predefinido."""
    tree = {
        0: [1, 2, 3, 4, 5],  # El primer jugador invita a los jugadores de segundo nivel
        1: [6, 7, 8, 9],  # El segundo nivel invita a los jugadores de tercer nivel
        2: [10, 11, 12, 13],
        3: [14, 15, 16],
        4: [17, 18],
        5: [19, 20, 21],
        6: [22, 23],  # El tercer nivel invita a los jugadores de cuarto nivel
        7: [24],
        8: [25, 26],
        9: [27],
        10: [28, 29],
        11: [30],
        12: [31, 32],
        13: [33, 34],
        14: [35],
        15: [36],
        16: [37, 38],
        17: [39],
        18: [40, 41],
        19: [42],
        20: [43],
        21: [44, 45],
    }
    return tree

async def register_and_cascade(semaphore, user_data, tree, parent_index, referral_code, registered_players):
    """Registra un jugador y haz que invite a otros según la estructura del árbol predefinido."""
    player_principal = await register_user(semaphore, user_data[parent_index][0], user_data[parent_index][1], user_data[parent_index][2], referral_code, registered_players)
    if not player_principal:
        return
    
    # Obtiene el nuevo código de referencia para este jugador
    new_referral_code = await get_referral_code(player_principal)

    # Registra a los hijos en secuencia
    if parent_index in tree:
        for child_index in tree[parent_index]:
            await register_and_cascade(semaphore, user_data, tree, child_index, new_referral_code, registered_players)

async def mint_chest(player_principal, rarity):
    """Mintea un cofre para un jugador dado."""
    command = f'dfx canister call cosmicrafts mintChest \'(principal "{player_principal}", {rarity})\''
    success, output = await execute_dfx_command(command)
    if not success:
        raise Exception(f"Failed to mint chest for {player_principal}: {output}")
    print(f"Minted chest for {player_principal} with rarity {rarity}")

async def mint_unit(player_principal, metadata):
    """Mintea una unidad para un jugador dado."""
    command = f'dfx canister call cosmicrafts mintUnit \'(principal "{player_principal}", {metadata})\''
    success, output = await execute_dfx_command(command)
    if not success:
        raise Exception(f"Failed to mint unit for {player_principal}: {output}")
    print(f"Minted unit for {player_principal} with metadata {metadata}")

async def claim_achievements(player_principal):
    """Reclama logros para un jugador dado."""
    individual_achievement_ids = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25]
    referral_achievement_ids = [26, 27, 28, 29, 30]

    # Actualiza y reclama progreso para logros individuales regulares
    for ind_ach_id in individual_achievement_ids:
        # Actualiza el progreso para cumplir con el progreso requerido para logros regulares
        await execute_dfx_command(f"dfx canister call cosmicrafts addProgressToIndividualAchievement '(principal \"{player_principal}\", {ind_ach_id}, 1)'")
        
        # Reclama la recompensa del logro individual
        await execute_dfx_command(f"dfx canister call cosmicrafts claimIndividualAchievementReward '({ind_ach_id})'")

    # Maneja logros de referencia con requisitos de progreso específicos
    referral_progress_requirements = [1, 3, 5, 10, 25]

    for ind_ach_id, required_progress in zip(referral_achievement_ids, referral_progress_requirements):
        # Actualiza el progreso para cumplir con el progreso requerido para logros de referencia
        await execute_dfx_command(f"dfx canister call cosmicrafts addProgressToIndividualAchievement '(principal \"{player_principal}\", {ind_ach_id}, {required_progress})'")
        
        # Reclama la recompensa del logro individual
        await execute_dfx_command(f"dfx canister call cosmicrafts claimIndividualAchievementReward '({ind_ach_id})'")

 # Reclama todas las líneas de logros después de que todos los logros individuales estén completados
    achievement_line_ids = [1, 2, 3, 4, 5, 6, 7, 8]  # Reemplaza con los IDs reales de las líneas de logros

    for ach_line_id in achievement_line_ids:
        # Reclama la recompensa de la línea de logros
        await execute_dfx_command(f"dfx canister call cosmicrafts claimAchievementLineReward '({ach_line_id})'")

    # Finalmente, reclama la recompensa de la categoría
    category_id = 1  # Reemplaza con el ID real de la categoría
    await execute_dfx_command(f"dfx canister call cosmicrafts claimCategoryAchievementReward '({category_id})'")

    # Verifica el estado final de todos los logros
    await execute_dfx_command("dfx canister call cosmicrafts getAchievementsView")

async def call_create_missions_periodically():
    print("Calling createMissionsPeriodically function in the canister")
    command = 'dfx canister call cosmicrafts createMissionsPeriodically'
    success, output = await execute_dfx_command(command)
    if success:
        print("Successfully called createMissionsPeriodically")
    else:
        print(f"Failed to call createMissionsPeriodically: {output}")

async def call_init_achievements():
    print("Calling initAchievements function in the canister")
    command = 'dfx canister call cosmicrafts initAchievements'
    success, output = await execute_dfx_command(command)
    if success:
        print("Successfully called initAchievements")
    else:
        print(f"Failed to call initAchievements: {output}")

async def main():

    initial_commands = [
    ]
    
    for command in initial_commands:
        await execute_dfx_command(command)


    await switch_identity("default")

    num_users = 46 

    users = [f"player{i}" for i in range(1, num_users + 1)] 
    user_data = [(user, generate_random_username(), random.randint(1, 33)) for user in users] 

    semaphore = asyncio.Semaphore(1) 
    registered_players = set()

    unassigned_codes = await create_batch_of_unassigned_codes()
    print(f"Created unassigned referral codes: {unassigned_codes}")

    tree = build_hardcoded_tree()

    print(f"Starting cascade registration from player 0")
    await register_and_cascade(semaphore, user_data, tree, 0, unassigned_codes[0], registered_players)


    print("Switching back to bizkit identity")
    await switch_identity("default")

    principal_id = await switch_identity(user_data[0][0])
    command = f'dfx canister call cosmicrafts getTotalReferralNetwork \'(principal "{principal_id}")\''
    success, output = await execute_dfx_command(command)

    if success:
        print(f"Total referral network for the first player ({principal_id}): {output}")


    await claim_achievements(principal_id)


if __name__ == "__main__":
    asyncio.run(main())