---
title: "Building a DNS Incident Timer"
date: 2026-02-04T12:00:00-05:00
description: "A Raspberry Pi project that displays how long it's been since the last DNS failure, complete with a satisfying audio notification when someone presses the reset button"
categories: ["tech", "projects"]
tags: ["raspberry-pi", "docker", "prometheus", "python", "dns"]
slug: "building-a-dns-incident-timer"
draft: false
---

If you've worked in tech long enough, you've experienced it: the dreaded DNS failure. Whether it's a misconfigured record, an expired zone transfer, or the classic "it's always DNS" moment, these incidents have a way of humbling even the most seasoned engineers.

At some point, I thought: what if we could track these moments in a fun, tangible way?

Enter the DNS Incident Timer—a physical "days since last incident" counter that sits on a shelf, counting the seconds, minutes, hours, and days since someone last broke DNS. And when it inevitably gets reset? It plays an audio clip. Because sometimes you just need a little fanfare when things go sideways.

## The Hardware

The setup is pretty straightforward:

- **Raspberry Pi** (any model with GPIO support)
- **64x32 RGB LED Matrix** with an [Adafruit HAT][1]
- **Physical button** for the satisfying reset experience
- **Speaker** connected to the 3.5mm jack

The LED matrix displays two lines: "DAYS SINCE DNS" in white, and the elapsed time in red (years, months, days, hours, minutes, seconds). It's gloriously over-the-top for what's essentially a timer.

## The Software Stack

Here's where things get interesting. I wanted this to be:

1. **Persistent** — survives reboots and remembers the last reset time
2. **Accessible** — viewable and resettable from a web browser
3. **Observable** — because what's an ops project without Prometheus metrics?
4. **Containerized** — because I'm not a monster

The core is a Python application that handles:

- GPIO button input with proper debouncing
- RGB matrix rendering at 1Hz
- A Flask web server for remote access
- State persistence via JSON file
- Audio playback via ALSA

```python
def format_duration(self, duration: timedelta) -> Tuple[str, str]:
    """Format duration into two display lines."""
    total_seconds = int(duration.total_seconds())

    years = duration.days // 365
    months = (duration.days % 365) // 30
    days = (duration.days % 365) % 30
    hours = total_seconds // 3600 % 24
    minutes = total_seconds % 3600 // 60
    seconds = total_seconds % 60

    line1 = f"{years:02d}y {months:02d}mo {days:02d}d"
    line2 = f"{hours:02d}h {minutes:02d}m {seconds:02d}s"
    return (line1, line2)
```

## The Docker Journey

Running Python directly on a Pi is fine, but I wanted something more reproducible. Docker on a Raspberry Pi, however, comes with its own set of... let's call them "learning opportunities."

The biggest challenge was audio. Getting ALSA to work inside a Docker container on a Pi requires:

1. Mounting `/dev/snd` into the container
2. Setting up udev rules on the host for proper device permissions
3. A shell wrapper that waits for audio devices before starting Python

That last one was particularly fun to debug. Turns out, when a container starts, the audio devices might not be fully enumerated by the time Python's ALSA library tries to cache them. The fix was an entrypoint script:

```bash
#!/bin/bash
# Wait for audio devices to be fully available
MAX_ATTEMPTS=60
ATTEMPT=0
echo "Waiting for audio devices..."
while [ $ATTEMPT -lt $MAX_ATTEMPTS ]; do
    if aplay -l 2>&1 | grep -q "Headphones"; then
        echo "Audio devices ready after $((ATTEMPT + 1)) seconds"
        break
    fi
    ATTEMPT=$((ATTEMPT + 1))
    sleep 1
done
exec python dns_counter.py "$@"
```

## The Web Interface

The web UI is minimal but functional—a dark theme with a red accent (fitting for incidents), showing the same elapsed time as the physical display. Click the reset button, and it:

1. Resets the timer
2. Plays audio through your browser speakers
3. Plays audio through the Pi's speakers
4. Records a Prometheus metric

Speaking of metrics...

## Prometheus Integration

Because why build something if you can't graph it?

```python
RESET_COUNTER = Counter(
    'dnsfail_resets_total',
    'Total number of timer resets',
    ['source']  # 'button' or 'web'
)

AUDIO_PLAYBACK_ERRORS = Counter(
    'dnsfail_audio_errors_total',
    'Total number of audio playback errors'
)
```

Now I can track how often we're resetting (and whether it's via the physical button or the web UI), plus monitor for audio failures. The `/metrics` endpoint exposes everything in standard Prometheus format.

## Lessons Learned

A few things I picked up along the way:

- **Docker audio on Pi is tricky** — device permissions and timing matter more than you'd expect
- **gpiod v1 vs v2 APIs are different** — if you're writing GPIO code, detect the version and handle both
- **Browser autoplay policies are strict** — audio triggered by a button click works, but preloading helps

## What's Next?

Right now it's sitting on my shelf, quietly counting away. A few ideas for future iterations:

- Integration with actual alerting systems to auto-reset on incidents
- Historical tracking of incident frequency
- Maybe a leaderboard? ("Congratulations, February was our worst month!")

## Wrapping Up

Is this a practical project? Arguably not. Is it satisfying to press that button and hear the audio play while watching the counter reset to zeros? Absolutely.

Sometimes the best projects are the ones that make you smile while solving a problem that didn't really need solving. If you want to build your own incident timer, the code's all on [GitHub][2].

Cheers!

<!-- LINKS -->
[1]: https://www.adafruit.com/product/2345
[2]: https://github.com/asachs01/dnsfail
