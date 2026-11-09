# Bootstrap the next approved discipline

You are building a draft trunk for the user-approved discipline `{{NEXT_NAME}}` (`{{NEXT_ID}}`).

- Date: `{{TODAY}}`
- Batch: `{{BATCH}}` of 3
- Maximum changed or added nodes: `3`
- Draft file: `data/discipline-drafts/{{NEXT_ID}}.json`

Read `docs/README-disciplines.md`, `data/discipline-roadmap.json`, the semiconductor example, and the discipline validator before editing.

Hard rules:

1. Edit only the draft file above. Do not touch `knowledge-bases/`, the current discipline, task ledgers, pages, indexes, or logs.
2. If the draft does not exist, create the required top-level schema with all four branch dimensions in `blank_dimensions`, an empty `neighbors` array, and up to three verified trunk nodes.
3. If it exists, preserve every existing node and append exactly three trunk nodes to the chain. Never exceed nine trunk nodes.
4. Research each node on the live web. Every node must be `verified`, include at least one opened authoritative source, and state exactly what that source supports. Never invent a source or URL.
5. Trunk nodes require non-empty `old_approach`, `bottleneck`, and `new_concept`. Keep `core_problem` and every `summary` within 40 Chinese characters.
6. `detail_page` may link only to a repository file that actually exists; otherwise use `null`.
7. The first trunk node has `parent=null`; every appended trunk node points to the immediately preceding trunk node.
8. Do not commit or push. The outer transition worker validates the node delta and owns publication.
