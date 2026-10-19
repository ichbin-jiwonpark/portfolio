# Jiwon Park — portfolio site

정적 사이트입니다. 빌드 과정이 없고, GitHub Pages에 그대로 올리면 됩니다.

## 주소 구조

| 주소 | 내용 |
|---|---|
| `/` | `/design/`으로 이동 |
| `/design/` | UX·디자인 공고용 링크 |
| `/product/` | PM 공고용 링크 |
| `/case/?p=aml&v=product` | 케이스 스터디 (`p` = 파일 이름, `v` = 돌아갈 뷰) |

## 내용 고치기 (코드는 건드리지 않아도 됩니다)

모든 글은 `content/` 폴더에 있습니다. GitHub 웹에서 파일을 열고 연필 아이콘으로 고친 뒤 "Commit changes"를 누르면 1–2분 뒤 사이트에 반영됩니다.

**`content/site.md`** — 이름, 연락처, CV, 첫 화면 문장, 프로젝트 순서, About
- `email:`, `phone:`, `linkedin:` 뒤에 값을 넣으면 하단에 나타납니다. 비워두면 숨겨집니다.
- `cv_design:` / `cv_product:` 에 `cv/CV_UX.pdf`처럼 파일 경로를 넣으면 뷰별 CV 다운로드 버튼이 생깁니다. PDF는 `cv/` 폴더에 올립니다. (경로는 `content/` 기준이 아니라 사이트 기준으로 `../cv/CV_UX.pdf`처럼 씁니다)
- 순서 바꾸기: `design_studies: poom, bookiverse` 처럼 쉼표로 나열된 파일 이름의 순서를 바꿉니다. 빼면 그 뷰에서 숨겨집니다.
- `---` 아래의 글이 About입니다.

**`content/cases/<이름>.md`** — 프로젝트 하나에 파일 하나
- 위쪽 `---` 사이: 제목, 카드 제목, 연도, 뷰별 카드 요약(`summary_design`, `summary_product`), Role/Team/Timeline 등
- `image: images/aml/cover.png` 를 넣으면 카드와 케이스 상단에 대표 이미지가 나옵니다. 이미지는 `content/images/` 아래에 올립니다.
- `status: draft` 가 있으면 "Draft" 표시가 붙습니다. 완성되면 이 줄을 지웁니다.
- 본문: `## 제목`이 섹션이 됩니다. 이미지는 `![설명](images/aml/step-1.png)` 한 줄로 넣습니다.
- **`[대괄호 글]`은 노란색으로 표시됩니다.** 아직 채워야 할 곳이라는 뜻입니다. 공개 전에 모두 없어야 합니다.
- 본문이 비어 있는 프로젝트(ALIXIR, YeaY)는 카드만 나오고 클릭되지 않습니다.

새 프로젝트를 넣으려면 `content/cases/`에 파일을 하나 만들고, `site.md`의 목록에 파일 이름을 추가합니다.

## 배포 (GitHub Pages)

1. GitHub에서 새 저장소를 만듭니다 (예: `portfolio`, Public).
2. 이 폴더 안의 파일을 전부 업로드합니다 (`.nojekyll` 포함).
3. Settings → Pages → Branch: `main`, 폴더 `/ (root)` → Save.
4. 주소: `https://<아이디>.github.io/portfolio/design/` 와 `/product/`.

로컬에서 확인할 때는 파일을 더블클릭하지 말고 이 폴더에서 `python3 -m http.server`를 실행한 뒤 `http://localhost:8000/design/`을 엽니다.
