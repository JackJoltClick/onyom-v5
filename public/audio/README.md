# Meditation Audio Files

This directory contains the audio files for the premade meditations.

## Required Files

The following audio files should be placed in this directory:

- `mindful-breathing.mp3` - 5-minute mindful breathing meditation
- `body-scan.mp3` - 10-minute body scan relaxation
- `loving-kindness.mp3` - 8-minute loving kindness meditation
- `sleep-prep.mp3` - 15-minute sleep preparation meditation
- `anxiety-relief.mp3` - 7-minute anxiety relief meditation
- `focus-enhancement.mp3` - 12-minute focus enhancement meditation

## Audio Requirements

- Format: MP3
- Quality: 128kbps or higher
- Sample Rate: 44.1kHz
- Channels: Stereo or Mono

## Placeholder

Until you add the actual audio files, the app will show an error when trying to play meditations. You can:

1. Record your own meditation audio files
2. Use text-to-speech to generate placeholder files
3. Find royalty-free meditation audio online

## Example using macOS text-to-speech:

```bash
say -f script.txt -o mindful-breathing.mp3 --data-format=LEI16@44100 -v Alex
```

Where `script.txt` contains the meditation script. 