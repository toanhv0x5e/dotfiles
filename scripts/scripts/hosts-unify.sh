#!/bin/bash
# This is cron task required run as root
[ $EUID -eq 0 ] || exit 1

cat /etc/hosts.d/*.conf > /etc/hosts
echo "# $(date) by $(whoami)" >> /etc/hosts

if [ $? -eq 0 ];
  then echo "success"
else echo "failed"
fi

