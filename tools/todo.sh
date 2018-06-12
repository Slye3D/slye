#!/bin/bash
git ls-files | grep -v "todo.sh" | grep -v "json" | xargs grep "TODO" --line-number -i
