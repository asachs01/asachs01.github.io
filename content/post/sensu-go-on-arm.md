---
author: Aaron Sachs
slug: sensu-go-on-arm
title: "Compiling and Running Sensu Go on ARM"
date: 2019-05-09T19:49:32-05:00
description: "How to compile and run Sensu Go on ARMV7 platforms"
categories: ["monitoring", "sensu", "arm"]
tags: ["sensu", "monitoring", "arm", "raspberry pi", "jetson"]
---

In this post, I'll cover how I am running Sensu Go on several NVIDIA Jetson Nanos. Though this is being done on a Nano, you could use the same approach I use here on a Raspberry Pi, or any other armv7 board. I would note that this is a temporary until official Sensu Go arm packages are released.

# The Setup

There are several things you'll need to do before you can start playing around with Sensu Go. 

1. Install Go on your system
2. Grab Sensu Go
3. Build the binaries

## Installing Go

While installing Go on the Jetson as fairly trivial, the goal here is to give you a complete accounting of how I did what I did. 

To install Go, run:

`sudo apt-get install golang`

You should then have it installed on your system. If you need more complete documentation on installing Go, please see [Go's docs on downloading and installing Go onto your system][1].

## Obtaining Sensu Go

Once you've installed Go, the next step is to obtain Sensu Go. To get the package, run the following:

`go get github.com/sensu/sensu-go/...`

This will put the package at `$GOPATH/src/github.com/sensu/sensu-go`.

## Building the Binaries

Next up, we're going to build the binaries using a script provided in the repo. You'll want to ensure that you're in `$GOPATH/src/github.com/sensu/sensu-go`. Once you're there, you'll find a script called `build.sh`

```
❯❯❯❯ ls
agent    dashboard       rpc        vendor           Dockerfile.rhel_atomic  build.ps1
api      docker-scripts  scripts    version          Dockerfile.testagent    build.sh
asset    examples        system     CHANGELOG.md     FAQ.md                  docker-compose.yaml
backend  graphql         testing    CONTRIBUTING.md  Gopkg.lock
cli      handler         transport  DCO              Gopkg.toml
cmd      js              types      Dockerfile       LICENSE
command  licenses        util       Dockerfile.rhel  README.md
```

We'll run that and build our binaries:

`./build.sh`

Now, we'll grab that binaries that were built:

```
cd $GOPATH/bin

sudo cp sensu-{agent,backend} /usr/sbin/
```

That's it for the prep work. Now it's on to actually running Sensu Go.

# Running Sensu Go

To run Sensu Go, we'll need to go through the following steps:

1. Create the service files for the respective services
2. Create the Sensu user/group
3. Create the respective directories needed for Sensu to operate
4. Grab config files for Sensu Go

## Creating the Service Files

There are two service files that will need to be created in order to use systemd to manage Sensu Go as you'd find with RHEL/Debian packages:

**Sensu Backend Service File**
```
[Unit]
Description=The Sensu Backend service.
After=network-online.target
Wants=network-online.target

[Service]
Type=simple
User=sensu
Group=sensu
# Load env vars from /etc/default/ and /etc/sysconfig/ if they exist.
# Prefixing the path with '-' makes it try to load, but if the file doesn't
# exist, it continues onward.
EnvironmentFile=-/etc/default/sensu-backend
EnvironmentFile=-/etc/sysconfig/sensu-backend
LimitNOFILE=65535
ExecStart=/usr/sbin/sensu-backend start -c /etc/sensu/backend.yml
Restart=always
WorkingDirectory=/

[Install]
WantedBy=multi-user.target
```

**Sensu Agent Service File**
```
[Unit]
Description=The Sensu Agent process.
After=network-online.target
Wants=network-online.target

[Service]
Type=simple
User=sensu
Group=sensu
# Load env vars from /etc/default/ and /etc/sysconfig/ if they exist.
# Prefixing the path with '-' makes it try to load, but if the file doesn't
# exist, it continues onward.
EnvironmentFile=-/etc/default/sensu-agent
EnvironmentFile=-/etc/sysconfig/sensu-agent
LimitNOFILE=65535
ExecStart=/usr/sbin/sensu-agent start
Restart=always
WorkingDirectory=/

[Install]
WantedBy=multi-user.target
```

These will need to live at `/lib/systemd/system/sensu-backend.service` and `/lib/systemd/system/sensu-agent.service` respectively. Once you've got those in place, let's move onto the next step.

## Create the Sensu User/Group

This is fairly simple, as we'll only need to create a service account for Sensu:

`sudo useradd -r sensu`

Now, onto the next step of creating the requisite directories for Sensu.

## Create Sensu Directories

There are three directories that need to be created and owned by the Sensu user:

* `/var/lib/sensu`
* `/var/cache/sensu`
* `/etc/sensu`

Create each of these and change the ownership on them:

```
sudo /var/lib/sensu
sudo /var/cache/sensu
sudo mkdir /etc/sensu

sudo chown sensu. /var/lib/sensu
sudo chown sensu. /var/cache/sensu
sudo chown sensu. /etc/sensu
```

Alright, now for the last step: obtaining the config files.

## Obtaining Sensu Go Config Files

This is also a fairly quick step:

```
curl -LO http://docs.sensu.io/sensu-go/latest/files/\{agent,backend\}.yml

sudo cp {agent,backend}.yml /etc/sensu
```

Now, let's get cooking.

## Start Sensu Go

This is it. The moment you've been waiting for. It's time to run Sensu!

```
sudo systemctl enable sensu-{agent,backend}

sudo systemctl start sensu-{agent,backend}
```

To ensure that Sensu is running as we expect, do a quick `sudo journalctl -fu sensu-backend`. Journald should be free of any errors and if you go to http://IPOFYOURSYSTEM:3000, you should get a nice dashboard that looks like:

![](https://d1c0hjomoutdrw.cloudfront.net/items/121T2B171H1O2c210e2B/Webp.net-resizeimage.png)

There you have it! If you want to cluster a few Jetson Nanos, or Raspberry Pis up, head over to [Sensu's clustering guide][2]. 

Cheers!

<!--LINKS-->
[1]: https://golang.org/dl/
[2]: https://docs.sensu.io/sensu-go/5.7/guides/clustering/
