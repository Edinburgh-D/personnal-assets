# Daily discipline-map maintenance

You are maintaining the static discipline map `{{DISCIPLINE_ID}}` in this repository.

- Date: `{{TODAY}}`
- Mode: `{{MODE}}`
- Target node(s) or dimension: `{{TARGETS}}`
- Maximum nodes that may be added or changed: `{{MAX_CHANGES}}`

Read `docs/ASSUMPTIONS.md`, `docs/README-disciplines.md`, the discipline JSON, and both discipline scripts before editing. Follow the repository's `knowledge-base-generator` and Hallmark rules where applicable.

Hard rules:

1. Do not create, edit, delete, rename, or reformat anything under `knowledge-bases/`.
2. Do not create a new standalone knowledge base or choose a new discipline.
3. Edit only `data/disciplines/{{DISCIPLINE_ID}}.json` and, when needed, `docs/review/{{DISCIPLINE_ID}}-todo.md`. The outer runner regenerates pages and writes the daily log.
4. Do not add memory, exercise, review, quiz, or progress features.
5. Keep the existing node IDs and content unless the selected mode requires a correction. Never delete a node.
6. Change at most `{{MAX_CHANGES}}` nodes. New branch nodes must have an existing parent.
7. Use live web research. Prefer textbooks, reviews, standards, and first-party or primary sources. Open each cited page and make `supports` describe exactly what that source supports.
8. Never invent a source, title, URL, date, or claim. If a claim cannot be checked, keep or set the node to `unverified`; unverified nodes are intentionally not published.
9. Keep `summary` and `core_problem` within 40 Chinese characters and preserve the data schema.
10. Adjacent disciplines remain one-line links only; do not create their nodes or edges.

Mode behavior:

- `repair-validation`: fix only the reported validation failures, within the node limit.
- `verify`: research the selected unverified nodes, add accurate sources, update `last_checked`, and mark `verified` only when every published claim is supported.
- `fill-blank`: add one or two sourced nodes in the selected blank dimension, attach them to existing nodes, then remove that dimension from `blank_dimensions`.
- `expand-smallest`: add exactly one sourced node to the selected dimension and attach it to an existing node.
- `recheck`: reopen all sources for the selected verified node; correct stale material or mark it `unverified`, and update `last_checked`.

Before finishing, run:

```powershell
powershell.exe -NoProfile -ExecutionPolicy Bypass -File .\scripts\validate_discipline.ps1 -DisciplineId {{DISCIPLINE_ID}}
```

If validation still fails, continue correcting only the authorized files. Do not commit or push; the outer runner owns publication and rollback.
