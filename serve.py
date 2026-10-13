import http.server
import os
import socketserver
import sys

PORT = 8000
DIRECTORY = os.path.abspath(os.path.dirname(__file__))

class CustomHandler(http.server.SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=DIRECTORY, **kwargs)

    def do_GET(self):
        path = self.translate_path(self.path)
        if not os.path.exists(path):
            self.serve_404()
            return
        super().do_GET()

    def do_HEAD(self):
        path = self.translate_path(self.path)
        if not os.path.exists(path):
            self.serve_404(head_only=True)
            return
        super().do_HEAD()

    def serve_404(self, head_only=False):
        path_404 = os.path.join(DIRECTORY, "404.html")
        if os.path.exists(path_404):
            with open(path_404, "rb") as f:
                content = f.read()
            self.send_response(404)
            self.send_header("Content-Type", "text/html; charset=utf-8")
            self.send_header("Content-Length", str(len(content)))
            self.end_headers()
            if not head_only:
                self.wfile.write(content)
        else:
            self.send_error(404, "File not found")

class ReusableTCPServer(socketserver.TCPServer):
    allow_reuse_address = True

if __name__ == "__main__":
    with ReusableTCPServer(("127.0.0.1", PORT), CustomHandler) as httpd:
        print(f"Serving at http://127.0.0.1:{PORT}")
        sys.stdout.flush()
        try:
            httpd.serve_forever()
        except KeyboardInterrupt:
            pass
