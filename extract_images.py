"""
Mengeluarkan gambar base64 dari file HTML lama ke folder images/.

Cara pakai (dari folder portfolio):
    python extract_images.py index_lama.html

Urutan gambar di file lama:
    1. Distribution Performance Dashboard -> images/project-distribution.jpg
    2. Driver Violation Tracking System   -> images/project-violation.jpg
    3. Clinic Management System           -> images/project-clinic.jpg
"""
import base64
import os
import re
import sys

NAMES = ["project-distribution.jpg", "project-violation.jpg", "project-clinic.jpg"]

if len(sys.argv) != 2:
    sys.exit("Pakai: python extract_images.py <file_html_lama>")

with open(sys.argv[1], encoding="utf-8") as f:
    html = f.read()

matches = re.findall(r"data:image/(?:jpeg|jpg|png);base64,([A-Za-z0-9+/=]+)", html)
if not matches:
    sys.exit("Tidak ada gambar base64 ditemukan.")

os.makedirs("images", exist_ok=True)
for name, data in zip(NAMES, matches):
    path = os.path.join("images", name)
    with open(path, "wb") as out:
        out.write(base64.b64decode(data))
    print("Tersimpan:", path)
