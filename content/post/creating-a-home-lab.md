---
title: "Creating a Home Lab"
date: 2019-01-31T20:11:53-05:00
draft: true
---

I've been working on my home lab recently. Its previous iteration comprised the following components:

* 1 - [Intel NUC7i7BNH][1]
* 1 - [Ubiquiti Unifi Security Gateway][2]
* 1 - [Ubiquiti Unifi 24 port POE switch][3]
* 3 - [Raspberry Pi 3 B+][4]

I had ESXi running on the NUC and a number of VMs set up--namely [Sensu Enterprise], [InfluxDB], [Graphite], and a couple of Kubernetes nodes. 

It served its purpose and allowed me to do a number of work-related things. But it's time to redo the lab. 

After having undergone a cross-country move, I decided to change the lab, as well as my approach to how I'm going to deploy things for the lab. Rather than continuing to use VMs, I decided, "What the heck. Why not just containerize everything?" So now, the lab looks more like this:

* 3 - NUC7i7BNH
* 1 - Ubiquiti USG
* 1 - Ubiquiti 24 port POE switch
* 6 - Raspberry Pi 3 B+

The NUCs are now configured as a Kubernetes cluster, as are the Raspberry Pis. 

<!--LINKS-->
[1]: https://www.bhphotovideo.com/c/product/1327194-REG/intel_boxnuc7i7bnh_nuc_bnh_7th_gen.html
