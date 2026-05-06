"""Debug: 세 가지 PDF의 raw 텍스트를 뽑아 형식을 확인."""
import sys, pdfplumber, os, io
sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding="utf-8", errors="replace")

paths = {
    "교사용": r"C:/Users/kevin/Downloads/정보처리산업기사20200822(교사용).pdf",
    "학생용": r"C:/Users/kevin/Downloads/정보처리산업기사20200822(학생용).pdf",
    "해설집": r"C:/Users/kevin/Downloads/정보처리산업기사20200822(해설집).pdf",
}

for label, path in paths.items():
    print("=" * 80)
    print(f"### {label}: {path}")
    print("=" * 80)
    with pdfplumber.open(path) as pdf:
        print(f"[페이지 수] {len(pdf.pages)}")
        for i, page in enumerate(pdf.pages[:3]):
            text = page.extract_text() or ""
            print(f"\n--- {label} page {i+1} ---")
            print(text[:3500])
        print(f"\n--- {label} 마지막 페이지 ---")
        last = pdf.pages[-1].extract_text() or ""
        print(last[:2500])
