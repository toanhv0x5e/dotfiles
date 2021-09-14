#!/bin/bash

_monitors=$(xrandr --query | grep '\bconnected\b' | awk '{ print $1 }' | wc -l)

EXTERNAL_OUTPUT="$(xrandr --query | grep '\bconnected\b' | awk '{ print $1 }' | tail -1)"
INTERNAL_OUTPUT="$(xrandr --query | grep '\bconnected\b' | awk '{ print $1 }' | head -1)"

#EXTERNAL_OUTPUT="HDMI-1"
#INTERNAL_OUTPUT="LVDS-1"

# if we don't have a file, start at zero
if [ ! -f "/tmp/monitor_mode.dat" ] ; then
  monitor_mode="all"

# otherwise read the value from the file
else
  monitor_mode=`cat /tmp/monitor_mode.dat`
fi

if [ $monitor_mode = "all" ]; then
        monitor_mode="EXTERNAL"
        xrandr --output $INTERNAL_OUTPUT --off --output $EXTERNAL_OUTPUT --auto
elif [ $monitor_mode = "EXTERNAL" ]; then
        monitor_mode="INTERNAL"
        xrandr --output $INTERNAL_OUTPUT --auto --output $EXTERNAL_OUTPUT --off
elif [ $monitor_mode = "INTERNAL" ]; then
        monitor_mode="CLONES"
        xrandr --output $INTERNAL_OUTPUT --auto --output $EXTERNAL_OUTPUT --auto --same-as $INTERNAL_OUTPUT
else
        monitor_mode="all"
        xrandr --output $INTERNAL_OUTPUT --auto --output $EXTERNAL_OUTPUT --auto --left-of $INTERNAL_OUTPUT
fi
echo "${monitor_mode}" > /tmp/monitor_mode.dat
