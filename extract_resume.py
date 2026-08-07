import PyPDF2
import sys
import json

with open('Resume.pdf', 'rb') as f:
    r = PyPDF2.PdfReader(f)
    pages = []
    for i, page in enumerate(r.pages):
        text = page.extract_text()
        pages.append({"page": i+1, "text": text})

with open('resume_data.json', 'w', encoding='utf-8') as out:
    json.dump(pages, out, ensure_ascii=False, indent=2)

print("Done! Saved to resume_data.json")
