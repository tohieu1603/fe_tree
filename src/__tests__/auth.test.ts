import { getUser, isAuthenticated } from '@/lib/auth';
import Cookies from 'js-cookie';

jest.mock('js-cookie');

describe('Auth Utils', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('isAuthenticated', () => {
    it('returns true when token exists', () => {
      (Cookies.get as jest.Mock).mockReturnValue('test-token');
      expect(isAuthenticated()).toBe(true);
    });

    it('returns false when token does not exist', () => {
      (Cookies.get as jest.Mock).mockReturnValue(undefined);
      expect(isAuthenticated()).toBe(false);
    });
  });

  describe('getUser', () => {
    it('returns user object when cookie exists', () => {
      const mockUser = { id: '1', email: 'test@test.com', fullName: 'Test', role: 'ADMIN' };
      (Cookies.get as jest.Mock).mockReturnValue(JSON.stringify(mockUser));

      expect(getUser()).toEqual(mockUser);
    });

    it('returns null when cookie does not exist', () => {
      (Cookies.get as jest.Mock).mockReturnValue(undefined);
      expect(getUser()).toBeNull();
    });
  });
});
