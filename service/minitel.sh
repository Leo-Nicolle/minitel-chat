#!/bin/bash
SDA= cat /tmp/minitel-plugged.txt
MNT=''
while [ ${#SDA} -lt 1 ]
do
  SDA=$(cat /tmp/minitel-plugged.txt)
  sleep 1
done
sudo rm /tmp/minitel-plugged.txt
sudo /sbin/mgetty -br ttyUSB0 4800v23


