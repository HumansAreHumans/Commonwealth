#!/bin/sh

find public/img/ui -iname '*.json' -print0 | xargs -0 sed -i -e 's/C:\\\\Users\\\\lawton\\\\Desktop\\\\raspberry\\\\public\\\\img\\\\ui/./'
