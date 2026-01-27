export const ARCHETYPES = {
  A: {
    name: 'The Closer',
    description: 'You prioritize getting the deal done',
    icon: '🎯',
    color: 'from-red-500 to-orange-500',
    bgColor: 'bg-red-50',
    textColor: 'text-red-700',
  },
  B: {
    name: 'The Relationship Builder',
    description: 'You dig deeper before reacting',
    icon: '🤝',
    color: 'from-blue-500 to-cyan-500',
    bgColor: 'bg-blue-50',
    textColor: 'text-blue-700',
  },
  C: {
    name: 'The Patient Strategist',
    description: 'You trust the process and provide value',
    icon: '♟️',
    color: 'from-purple-500 to-pink-500',
    bgColor: 'bg-purple-50',
    textColor: 'text-purple-700',
  },
  D: {
    name: 'The Creative Escalator',
    description: 'You find new angles to move deals forward',
    icon: '🚀',
    color: 'from-green-500 to-teal-500',
    bgColor: 'bg-green-50',
    textColor: 'text-green-700',
  },
  E: {
    name: 'The Qualifier',
    description: 'You protect your time and focus on the right deals',
    icon: '⚖️',
    color: 'from-amber-500 to-yellow-500',
    bgColor: 'bg-amber-50',
    textColor: 'text-amber-700',
  },
};

export const SCENARIO_OPTIONS = [
  {
    value: 'A',
    text: 'Offer a discount to match their price',
  },
  {
    value: 'B',
    text: "Ask what would happen if price wasn't a factor - what else concerns them?",
  },
  {
    value: 'C',
    text: 'Send a follow-up email with a case study and wait for their response',
  },
  {
    value: 'D',
    text: 'Set up a call with your CEO to add credibility and urgency',
  },
  {
    value: 'E',
    text: "Walk away - if price is their main concern, they're not the right fit",
  },
];

export function getArchetypeByChoice(choice) {
  return ARCHETYPES[choice] || null;
}
