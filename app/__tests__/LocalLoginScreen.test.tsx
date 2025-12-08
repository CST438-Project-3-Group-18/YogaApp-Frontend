import { fireEvent, render, waitFor } from '@testing-library/react-native';
import LocalLoginScreen from '../locallogin';

const mockNavigate = jest.fn();

const mockNavigation: any = {
  replace: mockNavigate,
};

describe('LocalLoginScreen', () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });

  it('calls /auth/login and navigates on success', async () => {
    (global as any).fetch = jest.fn().mockResolvedValue({
      ok: true,
      json: async () => ({
        user: { id: 1, name: 'user0' },
        sessionToken: 'abc123',
      }),
    });

    const { getByPlaceholderText, getByTestId } = render(
      <LocalLoginScreen navigation={mockNavigation} />
    );

    fireEvent.changeText(getByPlaceholderText('Name'), 'user0');
    fireEvent.changeText(getByPlaceholderText('Password'), 'password');

    fireEvent.press(getByTestId('local-login-button'));

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith(
        'http://localhost:8080/auth/login',
        expect.objectContaining({
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
        })
      );
      expect(mockNavigate).toHaveBeenCalledWith('Home');
    });
  });
});
