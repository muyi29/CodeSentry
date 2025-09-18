import os
import openai

openai.api_key = os.getenv("OPENAI_API_KEY")

def analyze_code(diff: str):
    prompt = f"""
    You are an AI code reviewer. Analyze the following code diff and provide:
    1. Code quality issues
    2. Security vulnerabilities
    3. Performance improvements
    4. Best practices

    Code diff:
    {diff}
    """

    response = openai.ChatCompletion.create(
        model="gpt-4o-mini",  # or "gpt-4" if available
        messages=[{"role": "user", "content": prompt}]
    )

    return response["choices"][0]["message"]["content"]
