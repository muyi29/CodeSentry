import requests
import os

GITHUB_TOKEN = os.getenv("GITHUB_TOKEN")
GITHUB_API = "https://api.github.com"

def get_pr_files(owner: str, repo: str, pr_number: int):
    url = f"{GITHUB_API}/repos/{owner}/{repo}/pulls/{pr_number}/files"
    headers = {"Authorization": f"token {GITHUB_TOKEN}"}
    response = requests.get(url, headers=headers)
    return response.json()
