#!/usr/bin/env python3
"""
Script to replace all darkMode references with isDark in FlexibleScrollDemo.jsx
"""

import re

def clean_darkmode_references(filepath):
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # Count occurrences before
    count_before = content.count('darkMode')
    print(f"Found {count_before} occurrences of 'darkMode'")
    
    # Replace darkMode with isDark
    content = content.replace('darkMode', 'isDark')
    
    # Fix the duplicate check editor call - remove isDark prop
    content = re.sub(
        r'return <DuplicateCheckEditor options=\{options\} allData=\{dialogData\} field="code" isDark=\{isDark\} />;',
        'return <DuplicateCheckEditor options={options} allData={dialogData} field="code" />;',
        content
    )
    
    # Count after
    count_after = content.count('darkMode')
    print(f"After replacement: {count_after} occurrences remain")
    print(f"Replaced {count_before - count_after} references")
    
    # Write back
    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(content)
    
    print(f"✅ File updated successfully!")
    
if __name__ == '__main__':
    filepath = '/workspaces/Table-grod/src/FlexibleScrollDemo.jsx'
    clean_darkmode_references(filepath)
