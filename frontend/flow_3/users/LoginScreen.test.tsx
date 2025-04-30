import { render, fireEvent, screen, waitFor } from '@testing-library/react-native';
import { Provider } from 'react-redux';
import { store } from '@/flow_2/slices/store'; // Adjust path to your store file
import { LoginScreen } from './LoginScreen'; // Adjust path to your LoginScreen component
import { login } from './usersSlice'; // Adjust path if needed
import axios from 'axios';

// Mock axios module
jest.mock('axios');

// Define the mock axios response for success and failure
const mockPost = axios.post as jest.MockedFunction<typeof axios.post>;

describe('LoginScreen', () => {
  it('should make an API call when the form is submitted', async () => {
    // Mock the axios.post to return a successful response
    mockPost.mockResolvedValueOnce({
      data: { token: 'fake-token' }, // Simulate a successful login response
    });

    render(
      <Provider store={store}>
        <LoginScreen />
      </Provider>
    );

    // Fill the form with valid data
    fireEvent.changeText(screen.getByPlaceholderText('Username'), 'testuser');
    fireEvent.changeText(screen.getByPlaceholderText('Password'), 'password123');

    // Simulate pressing the login button
    fireEvent.press(screen.getByText('Login'));

    // Wait for the API call to complete and ensure the axios.post was called
    await waitFor(() => expect(mockPost).toHaveBeenCalledWith('/api/login', {
      username: 'testuser',
      password: 'password123',
    }));

    // You can also check if the state changed after the API call, e.g. by checking if the token is saved in the Redux store
    const state = store.getState();
    expect(state.user.token).toBe('fake-token');
  });

  it('should show an error message if the API call fails', async () => {
    // Mock the axios.post to simulate an error response
    mockPost.mockRejectedValueOnce(new Error('Invalid credentials'));

    render(
      <Provider store={store}>
        <LoginScreen />
      </Provider>
    );

    // Fill the form with valid data
    fireEvent.changeText(screen.getByPlaceholderText('Username'), 'testuser');
    fireEvent.changeText(screen.getByPlaceholderText('Password'), 'password123');

    // Simulate pressing the login button
    fireEvent.press(screen.getByText('Login'));

    // Wait for the error message to appear
    await waitFor(() => expect(screen.getByText('Invalid credentials')).toBeTruthy());
  });

  it('should show form error when username or password is empty', async () => {
    render(
      <Provider store={store}>
        <LoginScreen />
      </Provider>
    );

    // Simulate pressing the login button without filling the form
    fireEvent.press(screen.getByText('Login'));

    // Check if the form-level error message appears
    await waitFor(() => expect(screen.getByText('Both username and password are required.')).toBeTruthy());
  });
});
