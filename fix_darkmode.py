#!/usr/bin/env python3
"""
Comprehensively replace all darkMode with isDark in JSX file
"""
import re

filepath = '/workspaces/Table-grod/src/FlexibleScrollDemo.jsx'

with open(filepath, 'r', encoding='utf-8') as f:
    content = f.read()

print(f"Original occurrences of 'darkMode': {content.count('darkMode')}")

# Replace all darkMode with isDark
content = content.replace('darkMode', 'isDark')

# Fix the DuplicateCheckEditor call - remove isDark prop completely
content = re.sub(
    r'<DuplicateCheckEditor options=\{options\} allData=\{dialogData\} field="code" isDark=\{isDark\} />',
    '<DuplicateCheckEditor options={options} allData={dialogData} field="code" />',
    content
)

print(f"After replacement occurrences of 'darkMode': {content.count('darkMode')}")
print(f"New occurrences of 'isDark': {content.count('isDark')}")

# Write back
with open(filepath, 'w', encoding='utf-8') as f:
    f.write(content)

print("✅ Successfully replaced all darkMode with isDark!")
