#!/bin/sh

mydir=`dirname $0`
lessc $mydir/site.less $mydir/site.css
ruby $mydir/../../blueprint/lib/compress.rb -p dynamics-viz --settings_file=$mydir/blueprint.settings.yml -o $mydir