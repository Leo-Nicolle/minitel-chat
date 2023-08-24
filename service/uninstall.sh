#!/bin/bash
sudo systemctl stop minitel.service
sudo systemctl disable minitel.service
sudo rm "/lib/systemd/system/minitel.service"
sudo rm "/etc/udev/rules.d/minitel.rules"
rm minitel.rules
rm minitel.service
sudo udevadm control --reload