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

async def call_create_batch_of_unassigned_codes():
    """Crea un lote de códigos de referencia no asignados."""
    command = f"dfx canister call cosmicrafts createBatchOfUnassignedCodes"
    success, output = await execute_dfx_command(command)
    if not success:
        raise Exception(f"Failed to create unassigned referral codes: {output}")

    parsed_codes = output.strip().replace('(vec {', '').replace('})', '').replace('"', '').replace(';', '').split()

    return parsed_codes

async def call_mint_chest(player_principal, rarity):
    """Mintea un cofre para un jugador dado."""
    command = f'dfx canister call cosmicrafts mintChest \'(principal "{player_principal}", {rarity})\''
    success, output = await execute_dfx_command(command)
    if not success:
        raise Exception(f"Failed to mint chest for {player_principal}: {output}")
    print(f"Minted chest for {player_principal} with rarity {rarity}")

async def call_mint_unit(player_principal, metadata):
    """Mintea una unidad para un jugador dado."""
    command = f'dfx canister call cosmicrafts mintUnit \'(principal "{player_principal}", {metadata})\''
    success, output = await execute_dfx_command(command)
    if not success:
        raise Exception(f"Failed to mint unit for {player_principal}: {output}")
    print(f"Minted unit for {player_principal} with metadata {metadata}")

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

    await switch_identity("default")
    await call_init_achievements()
    await call_create_missions_periodically() 


if __name__ == "__main__":
    asyncio.run(main())