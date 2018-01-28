#!/bin/sh

find public/img/ui -iname '*.json' -print0 | xargs -0 sed -i -e 's/C:\\\\Users\\\\lawton\\\\Desktop\\\\raspberry\\\\public\\\\img\\\\ui/./'
find public/img/planets -iname '*.json' -print0 | xargs -0 sed -i -e 's/C:\\\\Users\\\\lawton\\\\Desktop\\\\raspberry\\\\public\\\\img\\\\planets/./'
find public/img -iname '*.json' -print0 | xargs -0 sed -i -e 's/C:\\\\Users\\\\lawton\\\\Desktop\\\\raspberry\\\\public\\\\img/./'
