import { mount } from '@vue/test-utils';
import { describe, it, expect, beforeEach, vi } from 'vitest'; // Add vi to the import
import BKView from './BKView.vue';
import { useCosmicraftsStore } from '@/stores/cosmicrafts.js';

vi.mock('@/stores/cosmicrafts.js', () => ({
  useCosmicraftsStore: vi.fn()
}));

describe('BKView.vue', () => {
  let wrapper;

  beforeEach(async () => {
    useCosmicraftsStore.mockResolvedValue({
      all: {
        key1: 'value1',
        key2: 123n,
        key3: [1, 2, 3],
        key4: { nestedKey: 'nestedValue' }
      }
    });
    wrapper = mount(BKView);
    await wrapper.vm.$nextTick();
  });

  it('renders the component', () => {
    expect(wrapper.exists()).toBe(true);
  });

  it('displays the correct title', () => {
    expect(wrapper.find('h2').text()).toBe('Motoko backend preview');
  });
});