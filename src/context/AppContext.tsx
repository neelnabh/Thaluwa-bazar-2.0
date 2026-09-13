'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, UserRole, Notification } from '@/types';
import { ASSAM_LOCATIONS, GeoLocation } from '@/lib/geo';
import { Language, translations } from '@/lib/i18n';

interface AppContextType {
  lang: Language;
  setLang: (lang: Language) => void;
  t: (key: keyof typeof translations['en'], params?: Record<string, string | number>) => string;
  currentUser: User;
  switchUserRole: (role: UserRole) => void;
  currentLocation: GeoLocation;
  setCurrentLocation: (loc: GeoLocation) => void;
  radiusKm: number;
  setRadiusKm: (r: number) => void;
  notifications: Notification[];
  refreshNotifications: () => void;
}

const DEMO_USERS: Record<UserRole, User> = {
  buyer: {
    id: 'user_buyer_1',
    role: 'buyer',
    name: 'Anupam Das (অনুপম দাস)',
    phone: '+91 98640 12345',
    email: 'anupam@example.com',
    password_hash: '',
    location_name: 'Guwahati - Beltola Bazar',
    lat: 26.1285,
    lng: 91.7925,
    is_verified: true,
    created_at: '2026-08-01T08:00:00Z',
  },
  seller: {
    id: 'user_seller_1',
    role: 'seller',
    name: 'Ramen Borah (ৰমেন বৰা - ফাৰ্ম)',
    phone: '+91 94350 98765',
    email: 'ramen@example.com',
    password_hash: '',
    location_name: 'Guwahati - Beltola Bazar',
    lat: 26.1290,
    lng: 91.7940,
    is_verified: true,
    created_at: '2026-08-02T09:00:00Z',
  },
  moderator: {
    id: 'user_mod_1',
    role: 'moderator',
    name: 'Priyanka Baruah (নিয়ন্ত্ৰক)',
    phone: '+91 98642 99001',
    email: 'mod@thaluwabazar.com',
    password_hash: '',
    location_name: 'Guwahati - Panbazar / Fancy Bazar',
    lat: 26.1856,
    lng: 91.7454,
    is_verified: true,
    created_at: '2026-07-15T12:00:00Z',
  },
  admin: {
    id: 'user_admin_1',
    role: 'admin',
    name: 'Thaluwa Admin (প্ৰশাসক)',
    phone: '+91 99540 00000',
    email: 'admin@thaluwabazar.com',
    password_hash: '',
    location_name: 'Guwahati - Dispur / Super Market',
    lat: 26.1424,
    lng: 91.7898,
    is_verified: true,
    created_at: '2026-07-01T00:00:00Z',
  },
};

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [lang, setLang] = useState<Language>('as'); // Assamese-first by default!
  const [currentRole, setCurrentRole] = useState<UserRole>('buyer');
  const [currentUser, setCurrentUser] = useState<User>(DEMO_USERS.buyer);
  const [currentLocation, setCurrentLocation] = useState<GeoLocation>(ASSAM_LOCATIONS[0]); // Beltola Bazar default
  const [radiusKm, setRadiusKm] = useState<number>(5);
  const [notifications, setNotifications] = useState<Notification[]>([]);

  useEffect(() => {
    // Sync user role
    setCurrentUser(DEMO_USERS[currentRole]);
  }, [currentRole]);

  const switchUserRole = (role: UserRole) => {
    setCurrentRole(role);
    setCurrentUser(DEMO_USERS[role]);
  };

  const t = (key: keyof typeof translations['en'], params?: Record<string, string | number>): string => {
    const dict = translations[lang] || translations.en;
    let text = dict[key] || translations.en[key] || String(key);
    if (params) {
      Object.entries(params).forEach(([pKey, pVal]) => {
        text = text.replace(new RegExp(`\\{${pKey}\\}`, 'g'), String(pVal));
      });
    }
    return text;
  };

  const refreshNotifications = () => {
    // lightweight fetch if needed
  };

  return (
    <AppContext.Provider
      value={{
        lang,
        setLang,
        t,
        currentUser,
        switchUserRole,
        currentLocation,
        setCurrentLocation,
        radiusKm,
        setRadiusKm,
        notifications,
        refreshNotifications,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}
