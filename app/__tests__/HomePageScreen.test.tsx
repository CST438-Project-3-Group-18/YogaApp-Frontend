import { render } from '@testing-library/react-native';
import HomePageScreen from '../(tabs)/index';

// Mock navigation so useNavigation() doesn't crash
jest.mock('@react-navigation/native', () => {
  const actual = jest.requireActual('@react-navigation/native');
  return {
    ...actual,
    useNavigation: () => ({
      reset: jest.fn(),
      navigate: jest.fn(),
    }),
  };
});

describe('HomePageScreen', () => {
  beforeEach(() => {
    jest.resetAllMocks();
    (global as any).fetch = jest.fn();
  });

  it('displays a random pose from /poses/random on mount', async () => {
    (global as any).fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        id: 5,
        name: 'Downward Dog',
        image: 'https://example.com/dog.png',
        description: 'A nice pose.',
        difficulty: 'Easy',
        style: 'Vinyasa',
      }),
    });

    const { findByText } = render(<HomePageScreen />);

    const poseName = await findByText('Downward Dog');
    expect(poseName).toBeTruthy();
    expect(global.fetch).toHaveBeenCalledWith('http://10.0.2.2:8080/poses/random');
  });
});
