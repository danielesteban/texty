#!/bin/sh
for file in /usr/share/nginx/html/assets/*.js /usr/share/nginx/html/editor/assets/*.js
do
sed -E \
"s@__CLIENT__@$CLIENT@g; s@__EDITOR__@$EDITOR@g; s@__SERVER__@$SERVER@g" \
< "$file" | sponge "$file"
done
