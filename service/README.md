# Play USB videos
This a linux service to automatically play videos on a USB key when plugged. 
Usefull if you have a Raspberry PI and a videoprojector, and you just want to play a list of movies for a night.

# How to install ? 

**With bash** 
```bash
./install
```
**with npm**
```bash
npm install
```

# How to uninstall ? 

**With bash** 
```bash
./uninstall
```
**with npm**
```bash
npm run uninstall
```


## About

I think it is a bit dirty, I would like to improve a few points but I don't know how. (Not a linux expert)

 - In hook: I just write the name of the node in a tmp file, I would like to run directly my program, but udev does not allow it
 - In play-usb service: I am in a daemon program and I need to run vlc as non root, so I take the logged in user and run vlc, but it forces me to specify -x11 and screen, I would like to run it from the user full context. Not sure I understand the issue fully. 
 - Also I dont like my loop to check that a USB has been pluged and then to check if it is mounted, I would like a aanother way of doing it.  