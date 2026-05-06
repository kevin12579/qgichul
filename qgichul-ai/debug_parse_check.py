"""새 파서 검증."""
import sys, io
sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding="utf-8", errors="replace")
sys.path.insert(0, ".")
from routers.pdf_parser import _parse_main_pdf, _parse_explanations

teacher = open(r"C:/Users/kevin/Downloads/정보처리산업기사20200822(교사용).pdf", "rb").read()
expl    = open(r"C:/Users/kevin/Downloads/정보처리산업기사20200822(해설집).pdf", "rb").read()

print("=== 해설 dict 추출 ===")
expl_map = _parse_explanations(expl)
print(f"총 해설 수: {len(expl_map)}")
for k in sorted(expl_map.keys())[:3]:
    print(f"  Q{k}: {expl_map[k][:100]}...")

print("\n=== 교사용 + 해설 머지 ===")
subjects = _parse_main_pdf(teacher, expl_map)
total_q = sum(len(s.questions) for s in subjects)
print(f"과목 수: {len(subjects)}, 총 문제 수: {total_q}")
for s in subjects:
    print(f"\n[{s.order_num}] {s.name!r} - 문제 {len(s.questions)}개")
    for q in s.questions[:2]:
        print(f"  Q{q.question_num}: {q.content[:70]}")
        print(f"    보기={len(q.choices)} | 정답={q.correct_answer} | 해설={'O' if q.explanation else 'X'}")
        for c in q.choices:
            print(f"    {c.choice_num}) {c.content[:50]}")

# 정답 분포 검증 (모두 1이면 fallback에 걸린 것)
print("\n=== 정답 분포 ===")
from collections import Counter
ans = Counter()
for s in subjects:
    for q in s.questions:
        ans[q.correct_answer] += 1
print(dict(ans))

# 해설 매칭률
matched = sum(1 for s in subjects for q in s.questions if q.explanation)
print(f"\n해설 매칭: {matched} / {total_q}")
