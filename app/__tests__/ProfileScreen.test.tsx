import AsyncStorage from '@react-native-async-storage/async-storage';
import { render } from '@testing-library/react-native';
import ProfileScreen from '../(tabs)/profile';

// typings help
const mockedAsyncStorage = AsyncStorage as unknown as {
  getItem: jest.Mock;
};

describe('ProfileScreen', () => {
  beforeEach(() => {
    jest.resetAllMocks();

    // mock logged-in user
    mockedAsyncStorage.getItem = jest.fn().mockResolvedValue(
      JSON.stringify({ id: 1, name: 'user0' })
    );

    (global as any).fetch = jest.fn().mockResolvedValue({
      ok: true,
      json: async () => [],
    });
  });

  it('shows "No collections yet." when user has no collections', async () => {
    const { findByText } = render(<ProfileScreen />);

    const msg = await findByText('No collections yet.');
    expect(msg).toBeTruthy();

    expect(global.fetch).toHaveBeenCalledWith(
      'http://localhost:8080/collections/user/1',
      expect.objectContaining({
        headers: { Accept: 'application/json' },
      })
    );
  });
});
