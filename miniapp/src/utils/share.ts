import { SavingsStack } from '../types';

/**
 * Generates a shareable message for Farcaster when a stack is created
 */
export function generateStackShareMessage(stack: SavingsStack): string {
    const emoji = stack.emoji || '💰';
    const goal = stack.targetAmount.toLocaleString();
    const frequency = stack.frequency.charAt(0).toUpperCase() + stack.frequency.slice(1);

    return `Just started saving for my ${stack.name}! ${emoji}

Goal: $${goal} 
Frequency: ${frequency}
Using @stack to automate my savings 🚀

Start your own stack and reach your goals! 👇`;
}

/**
 * Generates a shareable message for milestones (50%, 100%)
 */
export function generateMilestoneShareMessage(stack: SavingsStack, milestone: number): string {
    const emoji = stack.emoji || '💰';
    const current = stack.currentAmount.toLocaleString();
    const goal = stack.targetAmount.toLocaleString();

    if (milestone === 100) {
        return `🎉 Just completed my ${stack.name} stack! ${emoji}

Saved: $${current}
Time to celebrate! 🎊

Automate your savings with @stack 👇`;
    }

    return `${milestone}% there! ${emoji}

${stack.name}: $${current} / $${goal}
Halfway to my goal with @stack! 💪

Start your own savings journey 👇`;
}

/**
 * Generates Frame metadata for Farcaster
 * This will be used to create an interactive frame in the cast
 */
export function generateFrameMetadata(stack: SavingsStack) {
    const baseUrl = 'https://stack.app'; // Replace with actual domain

    return {
        'fc:frame': 'vNext',
        'fc:frame:image': `${baseUrl}/api/og/stack/${stack.id}`, // OG image showing stack
        'fc:frame:button:1': 'Start Your Own Stack',
        'fc:frame:button:1:action': 'link',
        'fc:frame:button:1:target': `${baseUrl}?ref=${stack.id}`,
        'fc:frame:button:2': 'View Progress',
        'fc:frame:button:2:action': 'link',
        'fc:frame:button:2:target': `${baseUrl}/stack/${stack.id}`,
    };
}

/**
 * Share to Farcaster using the Farcaster SDK
 * This will open the cast composer with pre-filled content
 */
export async function shareToFarcaster(message: string, frameUrl?: string) {
    // Check if we're in Farcaster context
    if (typeof window === 'undefined') return;

    try {
        // Use Farcaster SDK to open cast composer
        // @ts-ignore - Farcaster SDK types
        if (window.parent && window.parent !== window) {
            // We're in an iframe (Farcaster app)
            window.parent.postMessage({
                type: 'createCast',
                data: {
                    text: message,
                    embeds: frameUrl ? [frameUrl] : [],
                }
            }, '*');
        } else {
            // Fallback: Open Warpcast with pre-filled text
            const encodedText = encodeURIComponent(message);
            const warpcastUrl = `https://warpcast.com/~/compose?text=${encodedText}`;
            window.open(warpcastUrl, '_blank');
        }
    } catch (error) {
        console.error('Failed to share to Farcaster:', error);
        // Fallback: Copy to clipboard
        navigator.clipboard.writeText(message);
        alert('Message copied to clipboard! Share it on Farcaster.');
    }
}

/**
 * Share to Base (Coinbase) social features
 */
export async function shareToBase(message: string) {
    // Base app sharing logic
    // This would use Coinbase SDK when available
    try {
        // For now, use Web Share API
        if (navigator.share) {
            await navigator.share({
                title: 'My Stack Goal',
                text: message,
                url: 'https://stack.app', // Replace with actual URL
            });
        } else {
            // Fallback: Copy to clipboard
            navigator.clipboard.writeText(message);
            alert('Message copied to clipboard!');
        }
    } catch (error) {
        console.error('Failed to share:', error);
    }
}
