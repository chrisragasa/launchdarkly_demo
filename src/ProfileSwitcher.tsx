import { useLDClient } from 'launchdarkly-react-client-sdk';
import './ProfileSwitcher.css';

export interface UserProfile {
  key: string;
  name: string;
  email: string;
  role: string;
  region?: string;
  country?: string;
}

export const userProfiles: UserProfile[] = [
  {
    key: 'user-anonymous',
    name: 'Anonymous User',
    email: 'anonymous@example.com',
    role: 'guest',
    region: 'US-West',
    country: 'USA',
  },
  {
    key: 'user-sarah',
    name: 'Sarah Chen',
    email: 'sarah@enterprise.com',
    role: 'enterprise',
    region: 'US-East',
    country: 'USA',
  },
  {
    key: 'user-john',
    name: 'John Smith',
    email: 'john@startup.com',
    role: 'basic',
    region: 'EU-West',
    country: 'UK',
  },
  {
    key: 'user-admin',
    name: 'Admin User',
    email: 'admin@abccompany.com',
    role: 'admin',
    region: 'APAC',
    country: 'Singapore',
  },
];

interface ProfileSwitcherProps {
  currentUser: UserProfile;
  onUserChange: (user: UserProfile) => void;
}

export function ProfileSwitcher({ currentUser, onUserChange }: ProfileSwitcherProps) {
  const ldClient = useLDClient();

  const handleUserSwitch = async (user: UserProfile) => {
    if (ldClient) {
      // Identify the new user to LaunchDarkly
      await ldClient.identify({
        kind: 'user',
        key: user.key,
        name: user.name,
        email: user.email,
        role: user.role,
        region: user.region,
        country: user.country,
      });
    }
    onUserChange(user);
  };

  return (
    <div className="profile-switcher">
      <label htmlFor="user-select">👤 Current User:</label>
      <select
        id="user-select"
        value={currentUser.key}
        onChange={(e) => {
          const user = userProfiles.find((u) => u.key === e.target.value);
          if (user) handleUserSwitch(user);
        }}
      >
        {userProfiles.map((user) => (
          <option key={user.key} value={user.key}>
            {user.name} ({user.role})
          </option>
        ))}
      </select>
      <div className="user-info">
        <small>
          📧 {currentUser.email} | 🏷️ {currentUser.role} | 🌍 {currentUser.region} ({currentUser.country})
        </small>
      </div>
    </div>
  );
}
