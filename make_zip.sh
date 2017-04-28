#!/usr/bin/env bash
glib-compile-schemas rcd\@criztovyl.space/schemas
rm rcd\@criztovyl.space.zip 
pushd >/dev/null rcd@criztovyl.space
zip ../rcd\@criztovyl.space.zip . -r
popd >/dev/null
