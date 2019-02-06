---
title: "Deploying Sensu Sample on Baremetal"
author: "Aaron Sachs"
date: 2019-02-01T12:58:23-05:00
draft: true
tags: ["sensu", "monitoring", "kubernetes"]
description: "Deploying Sensu's sample app to K8s on baremetal"
categories: ["tech"]
slug: "sensu-sample-app-baremetal"
---

One of the cool things I've been involved in at Sensu is being able to make getting started with Sensu a much easier process. Before Sensu Go was deployed, I'd created the ["Sensu Up and Running"][1] to use in demos, training, and at some of the [talks][2] I've given. 

Since then, Sensu Go has been deployed and there's been a huge group effort to make getting started with Sensu Go a frictionless experience. 

Part of that effort has been to create a [guide that walks users through deploying Sensu and monitoring an app on Kubernetes][3]. That guide makes use of [Minikube][4] to deploy Sensu, Influxdb, Grafana, and some checks and handlers. 

With a little bit of tweaking, you can do the same on a baremetal cluster. 

## Background

If you walk through deploying the app on Minikube, you'll notice that there are a couple of prerequisites before you get around to deploying the app. Those prereqs are around the [Nginx Ingress controller][5] and the rules that get applied in the course of the tutorial. 

<!--LINKS-->

[1]: https://github.com/asachs01/sensu-up-and-running
[2]: ../talks
[3]: https://docs.sensu.io/sensu-go/5.1/getting-started/sample-app/
[4]: https://github.com/kubernetes/minikube