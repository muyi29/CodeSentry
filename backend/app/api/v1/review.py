import os
from openai import OpenAI
from fastapi import HTTPException

# Initialize OpenAI client
api_key = os.getenv("OPENAI_API_KEY")
if not api_key:
    raise ValueError("OPENAI_API_KEY environment variable is not set")

client = OpenAI(api_key=api_key)

def analyze_code(diff: str, filename: str) -> dict:
    """
    Analyze code diff using OpenAI API.
    
    Args:
        diff: The code diff to analyze
        filename: Name of the file being analyzed
        
    Returns:
        Dictionary containing analysis results
        
    Raises:
        HTTPException: If OpenAI API request fails
    """
    if not diff or not diff.strip():
        return {
            "quality": "No changes to review",
            "security": [],
            "performance": [],
            "best_practices": []
        }
    
    prompt = f"""
You are an expert code reviewer. Analyze the following code diff for the file: {filename}

Provide a structured review in JSON format with these sections:
1. "quality": Overall code quality assessment (2-3 sentences)
2. "security": List of security concerns (array of strings, empty if none)
3. "performance": List of performance improvement suggestions (array of strings, empty if none)
4. "best_practices": List of best practice recommendations (array of strings, empty if none)
5. "severity": Overall severity level ("low", "medium", "high", or "critical")

Code diff:
{diff}

Respond ONLY with valid JSON, no markdown formatting.
"""

    try:
        response = client.chat.completions.create(
            model="gpt-4o-mini",
            messages=[
                {"role": "system", "content": "You are an expert code reviewer. Always respond with valid JSON."},
                {"role": "user", "content": prompt}
            ],
            temperature=0.3,
            max_tokens=1000
        )
        
        content = response.choices[0].message.content
        
        # Try to parse as JSON, fallback to plain text
        import json
        try:
            return json.loads(content)
        except json.JSONDecodeError:
            return {
                "quality": content,
                "security": [],
                "performance": [],
                "best_practices": [],
                "severity": "low"
            }
            
    except Exception as e:
        raise HTTPException(
            status_code=500, 
            detail=f"OpenAI API error: {str(e)}"
        )