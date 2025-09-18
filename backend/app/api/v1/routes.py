from fastapi import APIRouter
from app.api.v1.github import get_pr_files
from app.api.v1.review import analyze_code

router = APIRouter()

@router.get("/review/{owner}/{repo}/{pr_number}")
def review_pr(owner: str, repo: str, pr_number: int):
    files = get_pr_files(owner, repo, pr_number)
    all_reviews = []

    for file in files:
        diff = file.get("patch", "")
        if diff:
            review = analyze_code(diff)
            all_reviews.append({
                "filename": file["filename"],
                "review": review
            })

    return {"reviews": all_reviews}
