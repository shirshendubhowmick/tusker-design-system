# Base matches the previous `image` key. We only extend it to install the
# system libraries Playwright's Chromium needs. This runs at BUILD time (root
# available), so the running container keeps its locked-down posture
# (no-new-privileges, cap-drop=ALL) and needs no runtime sudo.
FROM mcr.microsoft.com/devcontainers/base:jammy

# Chromium shared-library deps for Ubuntu 22.04 (jammy). Equivalent to the
# apt half of `playwright install --with-deps chromium`. Regenerate with
# `npx playwright install-deps --dry-run chromium` if Playwright bumps its
# requirements. Browser binaries themselves are NOT installed here — they
# download per-user into ~/.cache/ms-playwright at runtime (no root needed).
RUN apt-get update \
    && apt-get install -y --no-install-recommends \
        libnss3 \
        libnspr4 \
        libdbus-1-3 \
        libatk1.0-0 \
        libatk-bridge2.0-0 \
        libcups2 \
        libdrm2 \
        libxcb1 \
        libxkbcommon0 \
        libatspi2.0-0 \
        libx11-6 \
        libxcomposite1 \
        libxdamage1 \
        libxext6 \
        libxfixes3 \
        libxrandr2 \
        libgbm1 \
        libpango-1.0-0 \
        libcairo2 \
        libasound2 \
    && rm -rf /var/lib/apt/lists/*
