import os
from google import genai
from fastapi import HTTPException
from dotenv import load_dotenv
import json

# Load environment variables
load_dotenv()

# Check which AI provider to use
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")
MOCK_MODE = os.getenv("MOCK_MODE", "false").lower() == "true"

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
        # Create Gemini client (uses GEMINI_API_KEY env var)
        client = genai.Client(api_key=GEMINI_API_KEY)
        
        prompt = f"""You are a senior software engineer conducting a thorough code review for: {filename}

Analyze this code diff in detail. Be specific about what changed and why it matters.

**Instructions:**
- Reference actual variable names, function names, and specific code patterns from the diff
- Explain the impact of the changes, not just what they are
- If the change is small, still provide thoughtful analysis of edge cases, potential bugs, or improvements
- Be critical but constructive
- Don't be generic - analyze THIS specific code change

**Code diff:**
```
{diff}
```

**Respond with a JSON object:**
{{
  "quality": "Detailed assessment referencing specific code elements. Explain what changed, why it matters, and potential issues. 3-5 sentences minimum.",
  "security": ["Specific security concerns with technical details", "Reference actual code if vulnerabilities exist"],
  "performance": ["Specific performance impacts with technical reasoning", "Mention algorithmic complexity if relevant"],
  "best_practices": ["Concrete suggestions referencing the actual code", "Modern patterns or standards that could improve this"],
  "severity": "low|medium|high|critical"
}}

Respond ONLY with valid JSON."""

        response = client.models.generate_content(
            model="gemini-2.0-flash-exp",  # Using latest Gemini 2.0 Flash
            contents=prompt,
            config={
                "temperature": 0.4,  # Slightly higher for more detailed analysis
                "max_output_tokens": 2048,  # Allow longer responses
            }
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