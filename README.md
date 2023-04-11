# V2Box-Linux
V2Box is V2ray client for Linux with Xray-Core (Full Tunnel)

## Download On Ubuntu

1) Download .deb file from [Releases](https://github.com/hossinasaadi/V2Box-Linux/releases/latest) and run `sudo dpkg -i v2box-linux_x.x.x_amd64.deb` in terminal to install
2) copy config.json to config textarea
3) set your server IP or Domain 
4) Start Xray

## Info
~ your inbound settings will replace with tun2socks port (10808)

![Window](https://github.com/hossinasaadi/V2Box-Linux/raw/master/docs/window.png)


## :book: Pre-Requirements For Development

1) download your system tun2socks from https://github.com/xjasonlyu/tun2socks/releases/latest and put tun2socks to `/Tunnel/tun2socks`
2) download your system arch xray from https://github.com/XTLS/Xray-core/releases/latest and put xray to `/Tunnel/xray`
3) install electronJS
4) `npm start`



## TODO

1) support v2ray URI
2) a little more cleaner UI/UX :/
3) fix some bugs in darwin
