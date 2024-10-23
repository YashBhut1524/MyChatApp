export const createAuthSlice = (set) => (
    {
        unserInfo: undefined,
        setUserInfo: (userInfo) => set({userInfo})
    }
)