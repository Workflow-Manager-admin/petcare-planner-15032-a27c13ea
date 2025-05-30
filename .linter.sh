#!/bin/bash
cd /home/kavia/workspace/code-generation/petcare-planner-15032-a27c13ea/petcare_planner
npm run build
EXIT_CODE=$?
if [ $EXIT_CODE -ne 0 ]; then
   exit 1
fi

