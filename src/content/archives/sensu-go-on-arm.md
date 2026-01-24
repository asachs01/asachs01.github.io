---
slug: sensu-go-on-arm
title: "Compiling and Running Sensu Go on ARM"
date: 2019-05-09T19:49:32-05:00
description: "How to compile and run Sensu Go on arm boards"
categories: ["monitoring", "sensu", "arm"]
tags: ["sensu", "monitoring", "arm", "raspberry pi", "jetson"]
---

# UPDATES

When I originally wrote this post, I was operating under some outdated assumptions when it comes to building Sensu on arm devices. I'll post the updates here at the beginning of the article, and you can read on to see how I'd previously set up Sensu on my Nvidia Jetson Nanos.

## Compiling Sensu Go

As a Go novice, I didn't fully understand the workflow for compiling Sensu for arm devices. As it so happens, it's fairly easy to cross-compile from whatever device you're on and then just transfer the binaries to the system you want to run on. I found this out the hard way by trying to compile on the Raspberry Pi's I have. This resulted in them locking up. 

So let's walk through the non-build-script way of doing this:

1. Install Go
2. [Obtain Sensu Go](#obtaining-sensu-go)
3. Build the binary for your arm system of choice using `GOOS=linux GOARCH=arm go install ./...` from inside the project root (`$GOPATH/src/github/sensu/sensu-go`)
4. Transfer to the binary/binaries to your Pi's, Nano's, or other arm board
5. Proceed through the [rest of the setup](#running-sensu-go)

Now, you can absolutely run through the original post as it was and _still_ run Sensu. However, I find that cross compiling from a system with a bit more oomph is going to make things easier. 

# Original post

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

## Obtaining Sensu Go{#obtaining-sensu-go}

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

To make this a bit easier, you can do the following:

`sudo curl -L https://gist.githubusercontent.com/asachs01/497ede01e9905e7917d577451ac51c1b/raw/141aa960a5481e4c536ff790561c5effd0f3b058/sensu-backend.service -o /lib/systemd/system/sensu-backend.service`

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

And the same with this one: 

`sudo curl -L https://gist.githubusercontent.com/asachs01/497ede01e9905e7917d577451ac51c1b/raw/141aa960a5481e4c536ff790561c5effd0f3b058/sensu-agent.service -o /lib/systemd/system/sensu-agent.service`

Again, these will need to live at `/lib/systemd/system/sensu-backend.service` and `/lib/systemd/system/sensu-agent.service` respectively. Once you've got those in place, let's move onto the next step.

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

![sensu go dashboard](https://p299.p4.n0.cdn.getcloudapp.com/items/OAuL7wme/Image+2020-01-17+at+12.25.47+PM.png?v=c53eadf0f22ed4865e2e5971c164b759)

There you have it! If you want to cluster a few Jetson Nanos, or Raspberry Pis up, head over to [Sensu's clustering guide][2]. 

Cheers!

<!--LINKS-->
[1]: https://golang.org/dl/
[2]: https://docs.sensu.io/sensu-go/5.7/guides/clustering/
