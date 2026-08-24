# Falling Catch audio

`catch-success.wav` is the selected Candidate C for the ordinary collectible catch event.

- Original prompt concept: a golden grain seed touching a soft woven basket with one mellow organic tick and a tiny breath of grass leaves.
- Generated specifically for this project with Stable Audio 3 Medium; seed `7313`.
- Negative direction excluded music, voices, coin sounds, retro arcade sounds and traditional game score cues.
- Post-processing: active-event trim, 6 ms fade-in, 40 ms fade-out, peak normalization to -6 dBFS.
- Format: WAV, stereo, 44.1 kHz, 16-bit PCM, approximately 0.42 seconds.

`obstacle-hit.wav` is the selected Candidate A for the moss-weathered-stone collision event.

- Original prompt concept: a small moss-covered weathered pebble making one gentle muted tap against a soft rounded natural surface.
- Generated specifically for this project with Stable Audio 3 Medium; seed `8417`.
- Negative direction excluded explosions, crashes, metal or glass, pain vocals, alarms, coin or bell cues, retro arcade sounds and music.
- Post-processing: active-event trim, 6 ms fade-in, 70 ms fade-out, peak normalization to -7 dBFS.
- Format: WAV, stereo, 44.1 kHz, 16-bit PCM, approximately 0.58 seconds.

The obstacle sound is played only when the Traveler's body collides with an obstacle.

`outcome-clear.wav` is the dedicated clear-result sound.

- Original prompt concept: a golden grain seed settling into a woven grass basket, followed by one light upward breath of fresh leaves.
- Generated specifically for this project with Stable Audio 3 Medium; seed `8609`.
- Negative direction excluded coins, bells, fanfares, victory jingles, arcade cues, music and voices.
- Post-processing: active-event trim, 6 ms fade-in, 95 ms fade-out, peak normalization to -7.5 dBFS.
- Format: WAV, mono, 44.1 kHz, 16-bit PCM, approximately 0.82 seconds.

`outcome-retry.wav` is the dedicated failed-result sound.

- Original prompt concept: a soft leaf bundle settling onto springy moss with a rounded touch and a brief downward breath of air.
- Generated specifically for this project with Stable Audio 3 Medium; seed `8623`.
- Negative direction excluded buzzers, alarms, descending musical scales, sad music, arcade cues, harsh impacts and voices.
- Post-processing: active-event trim, 6 ms fade-in, 85 ms fade-out, peak normalization to -7.5 dBFS.
- Format: WAV, mono, 44.1 kHz, 16-bit PCM, approximately 0.74 seconds.

These two files play only on their corresponding round-result screens. No API key is stored in this repository.
