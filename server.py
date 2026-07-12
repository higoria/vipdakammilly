from http.server import HTTPServer, SimpleHTTPRequestHandler
from socketserver import ThreadingMixIn
import sys

class ThreadingHTTPServer(ThreadingMixIn, HTTPServer):
    daemon_threads = True

if __name__ == '__main__':
    port = 8080
    server_address = ('', port)
    httpd = ThreadingHTTPServer(server_address, SimpleHTTPRequestHandler)
    print(f"Serving HTTP on port {port} (multithreaded)...", flush=True)
    try:
        httpd.serve_forever()
    except KeyboardInterrupt:
        print("\nShutting down server.", flush=True)
        httpd.server_close()
