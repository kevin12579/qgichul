"""컬럼 분리 추출 검증"""
import sys, io, pdfplumber
sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding="utf-8", errors="replace")

path = r"C:/Users/kevin/Downloads/정보처리산업기사20200822(교사용).pdf"

with pdfplumber.open(path) as pdf:
    page = pdf.pages[0]
    w = page.width
    h = page.height
    print(f"페이지 크기: {w} x {h}")
    left = page.crop((0, 0, w / 2, h)).extract_text() or ""
    right = page.crop((w / 2, 0, w, h)).extract_text() or ""
    print("\n--- LEFT ---")
    print(left[:2000])
    print("\n--- RIGHT ---")
    print(right[:2000])
