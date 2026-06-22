// app/StoreHydrator.tsx
'use client';
import { useEffect } from 'react';
import { store } from '@/app/store';

export default function StoreHydrator() {

  useEffect(() => {
    fetch('/api/users/me')
      .then(res => res.json())
      .then((user) => {
        if (user.success) Object.assign(store, user.data);
      })
      .catch(() => {})
      .finally(() => {
        store.hydrated = true;
      });
  }, []);

  return null;
}