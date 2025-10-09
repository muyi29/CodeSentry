from fastapi import APIRouter, HTTPException
from app.api.v1.github import get_pr_files
from app.api.v1.review_gemini import analyze_code  # Using Gemini now!
from typing import List, Dict
import asyncio
from concurrent.futures import ThreadPoolExecutor

router = APIRouter()

executor = ThreadPoolExecutor(max_workers=5)

@router.get("/review/{owner}/{repo}/{pr_number}")
async def review_pr(owner: str, repo: str, pr_number: int):
    """
    Review a GitHub pull request using AI.
    
    Args:
        owner: Repository owner
        repo: Repository name
        pr_number: Pull request number
        
    Returns:
        Dictionary containing reviews for each file
    """
    try:
        # Fetch PR files
        files = get_pr_files(owner, repo, pr_number)
        
        if not files:
            return {
                "status": "success",
                "message": "No files to review in this PR",
                "reviews": []
            }
        
        # Filter files with patches and limit to prevent abuse
        files_to_review = [f for f in files if f.get("patch")][:20]  # Max 20 files
        
        if not files_to_review:
            return {
                "status": "success",
                "message": "No code changes to review",
                "reviews": []
            }
        
        # Process reviews in parallel
        all_reviews = []
        loop = asyncio.get_event_loop()
        
        tasks = []
        for file in files_to_review:
            diff = file.get("patch", "")
            filename = file["filename"]
            task = loop.run_in_executor(executor, analyze_code, diff, filename)
            tasks.append((filename, file.get("additions", 0), file.get("deletions", 0), task))
        
        # Wait for all reviews to complete
        for filename, additions, deletions, task in tasks:
            try:
                review = await task
                all_reviews.append({
                    "filename": filename,
                    "additions": additions,
                    "deletions": deletions,
                    "review": review
                })
            except Exception as e:
                all_reviews.append({
                    "filename": filename,
                    "additions": additions,
                    "deletions": deletions,
                    "review": {
                        "quality": f"Error analyzing file: {str(e)}",
                        "security": [],
                        "performance": [],
                        "best_practices": [],
                        "severity": "low"
                    }
                })
        
        return {
            "status": "success",
            "total_files": len(files_to_review),
            "reviews": all_reviews
        }
        
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/health")
async def health_check():
    """Health check endpoint"""
    return {"status": "healthy"}