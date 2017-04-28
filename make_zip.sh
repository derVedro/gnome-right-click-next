#!/usr/bin/env bash
glib-compile-schemas rcd\@criztovyl.space/schemas
rm rcd\@criztovyl.space.zip 
zip rcd\@criztovyl.space.zip rcd@criztovyl.space -r
