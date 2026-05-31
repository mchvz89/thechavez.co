---
title: "Building a Media Automation Stack on Synology NAS"
description: "How I set up a fully automated media pipeline on Synology NAS with hardware-accelerated transcoding, Docker container orchestration, and 10GbE network optimization."
pubDate: 2026-04-22
tags: ["Home Lab", "Synology", "Docker", "Networking"]
draft: false
---

My Synology NAS started as a simple network file share. Over two years it became the backbone of a self-hosted media and automation stack — and a surprisingly practical lab environment for infrastructure concepts that translate directly to production work.

## Hardware

Running a Synology DS923+ with:

- 4× 6TB WD Red Plus in SHR (RAID 5 equivalent)
- 1× 500GB NVMe SSD as a read/write cache pool
- Synology E10G22-T1-Mini 10GbE add-in card

The 10GbE NIC is the most impactful single upgrade. Copying a 50GB MKV file over 1GbE takes several minutes. Over 10GbE with the NVMe cache, it saturates the link and finishes in under a minute. Everything else in the stack benefits downstream.

## Container Architecture

Everything service-related runs in Docker via Synology Container Manager. Rather than configuring containers through the UI, I manage everything with a `docker-compose.yml` checked into a private Git repository. Reproducibility matters — if DSM gets upgraded, the NAS gets replaced, or I want to roll back a configuration change, the state is version-controlled.

| Container   | Role                               |
|-------------|------------------------------------|
| Sonarr      | TV series monitoring and automation|
| Radarr      | Movie monitoring and automation    |
| Prowlarr    | Indexer aggregation for both       |
| Jellyfin    | Media server with hardware transcode|
| Watchtower  | Automatic container image updates  |
| Portainer   | Container management and monitoring|

The automation pipeline: Sonarr/Radarr monitor for new releases → Prowlarr finds the source → download client fetches it → content lands in the NAS library → Jellyfin picks it up automatically. End-to-end with no manual steps.

## Hardware-Accelerated Transcoding

The DS923+ uses an AMD Ryzen R1600 processor with integrated HEVC decode support. Jellyfin can offload transcode work to the GPU via VAAPI, avoiding software transcoding — which on a NAS CPU would be both slow and loud.

In Jellyfin's playback settings:

1. Set hardware acceleration to **Video Acceleration API (VAAPI)**
2. Pass the `/dev/dri` device into the container
3. Enable HEVC decode and H.264 encode/decode

The relevant `docker-compose` device passthrough:

```yaml
devices:
  - /dev/dri:/dev/dri
```

With VAAPI working, a single 4K HEVC stream transcodes without noticeable CPU impact. Multiple concurrent streams that previously caused buffering now play cleanly.

## Network Tuning

With 10GbE as the backbone, a few additional tuning steps are worth the time.

**Jumbo frames (MTU 9000):** Reduces per-packet overhead for large sequential transfers. Set on the NAS interface in DSM under *Control Panel → Network Interface → Edit → MTU*, and match the setting on the connected switch port. Both sides must match — mismatched MTU silently degrades performance.

**Link aggregation (LACP 802.3ad):** If 10GbE isn't available, bonding two 1GbE ports gives 2Gbps aggregate throughput. Requires a managed switch with LACP support. More useful for NAS-to-NAS backup traffic than client streaming.

**QoS prioritization:** DSM's built-in QoS can weight media streaming traffic over backup tasks. Without it, a Hyper Backup job saturating the uplink while someone is watching a stream causes buffering. With it, streaming gets priority and backups throttle themselves.

## What I've Taken From This

**Version-control your infrastructure configs.** The `docker-compose.yml` in Git means rebuilding the entire stack after a NAS failure is a `docker compose up` away, not a half-day of UI configuration from memory.

**Observe everything.** Prowlarr going down silently breaks the entire automation pipeline. Portainer dashboards + Synology's health notifications give early warning before silent failures become missed content or a full disk.

**Hardware acceleration is worth the complexity.** Software-transcoding a single 4K stream can pin the NAS CPU and make everything else sluggish. Proper VAAPI configuration offloads that completely.

The stack gives me hands-on reps with container orchestration, volume management, network performance tuning, and infrastructure automation — all of which map directly to production Azure and M365 environments.
