+++
author = "Aaron Sachs"
title = "Resetting Minikube's IP"
date = 2019-02-04T10:55:09Z
tags = ["minikube", "kubernetes", "networking", "troubleshooting"]
description = "How to reset Minikube's IP to 192.168.99.100"
slug = "resetting-minikubes-ip-address"

+++

I use [minikube][1] for a lot of quick troubleshooting and demos. I recently found myself in a situation where the IP address kept incrementing. Instead of the standard `192.168.99.100`, every restart found the minikube VM with a new IP address, which made demos that relied on the standard IP difficult to demo. 

I ended up finding the solution on [Stackoverflow][2]. To reset minikube's IP back to normal, do the following:

1. `minikube stop`
2. Open Virtualbox and go to "File"-->Host Network Manager
3. Find the adapter that has the `192.168.99.1` subnet assigned to it (likely `vbox0`, though mine was `vbox2`), and remove it.
4. `minkube start`
5. `minikube ip`

That should give you the good ole `192.168.99.100` IP address that you know and love. 

<!--LINKS-->

[1]: https://github.com/kubernetes/minikube
[2]: https://stackoverflow.com/questions/53871053/how-to-completely-purge-minikube-config-or-reset-ip-back-to-192-168-99-100#comment94730403_53883894