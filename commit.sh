#!/bin/bash
git add src/FlexibleScrollDemo.jsx
git commit -m "Fix QL Kitchen image and power mode sync across flex tables

- Update handleSaveImages to sync frozen row images to global state
- Update handleSavePowerMode to sync frozen row power mode to global state
- Images and power mode changes in QL Kitchen now persist across all flex tables"
git push
