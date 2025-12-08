import AsyncStorage from '@react-native-async-storage/async-storage';
import { render } from '@testing-library/react-native';
import ProfileScreen from '../(tabs)/profile';

// AsyncStorage is mocked in jest.setup.js; we just tweak getItem per test
const mockedAsyncStorage = AsyncStorage as unknown as {
  getItem: jest.Mock;
};

describe('ProfileScreen', () => {
  beforeEach(() => {
    jest.resetAllMocks();

    // default: logged-in user id=1
    mockedAsyncStorage.getItem = jest
      .fn()
      .mockResolvedValue(JSON.stringify({ id: 1, name: 'user0' }));
  });

  it('shows "No collections yet." when user has no collections', async () => {
    // backend returns empty list for this user
    (global as any).fetch = jest.fn().mockResolvedValue({
      ok: true,
      json: async () => [],
    });

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

  it('renders existing collections for the logged-in user', async () => {
    // backend returns two collections for user 1
    (global as any).fetch = jest.fn().mockResolvedValue({
      ok: true,
      json: async () => [
        { id: 10, user_id: 1, name: 'Morning Flow' },
        { id: 11, user_id: 1, name: 'Evening Chill' },
      ],
    });

    const { findByText, queryByText } = render(<ProfileScreen />);

    const morning = await findByText('Morning Flow');
    const evening = await findByText('Evening Chill');

    expect(morning).toBeTruthy();
    expect(evening).toBeTruthy();

    // "No collections yet." should NOT be visible in this case
    expect(queryByText('No collections yet.')).toBeNull();

    expect(global.fetch).toHaveBeenCalledWith(
      'http://localhost:8080/collections/user/1',
      expect.objectContaining({
        headers: { Accept: 'application/json' },
      })
    );
  });
});
