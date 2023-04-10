pkill -f "tun2socks"
ip tuntap del dev tun0 mode tun
# ip route del $xray_ip via $def_gate
