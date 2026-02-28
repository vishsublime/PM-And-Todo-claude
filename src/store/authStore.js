import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export const useAuthStore = create(
  persist(
    (set) => ({
      accessToken: null,
      refreshToken: null,
      user: null, // { userId, email, fullName, tenantId, tenantName, tenantSlug, role }

      setAuth: (authData) =>
        set({
          accessToken: authData.accessToken,
          refreshToken: authData.refreshToken,
          user: {
            userId: authData.userId,
            email: authData.email,
            fullName: authData.fullName,
            tenantId: authData.tenantId,
            tenantName: authData.tenantName,
            tenantSlug: authData.tenantSlug,
            role: authData.role,
          },
        }),

      logout: () =>
        set({
          accessToken: null,
          refreshToken: null,
          user: null,
        }),
    }),
    {
      name: 'prism-auth',
      // Only persist refreshToken and user — access token is short-lived
      partialize: (state) => ({
        refreshToken: state.refreshToken,
        user: state.user,
        // Access token intentionally NOT persisted — will be refreshed on load
      }),
    }
  )
)
