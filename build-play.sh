#!/bin/sh
# Wraps the artifact source in a full HTML document so it runs by double-clicking play.html.
# (The artifact host adds this wrapper itself when publishing, so the source file stays without it.)
cd "$(dirname "$0")"
{
  printf '<!doctype html>\n<html lang="en"><head><meta charset="utf-8">\n<meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover">\n</head><body>\n'
  cat concrete-nocturne.html
  printf '</body></html>\n'
} > play.html
echo "Built play.html"
