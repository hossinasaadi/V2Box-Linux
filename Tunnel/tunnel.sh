#!/bin/bash

#variables
host_name=$1
xray_ip=$(dig +short $host_name) 
def_gate=$(ip r | grep 'default' | awk '{print$3}') # This will output your default gateway ip address . if command fails try finding the deault gateway ip by using 'ip r' command

ip tuntap del dev tun0 mode tun user $USER
ip route del $xray_ip via $def_gate

ip tuntap add dev tun0 mode tun user $USER
ip addr add 10.0.0.1/24 dev tun0
ip addr add fdfe:dcba:9876::1/125 dev tun0
ip route add $xray_ip via $def_gate
ip link set tun0 up
ip -6 link set tun0 up
ip route add default dev tun0
ip -6 route add default dev tun0

chmod +x tun2socks
chmod +x xray

$2/xray -c $3 > /dev/null &
# sleep 2

# insert/update hosts entry
ip_address=$xray_ip
# find existing instances in the host file and save the line numbers
suffix="XrayTun.linux"
matches_in_hosts="$(grep -n "$suffix" /etc/hosts | cut -f1 -d:)"

host_entry="${ip_address} ${host_name} ${suffix}"

echo "Please enter your password if requested."

if [ ! -z "$matches_in_hosts" ]
then
    echo "Updating existing hosts entry."
    # iterate over the line numbers on which matches were found
    while read -r line_number; do
        # replace the text of each line with the desired host entry
        sudo sed -i "${line_number}s/.*/${host_entry} /" /etc/hosts
    done <<< "$matches_in_hosts"
else
    echo "Adding new hosts entry."
    echo "$host_entry" | sudo tee -a /etc/hosts > /dev/null
fi


$2/tun2socks -device tun://tun0 -proxy socks5://127.0.0.1:10808 # you can define the local socks5 port here 10808 is the default
