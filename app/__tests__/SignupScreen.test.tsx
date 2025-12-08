import { fireEvent, render } from '@testing-library/react-native';
import SignupScreen from '../signup';

describe('SignupScreen', () => {
  beforeEach(() => {
    jest.resetAllMocks();
    (global as any).fetch = jest.fn();
  });

  it('calls /auth/signup and shows success message', async () => {
    (global as any).fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        user: { id: 2, name: 'newuser' },
        sessionToken: 'token-123',
      }),
    });

    const { getByPlaceholderText, getByTestId, findByText } = render(
      <SignupScreen navigation={{} as any} />
    );

    fireEvent.changeText(getByPlaceholderText('Name'), 'newuser');
    fireEvent.changeText(getByPlaceholderText('Password'), 'password123');

    fireEvent.press(getByTestId('signup-create-account-button'));

    const msg = await findByText('Account created! You can now login.');

    expect(msg).toBeTruthy();
    expect(global.fetch).toHaveBeenCalledWith(
      'http://localhost:8080/auth/signup',
      expect.objectContaining({
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      })
    );
  });
});
