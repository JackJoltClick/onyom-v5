#!/bin/bash

# Script to generate sample meditation audio files using macOS text-to-speech
# Run this script in the public/audio directory

echo "Generating sample meditation audio files..."

# Check if we're on macOS
if ! command -v say &> /dev/null; then
    echo "This script requires macOS 'say' command for text-to-speech"
    echo "On other systems, you can:"
    echo "1. Record your own meditation audio"
    echo "2. Download royalty-free meditation audio"
    echo "3. Use online text-to-speech services"
    exit 1
fi

# Create meditation scripts
echo "Welcome to your mindful breathing meditation. Find a comfortable position and close your eyes. Take a deep breath in through your nose for 4 counts... hold for 4... and exhale slowly through your mouth for 6 counts. Continue this pattern, focusing only on your breath. Let any thoughts pass by like clouds in the sky. Breathe in peace... hold the calm... breathe out tension. Continue for a few more minutes, returning to this natural rhythm whenever your mind wanders." > mindful-breathing-script.txt

echo "Welcome to this body scan relaxation. Lie down comfortably and close your eyes. Begin by taking three deep breaths. Now, bring your attention to the top of your head. Notice any sensations or tension. Slowly move your awareness down to your forehead, your eyes, your jaw. Allow each part to relax completely. Continue scanning down through your neck, shoulders, arms, and hands. Feel your chest rising and falling with each breath. Move your attention to your abdomen, your back, your hips. Notice your legs, your knees, your feet. Take a moment to feel your whole body relaxed and peaceful." > body-scan-script.txt

echo "Welcome to this loving kindness meditation. Sit comfortably and close your eyes. Begin by sending loving thoughts to yourself. Silently repeat: May I be happy. May I be healthy. May I be at peace. May I be free from suffering. Feel these wishes for yourself. Now think of someone you love. Send them the same wishes: May you be happy. May you be healthy. May you be at peace. May you be free from suffering. Extend these wishes to a neutral person, then to someone difficult, and finally to all beings everywhere. May all beings be happy and free." > loving-kindness-script.txt

# Generate audio files with a calm voice
echo "Generating mindful-breathing.mp3..."
say -f mindful-breathing-script.txt -o mindful-breathing.mp3 --data-format=LEI16@44100 -r 160

echo "Generating body-scan.mp3..."
say -f body-scan-script.txt -o body-scan.mp3 --data-format=LEI16@44100 -r 160

echo "Generating loving-kindness.mp3..."
say -f loving-kindness-script.txt -o loving-kindness.mp3 --data-format=LEI16@44100 -r 160

# Create shorter versions for other meditations
echo "Creating shorter meditation audio files..."
echo "Welcome to this anxiety relief meditation. Take a deep breath and know that you are safe in this moment. Let go of worries about the past or future. Focus only on this breath, this heartbeat, this present moment of peace." > anxiety-relief-script.txt

echo "Welcome to this focus enhancement meditation. Sit tall and alert. Choose a single point of focus - perhaps your breath or a word like 'calm'. When your mind wanders, gently return to your chosen focus point. This practice strengthens your concentration like exercise strengthens your body." > focus-enhancement-script.txt

echo "Welcome to this sleep preparation meditation. Lie down comfortably. Take slow, deep breaths. With each exhale, let your body sink deeper into relaxation. Release the day's tensions. Allow sleep to come naturally as you drift into peaceful rest." > sleep-prep-script.txt

say -f anxiety-relief-script.txt -o anxiety-relief.mp3 --data-format=LEI16@44100 -r 160
say -f focus-enhancement-script.txt -o focus-enhancement.mp3 --data-format=LEI16@44100 -r 160
say -f sleep-prep-script.txt -o sleep-prep.mp3 --data-format=LEI16@44100 -r 160

# Clean up script files
rm *-script.txt

echo "Sample audio files generated successfully!"
echo "Files created:"
echo "- mindful-breathing.mp3"
echo "- body-scan.mp3"
echo "- loving-kindness.mp3"
echo "- anxiety-relief.mp3"
echo "- focus-enhancement.mp3"
echo "- sleep-prep.mp3"
echo ""
echo "You can now test the meditation player with these sample files." 