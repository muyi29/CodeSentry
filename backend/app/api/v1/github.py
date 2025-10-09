import requests
import os
from typing import List, Dict
from fastapi import HTTPException
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

GITHUB_TOKEN = os.getenv("GITHUB_TOKEN")
GITHUB_API = "https://api.github.com"

def get_pr_files(owner: str, repo: str, pr_number: int) -> List[Dict]:
    """
    Fetch files changed in a pull request from GitHub API.
    
    Args:
        owner: Repository owner
        repo: Repository name
        pr_number: Pull request number
        
    Returns:
        List of file objects with patches
        
    Raises:
        HTTPException: If GitHub API request fails
    """
    # Check if token is set
    if not GITHUB_TOKEN:
        raise HTTPException(
            status_code=500, 
            detail="GITHUB_TOKEN not configured. Please set it in your .env file"
        )
    
    # Debug - print token info
    print(f"Token being used: {GITHUB_TOKEN[:15]}... (length: {len(GITHUB_TOKEN)})")
    print(f"Token starts with 'ghp_': {GITHUB_TOKEN.startswith('ghp_')}")
    
    # Input validation
    if not owner or not repo:
        raise HTTPException(status_code=400, detail="Owner and repo are required")
    
    if pr_number <= 0:
        raise HTTPException(status_code=400, detail="Invalid PR number")
    
    url = f"{GITHUB_API}/repos/{owner}/{repo}/pulls/{pr_number}/files"
    headers = {
        "Authorization": f"token {GITHUB_TOKEN}",
        "Accept": "application/vnd.github.v3+json"
    }
    
    try:
        response = requests.get(url, headers=headers, timeout=10)
        
        # Debug logging
        print(f"GitHub API Response Status: {response.status_code}")
        if response.status_code != 200:
            print(f"GitHub API Error Response: {response.text}")
        
        response.raise_for_status()
        return response.json()
    except requests.exceptions.Timeout:
        raise HTTPException(status_code=504, detail="GitHub API request timed out")
    except requests.exceptions.HTTPError as e:
        if response.status_code == 404:
            raise HTTPException(status_code=404, detail="PR not found")
        elif response.status_code == 401:
            raise HTTPException(status_code=401, detail="Invalid GitHub token")
        elif response.status_code == 403:
            raise HTTPException(status_code=403, detail="GitHub API rate limit exceeded")
        else:
            raise HTTPException(status_code=500, detail=f"GitHub API error: {str(e)}")
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Unexpected error: {str(e)}")