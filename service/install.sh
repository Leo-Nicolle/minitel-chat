#!/bin/bash

path=$(pwd)
cat play-usb-movies.template | sed "s|PATH|$path|g" > minitel.rules
cat service.template | sed "s|PATH|$path|g" > minitel.service
sudo ln -s  "$path/minitel.service" /lib/systemd/system/
sudo ln -s "$path/minitel.rules" /etc/udev/rules.d/
sudo udevadm control --reload
sudo systemctl daemon-reload
sudo systemctl enable minitel.service
sudo systemctl start minitel.service