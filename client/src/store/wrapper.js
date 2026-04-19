import { store } from './store';
import { createWrapper } from 'next-redux-wrapper';

export const wrapper = createWrapper(store);