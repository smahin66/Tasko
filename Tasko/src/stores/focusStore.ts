import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface CosmicReward {
  id: string;
  name: string;
  description: string;
  imageUrl: string;
  requiredMinutes: number;
  unlocked: boolean;
}

interface FocusState {
  totalFocusMinutes: number;
  rewards: CosmicReward[];
  addFocusMinutes: (minutes: number) => void;
  unlockReward: (rewardId: string) => void;
}

const cosmicRewards: Omit<CosmicReward, 'unlocked'>[] = [
  {
    id: 'dust',
    name: 'Poussière d\'étoiles',
    description: 'Les premiers fragments de votre univers commencent à briller',
    imageUrl: 'https://images.pexels.com/photos/816608/pexels-photo-816608.jpeg',
    requiredMinutes: 10
  },
  {
    id: 'nebula',
    name: 'Nébuleuse Violette',
    description: 'Une magnifique nébuleuse se forme dans votre galaxie',
    imageUrl: 'https://images.pexels.com/photos/7672255/pexels-photo-7672255.jpeg',
    requiredMinutes: 30
  },
  {
    id: 'planet',
    name: 'Planète Naissante',
    description: 'Une nouvelle planète émerge des poussières cosmiques',
    imageUrl: 'https://images.pexels.com/photos/7672256/pexels-photo-7672256.jpeg',
    requiredMinutes: 60
  },
  {
    id: 'rings',
    name: 'Anneaux Planétaires',
    description: 'Des anneaux majestueux se forment autour de votre planète',
    imageUrl: 'https://images.pexels.com/photos/7672257/pexels-photo-7672257.jpeg',
    requiredMinutes: 180
  },
  {
    id: 'galaxy',
    name: 'Galaxie Complète',
    description: 'Votre galaxie atteint sa forme finale, un spectacle cosmique éblouissant',
    imageUrl: 'https://images.pexels.com/photos/7672258/pexels-photo-7672258.jpeg',
    requiredMinutes: 300
  }
];

export const useFocusStore = create<FocusState>()(
  persist(
    (set) => ({
      totalFocusMinutes: 0,
      rewards: cosmicRewards.map(reward => ({ ...reward, unlocked: false })),
      addFocusMinutes: (minutes) => 
        set((state) => {
          const newTotalMinutes = state.totalFocusMinutes + minutes;
          const updatedRewards = state.rewards.map(reward => ({
            ...reward,
            unlocked: reward.requiredMinutes <= newTotalMinutes
          }));
          return {
            totalFocusMinutes: newTotalMinutes,
            rewards: updatedRewards
          };
        }),
      unlockReward: (rewardId) =>
        set((state) => ({
          rewards: state.rewards.map(reward =>
            reward.id === rewardId ? { ...reward, unlocked: true } : reward
          )
        }))
    }),
    {
      name: 'focus-storage'
    }
  )
);