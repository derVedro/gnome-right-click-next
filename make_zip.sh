#!/usr/bin/env bash

# creates zip with extension in working directory

SCRIPT_DIR=$( cd -- "$( dirname -- "${BASH_SOURCE[0]}" )" &> /dev/null && pwd )
EXTENSION_NAME="right-click-next@derVedro"
OLD_PWD="$PWD"

rm "$EXTENSION_NAME".zip 2>/dev/null
cd "$SCRIPT_DIR"
zip "$OLD_PWD/$EXTENSION_NAME".zip "$EXTENSION_NAME"/metadata.json "$EXTENSION_NAME"/extension.js

