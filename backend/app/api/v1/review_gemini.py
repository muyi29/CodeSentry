import os
import google.generativeai as genai
from fastapi import HTTPException
from dotenv import load_dotenv
import json

# Load environment variables
load_dotenv()

# Check which AI provider to use
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")
MOCK_MODE = os.getenv("MOCK_MODE", "false").lower() == "true"

# Configure Gemini
if GEMINI_API_KEY:
    genai.configure(api_key=GEMINI_API_KEY)

def analyze_code(diff: str, filename: str) -> dict:
    """
    Analyze code diff using Google Gemini API or mock response.
    
    Args:
        diff: The code diff to analyze
        filename: Name of the file being analyzed
        
    Returns:
        Dictionary containing analysis results
        
    Raises:
        HTTPException: If Gemini API request fails
    """
    if not diff or not diff.strip():
        return {
            "quality": "No changes to review",
            "security": [],
            "performance": [],
            "best_practices": [],
            "severity": "low"
        }
    
    # Mock mode for testing
    if MOCK_MODE:
        print(f"⚠️  MOCK MODE: Returning fake review for {filename}")
        return {
            "quality": f"This is a mock review for {filename}. The code changes look reasonable with good structure and readability. Consider adding more comments for complex logic.",
            "security": ["Consider validating input parameters", "Ensure proper error handling for edge cases"],
            "performance": ["Consider caching frequently accessed data", "Review algorithm complexity for large datasets"],
            "best_practices": ["Add unit tests for new functionality", "Update documentation to reflect changes"],
            "severity": "low"
        }
    
    # Use Gemini API
    if not GEMINI_API_KEY:
        raise HTTPException(
            status_code=500,
            detail="GEMINI_API_KEY not configured. Get one free at https://aistudio.google.com/app/apikey"
        )
    
    try:
        # Use Gemini 1.5 Flash (fast and free!)
        model = genai.GenerativeModel('gemini-1.5-flash')
        
        prompt = f"""You are an expert code reviewer. Analyze this code diff for the file: {filename}

Respond with a JSON object containing:
- "quality": Brief code quality assessment (2-3 sentences)
- "security": Array of security concerns (empty array if none)
- "performance": Array of performance improvement suggestions (empty array if none)
- "best_practices": Array of best practice recommendations (empty array if none)
- "severity": Overall severity level - must be exactly one of: "low", "medium", "high", or "critical"

Code diff:
```
{diff}
```

Respond ONLY with valid JSON, no markdown code blocks, no additional text."""

        response = model.generate_content(
            prompt,
            generation_config=genai.types.GenerationConfig(
                temperature=0.3,
                max_output_tokens=1000,
            )
        )
        
        content = response.text.strip()
        
        # Remove markdown code blocks if present
        if content.startswith("```json"):
            content = content[7:]
        if content.startswith("```"):
            content = content[3:]
        if content.endswith("```"):
            content = content[:-3]
        content = content.strip()
        
        # Parse JSON response
        try:
            result = json.loads(content)
            # Ensure all required fields exist
            if "quality" not in result:
                result["quality"] = "Code analysis completed"
            if "security" not in result:
                result["security"] = []
            if "performance" not in result:
                result["performance"] = []
            if "best_practices" not in result:
                result["best_practices"] = []
            if "severity" not in result or result["severity"] not in ["low", "medium", "high", "critical"]:
                result["severity"] = "low"
            
            print(f"✅ Successfully analyzed {filename}")
            return result
            
        except json.JSONDecodeError as e:
            print(f"⚠️  JSON parsing failed for {filename}, using fallback response")
            print(f"Raw content: {content[:200]}...")
            return {
                "quality": content if len(content) < 500 else content[:500] + "...",
                "security": [],
                "performance": [],
                "best_practices": [],
                "severity": "low"
            }
            
    except Exception as e:
        print(f"Gemini API Error: {type(e).__name__}: {str(e)}")
        raise HTTPException(
            status_code=500, 
            detail=f"Gemini API error: {str(e)}"
        )