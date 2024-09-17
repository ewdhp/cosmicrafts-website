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
    
async def test_get_top_referrals(page):
    command = f"dfx canister call cosmicrafts getTopReferrals {page}"
    success, output = await execute_dfx_command(command)
    if success:
        print("Top Referrals:", output)
    else:
        print("Failed to fetch top referrals:", output)

async def main():
   
    # Paso 6: Prueba las funciones de los tops
    page = 0  # Cambia el número de página según sea necesario

    print("Testing getTopReferrals...")
    await test_get_top_referrals(page)


if __name__ == "__main__":
    asyncio.run(main())