import type { ReactNode } from 'react';
import { Provider } from 'react-redux';
import { render } from '@testing-library/react';

import { createTestStore } from './createTestStore';

export const renderWithProviders = (component: ReactNode) => {
    const store = createTestStore();

    return {
        store,
        ...render(<Provider store={store}>{component}</Provider>),
    };
};
