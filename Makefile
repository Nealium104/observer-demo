URL  := http://localhost:5173
MAIN := frontend/src/main.js

.PHONY: help up down restart logs wait verify status scaffold stage-1 stage-2 reset

help:
	@echo ""
	@echo "  Stack"
	@echo "    make up         build + start the demo (detached)"
	@echo "    make down       stop it"
	@echo "    make restart    restart containers (no rebuild)"
	@echo "    make logs       tail both services"
	@echo "    make open       open $(URL)"
	@echo "    make verify     confirm frontend + API are answering"
	@echo ""
	@echo "  Stages  (discards live edits -- that is the point)"
	@echo "    make scaffold   -> main      Act 1 START (empty page)"
	@echo "    make stage-1    -> stage-1   Act 1 DONE  (scroll + debounce)"
	@echo "    make stage-2    -> stage-2   Act 3 DONE  (three observers)"
	@echo "    make reset      panic button: restore scaffold, stay on branch"
	@echo "    make status     where am I?"
	@echo ""
	@echo "    make tags       one-time: checkpoint tags for bail-outs"
	@echo ""

up:
	docker compose up -d
	@$(MAKE) --no-print-directory wait
	@echo "ready -> $(URL)"

down:
	docker compose down

restart:
	docker compose restart
	@$(MAKE) --no-print-directory wait

logs:
	docker compose logs -f --tail=50

wait:
	@echo "waiting for $(URL) ..."
	@timeout 60 bash -c 'until curl -sf $(URL) >/dev/null; do sleep 1; done' \
	  || { echo "TIMED OUT -- try: make logs"; exit 1; }

verify:
	@curl -sf $(URL) >/dev/null && echo "OK  frontend" || echo "DOWN  frontend"
	@curl -sf "$(URL)/api/items?page=1&pageSize=1" >/dev/null \
	  && echo "OK  api" || echo "DOWN  api"
	@node --check $(MAIN) && echo "OK  $(MAIN) parses"

scaffold:
	@git checkout -f main
	@echo ">> main -- Act 1 start (page renders nothing)"

stage-1:
	@git checkout -f stage-1
	@echo ">> stage-1 -- Act 1 done (scroll + debounce)"

stage-2:
	@git checkout -f stage-2
	@echo ">> stage-2 -- Act 3 done (three observers)"

reset:
	@git checkout -- $(MAIN)
	@echo ">> $(MAIN) restored on $$(git branch --show-current)"

status:
	@echo "branch: $$(git branch --show-current)"
	@git status --short $(MAIN) | grep -q . \
	  && echo "edits:  UNCOMMITTED in $(MAIN)" \
	  || echo "edits:  clean"
