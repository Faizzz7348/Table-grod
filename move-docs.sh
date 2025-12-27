#!/bin/bash

# Move all .md files except README.md to docs folder
for file in *.md; do
    if [ "$file" != "README.md" ]; then
        git mv "$file" docs/
    fi
done

echo "✅ All documentation files moved to docs/ folder"
