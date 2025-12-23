#!/usr/bin/env python3
"""
Replace all 'darkMode' with 'isDark' in FlexibleScrollDemo.jsx
Run this script: python3 replace_darkmode.py
"""

filepath = '/workspaces/Table-grod/src/FlexibleScrollDemo.jsx'

print("Reading file...")
with open(filepath, 'r', encoding='utf-8') as f:
    content = f.read()

print(f"Before: {content.count('darkMode')} occurrences of 'darkMode'")

# Simple replacement
content = content.replace('darkMode', 'isDark')

print(f"After: {content.count('darkMode')} occurrences remaining")
print(f"Now have: {content.count('isDark')} occurrences of 'isDark'")

print("Writing file...")
with open(filepath, 'w', encoding='utf-8') as f:
    f.write(content)

print("✅ Done! All 'darkMode' replaced with 'isDark'")
