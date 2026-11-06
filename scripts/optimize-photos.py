#!/usr/bin/env python3
"""Prépare les photos du site : recadrage 4:5, 640x800, WebP léger.

Usage : python3 scripts/optimize-photos.py
  - déposez vos photos dans photos-source/ ; le nom du fichier = identifiant du produit
    (ex. photos-source/miel-de-manuka.jpg). Voir docs/PHOTOS.md pour la liste.
  - le résultat est écrit dans public/assets/photos/<identifiant>.webp (cible : 60 Ko maximum).
Aucune photo : le site affiche l'illustration colorée du produit.
"""
import io, sys
from pathlib import Path
from PIL import Image, ImageOps

SRC = Path(__file__).resolve().parent.parent / 'photos-source'
DST = Path(__file__).resolve().parent.parent / 'public' / 'assets' / 'photos'
W, H, MAX_KB = 640, 800, 60
EXT = {'.jpg', '.jpeg', '.png', '.webp'}

def encode(img):
    for q in (74, 68, 62, 56, 50, 45):
        buf = io.BytesIO(); img.save(buf, 'WEBP', quality=q, method=6)
        if buf.tell() <= MAX_KB * 1024: break
    return buf.getvalue(), q

def main():
    if not SRC.is_dir():
        sys.exit('Dossier photos-source/ introuvable.')
    DST.mkdir(parents=True, exist_ok=True)
    files = sorted(f for f in SRC.iterdir() if f.suffix.lower() in EXT)
    if not files: sys.exit('Aucune photo dans photos-source/.')
    for f in files:
        img = ImageOps.exif_transpose(Image.open(f)).convert('RGB')
        img = ImageOps.fit(img, (W, H), method=Image.LANCZOS, centering=(0.5, 0.5))
        data, q = encode(img)
        (DST / (f.stem + '.webp')).write_bytes(data)
        flag = '' if len(data) <= MAX_KB * 1024 else '  ⚠ au-dessus de la cible'
        print(f'{f.name} → {f.stem}.webp  {len(data)/1024:.0f} Ko (qualité {q}){flag}')

main()
