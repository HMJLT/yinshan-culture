from __future__ import annotations

import argparse
import json
import mimetypes
from http import HTTPStatus
from http.server import BaseHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path
from urllib.parse import parse_qs, unquote, urlparse


ROOT_DIR = Path(__file__).resolve().parent
STATIC_DIR = ROOT_DIR / "static"
DATA_PATH = ROOT_DIR / "data" / "site_data.json"

mimetypes.add_type("text/css; charset=utf-8", ".css")
mimetypes.add_type("application/javascript; charset=utf-8", ".js")
mimetypes.add_type("application/json; charset=utf-8", ".json")
mimetypes.add_type("image/svg+xml", ".svg")


def load_data() -> dict:
    with DATA_PATH.open("r", encoding="utf-8") as data_file:
        return json.load(data_file)


def localized(value, lang: str):
    if isinstance(value, dict):
        return value.get(lang) or value.get("zh") or next(iter(value.values()), "")
    return value


def normalize(text: str) -> str:
    return (text or "").strip().lower()


def search_records(data: dict, query: str, lang: str) -> list[dict]:
    query_norm = normalize(query)
    if not query_norm:
        return []

    records: list[dict] = []

    def add_record(kind: str, item: dict):
        title = localized(item.get("title") or item.get("name") or item.get("era"), lang)
        summary = localized(item.get("summary") or item.get("description") or item.get("story"), lang)
        tags = item.get("tags", [])
        haystack = " ".join(
            [
                str(title),
                str(summary),
                " ".join(tags),
                localized(item.get("period", ""), lang),
                localized(item.get("location", ""), lang),
            ]
        ).lower()
        score = haystack.count(query_norm) * 5
        for token in query_norm.split():
            if token and token in haystack:
                score += 1
        if score:
            records.append(
                {
                    "id": item.get("id", title),
                    "type": kind,
                    "title": title,
                    "summary": summary,
                    "image": item.get("image", ""),
                    "score": score,
                }
            )

    for timeline_item in data.get("timeline", []):
        add_record("timeline", timeline_item)
    for site in data.get("map_sites", []):
        add_record("map", site)
    for resource in data.get("resources", []):
        add_record("resource", resource)
    for card in data.get("civilization_cards", []):
        add_record("civilization", card)
    for card in data.get("heritage_cards", []):
        add_record("heritage", card)

    records.sort(key=lambda row: row["score"], reverse=True)
    return records[:8]


def answer_question(data: dict, message: str, lang: str) -> dict:
    query = normalize(message)
    knowledge = data.get("knowledge", {}).get(lang, data.get("knowledge", {}).get("zh", []))

    for entry in knowledge:
        for keyword in entry.get("keywords", []):
            if normalize(keyword) in query:
                return {
                    "answer": entry["answer"],
                    "matched": keyword,
                    "related": search_records(data, keyword, lang)[:3],
                }

    related = search_records(data, message, lang)[:3]
    if related:
        lead = "我找到了一些相关线索：" if lang == "zh" else "I found several related clues:"
        joined = "；".join(item["title"] for item in related)
        return {"answer": f"{lead}{joined}。", "matched": "", "related": related}

    fallback = (
        "这个问题暂时没有进入示范知识库。你可以换成“阴山岩画”“那达慕”“赵长城”“草原丝路”等关键词继续探索。"
        if lang == "zh"
        else "This question is not in the demo knowledge base yet. Try keywords such as rock art, Naadam, Great Wall, or Silk Road."
    )
    return {"answer": fallback, "matched": "", "related": []}


class YinshanHandler(BaseHTTPRequestHandler):
    server_version = "YinshanCulture/1.0"

    def end_headers(self):
        self.send_header("Access-Control-Allow-Origin", "*")
        self.send_header("Access-Control-Allow-Methods", "GET, POST, OPTIONS")
        self.send_header("Access-Control-Allow-Headers", "Content-Type")
        super().end_headers()

    def do_OPTIONS(self):
        self.send_response(HTTPStatus.NO_CONTENT)
        self.end_headers()

    def do_GET(self):
        parsed = urlparse(self.path)
        path = unquote(parsed.path)
        params = parse_qs(parsed.query)

        if path in {"/", "/index.html"}:
            self.serve_file(STATIC_DIR / "index.html")
            return

        if path == "/api/health":
            self.send_json({"status": "ok", "service": "yinshan-culture-platform"})
            return

        if path == "/api/site":
            self.send_json(load_data())
            return

        if path == "/api/resources":
            data = load_data()
            category = params.get("category", [""])[0]
            resources = data.get("resources", [])
            if category:
                resources = [item for item in resources if item.get("category") == category]
            self.send_json({"resources": resources})
            return

        if path == "/api/search":
            data = load_data()
            query = params.get("q", [""])[0]
            lang = params.get("lang", ["zh"])[0]
            self.send_json({"query": query, "results": search_records(data, query, lang)})
            return

        if path in {"/culture", "/culture.html"}:
            self.serve_file(STATIC_DIR / "culture.html")
            return

        if path in {"/folk", "/folk.html"}:
            self.serve_file(STATIC_DIR / "folk.html")
            return

        if path in {"/map", "/map.html"}:
            self.serve_file(STATIC_DIR / "map.html")
            return

        if path.startswith("/static/"):
            self.serve_file(ROOT_DIR / path.lstrip("/"))
            return

        self.send_error(HTTPStatus.NOT_FOUND, "Not found")

    def do_POST(self):
        parsed = urlparse(self.path)
        if parsed.path != "/api/chat":
            self.send_error(HTTPStatus.NOT_FOUND, "Not found")
            return

        length = int(self.headers.get("Content-Length", "0"))
        raw_body = self.rfile.read(length).decode("utf-8") if length else "{}"
        try:
            body = json.loads(raw_body)
        except json.JSONDecodeError:
            self.send_error(HTTPStatus.BAD_REQUEST, "Invalid JSON")
            return

        message = str(body.get("message", ""))
        lang = str(body.get("lang", "zh"))
        self.send_json(answer_question(load_data(), message, lang))

    def send_json(self, payload: dict, status: HTTPStatus = HTTPStatus.OK):
        body = json.dumps(payload, ensure_ascii=False).encode("utf-8")
        self.send_response(status)
        self.send_header("Content-Type", "application/json; charset=utf-8")
        self.send_header("Content-Length", str(len(body)))
        self.end_headers()
        self.wfile.write(body)

    def serve_file(self, file_path: Path):
        try:
            resolved = file_path.resolve()
            root = ROOT_DIR.resolve()
            if root not in resolved.parents and resolved != root:
                self.send_error(HTTPStatus.FORBIDDEN, "Forbidden")
                return
            if not resolved.is_file():
                self.send_error(HTTPStatus.NOT_FOUND, "File not found")
                return

            content_type = mimetypes.guess_type(str(resolved))[0] or "application/octet-stream"
            body = resolved.read_bytes()
            self.send_response(HTTPStatus.OK)
            self.send_header("Content-Type", content_type)
            self.send_header("Content-Length", str(len(body)))
            self.end_headers()
            self.wfile.write(body)
        except OSError:
            self.send_error(HTTPStatus.INTERNAL_SERVER_ERROR, "Unable to read file")

    def log_message(self, format: str, *args):
        print(f"{self.address_string()} - {format % args}")


def main():
    parser = argparse.ArgumentParser(description="Run the Yinshan Civilization Corridor platform.")
    parser.add_argument("--host", default="127.0.0.1")
    parser.add_argument("--port", type=int, default=8000)
    args = parser.parse_args()

    server = ThreadingHTTPServer((args.host, args.port), YinshanHandler)
    print(f"Yinshan Civilization Corridor running at http://{args.host}:{args.port}")
    try:
        server.serve_forever()
    except KeyboardInterrupt:
        print("\nShutting down.")
    finally:
        server.server_close()


if __name__ == "__main__":
    main()
