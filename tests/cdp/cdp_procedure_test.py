import sys
sys.path.insert(0, 'october_event/cdp')

import pytest
import sys
from unittest.mock import AsyncMock
from colorama import Fore, Style
from cdp_procedure import main

@pytest.mark.asyncio
async def test_cdp_main_success(monkeypatch):
    async def mock_main():
        return {"status": "success", "data": {"key": "value"}}  
    
    monkeypatch.setattr('cdp_procedure.main', mock_main)
    
    result = await main()
    
    assert result is not None, "Expected a valid response"
    print(f"{Fore.GREEN}{Style.BRIGHT}[+] Cdp procedure API is working....{Style.RESET_ALL}")

@pytest.mark.asyncio
async def test_cdp_main_failure(monkeypatch):
    async def mock_main():
        return True  
    
    monkeypatch.setattr('cdp_procedure.main', mock_main)
    
    result = await main()
    
    assert result is True, "Expected True when the API response fails"
    print(f"{Fore.RED}{Style.BRIGHT}[-] Unable to get API response{Style.RESET_ALL}")


@pytest.mark.asyncio
async def test_cdp_main_invalid_data(monkeypatch):
    async def mock_main():
        return {"status": "error", "message": "Invalid data format"} 

    monkeypatch.setattr('cdp_procedure.main', mock_main)
    
    result = await main()
    
    assert result is not None, "Expected result, even if data is invalid"
    print(f"{Fore.RED}{Style.BRIGHT}[-] Received invalid data from API{Style.RESET_ALL}")
