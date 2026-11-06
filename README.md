# Masíd by Practical Joy Co.

Calm, local monitoring for macOS and Windows. This repository contains downloads, the Homebrew cask, and release automation. Application source is private.

## Install on a Mac

Apple silicon, macOS 15 or newer:

```sh
brew tap practicaljoyco/masid-downloads https://github.com/practicaljoyco/Masid-Downloads.git
brew install --cask practicaljoyco/masid-downloads/masid
```

For updates:

```sh
brew update
brew upgrade --cask practicaljoyco/masid-downloads/masid
```

The current package is an **unsigned development build**. Homebrew installs it but does not provide Apple signing/notarization. macOS may require approval in System Settings → Privacy & Security. The cask keeps Gatekeeper and quarantine enabled. No Intel Mac build is provided yet.

## Install on Windows

Open [Releases](https://github.com/practicaljoyco/Masid-Downloads/releases), then download the latest numbered release:

- Most Intel/AMD PCs: `Masid-PracticalJoyCo_<version>_x64-setup.exe`
- Windows on ARM: `Masid-PracticalJoyCo_<version>_arm64-setup.exe`

Double-click the correct setup file, follow Install/Finish, then open Masíd from Start. No developer tools are required. Read `INSTALL-WINDOWS.txt` for optional PowerShell installation and `SHA256SUMS.txt` to verify the file.

**Windows packages are unsigned development builds. Windows may warn or block them.** GitHub hosting does not supply an Authenticode signature or SmartScreen reputation. Do not disable antivirus or SmartScreen to install them. Signing or Store distribution is still required for trusted public releases; a newly signed direct download can also receive a reputation warning. Native Windows installation and hardware validation remain pending.

## What Masíd includes

CPU, memory, storage, network, power, and process views; readable history graphs; local drive nicknames; SMART and drive temperatures where supported; optional notifications with adjustable CPU/GPU and drive-space limits; memory pressure alerts; Standard/Sassy copy; and Forest, Tangerine, Cerise, Lilac, and Lime accents. Missing sensors stay unavailable. CPU/GPU activity reminders describe workload, not hardware faults. CPU/GPU temperature and fan providers are not implemented.

## Automatic updates

The private source repository rebuilds Mac/Windows packages after pushes to its main branch. All platforms and checks must succeed before publishing. A new app version creates an immutable numbered release and updates the Homebrew cask to its checksum-pinned Mac ZIP. Subsequent changes without a version bump update the separate `next` development release; they do not silently replace the numbered release or its Homebrew checksum. A failed build leaves the previous release available. Upgrading the app's version in source advances the numbered release.

Only packages and public release metadata are sent here. Private source, local settings/history, raw drive identities, and build logs are excluded. The source workflow has a deploy key scoped to this repository only. Its temporary `incoming` branch hands packages to this repository's publisher; it is removed after successful publication.

© 2026 Practical Joy Co. All rights reserved. Download availability does not grant a license to copy or redistribute the application's source.
