#!/usr/bin/env bash

# creates extension's zip in working directory

SCRIPT_DIR=$( cd -- "$( dirname -- "${BASH_SOURCE[0]}" )" &> /dev/null && pwd )
EXTENSION_NAME="right-click-next@derVedro"
OLD_PWD="$PWD"

rm "$EXTENSION_NAME".zip 2>/dev/null
cd "$SCRIPT_DIR/$EXTENSION_NAME"
zip "$OLD_PWD/$EXTENSION_NAME".zip metadata.json extension.js
