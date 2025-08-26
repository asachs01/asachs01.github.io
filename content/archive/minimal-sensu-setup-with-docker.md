---
author: Aaron Sachs
slug: minimal-sensu-docker
title: "A minimal Sensu environment with Docker"
date: 2019-05-06T11:32:56-05:00
description: "A quick rundown of how I spin up minimal Sensu environments with Docker"
categories: ["tech"]
tags: ["productivity", "docker", "sensu", "monitoring"]
---

This past week, I had the pleaseure of attending Dockercon. While I was there primarily working the [Sensu][1] booth, it occurred to me that Docker presents an ideal way to demo what Sensu does, and I can quickly get an environment up without having to go through the rigmarole that I previously did using [Vagrant][2]. Now, that's not saying that I think one tool is better than the other, but for the purposes of quick demos, Docker is more useful to me. 

So let's go over the setup.

## Docker details
I'm primarily using [Docker for Mac][3] right now, since I've switched over from my Linux laptop. But now that I've covered that, let's take a look at this [little repo][4] I'm using. 

```
.
├── README.md
├── assets
│   ├── hello-world-ruby.tar.gz
│   ├── helloworld-v0.1.tar.gz
│   ├── sensu-plugins-cpu-checks_4.0.0_alpine_linux_amd64.tar.gz
│   └── sensu-ruby-runtime_0.0.5_alpine_linux_amd64.tar.gz
├── config
│   ├── nginx
│   │   └── nginx.conf
│   └── sensu
│       ├── assets
│       │   ├── sensu-plugins-cpu-checks.yaml
│       │   └── sensu-ruby-runtime.yaml
│       └── checks
│           ├── check-cpu.yaml
│           └── check-disk-usage.yaml
└── docker-compose.yaml
```

And a look at the docker-compose file:

```
version: '3'
services:
  sensu-backend:
    image: "sensu/sensu:latest"
    ports:
      - "3000:3000"
      - "2379:2379"
      - "2380:2380"
      - "8080:8080"
      - "8081:8081"
    command: "sensu-backend start"
    volumes:
      - "/tmp/sensu:/var/lib/sensu"
    hostname: sensu-backend
  sensu-agent:
    image: "sensu/sensu:latest"
    command: "sensu-agent start --backend-url ws://sensu-backend:8081 --subscriptions dev poller system linux docker --cache-dir /var/lib/sensu --namespace default --deregister true"
    links:
      - "sensu-backend:backend"
    depends_on:
      - sensu-backend
    hostname: sensu-agent
  sensu-asset-server:
    image: nginx:latest
    ports:
    - 8000:80
    volumes:
    - "./config/nginx/nginx.conf:/etc/nginx/nginx.conf"
    - "./assets:/usr/share/nginx/html/assets"
    depends_on:
    - sensu-backend
    links:
      - "sensu-backend:backend"

```

What we end up with here is a backend, an agent, and a local asset server (SUPER useful if you're on 💩 wifi/internet). This means that I can quickly spin up an agent and a backend, and then drop any [asset][5] that I need to use in the assets directory and have the agent download it quickly. 

This makes demos super quick to spin up, and I can scale a bunch of agents if I want to show a large number of agent containers connecting to the backend. 

Cheers!


<!--LINKS-->
[1]: https://sensu.io
[2]: https://vagrantup.com
[3]: https://docs.docker.com/docker-for-mac/install/
[4]: https://github.com/asachs01/sensu-go-minimal
[5]: https://docs.sensu.io/sensu-go/latest/reference/assets/
