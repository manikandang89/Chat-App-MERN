import React, {ReactNode, useEffect,useState} from 'react';
import { useAppDispatch, useAppSelector } from '../redux/useHooks';
import { fetchUser, updateUserProfile, logout, authCheck } from '../redux/userSlice';


interface LayoutProps {
    children: ReactNode
}

const Layout: React.FC<LayoutProps> = ({children}) => {
  const dispatch = useAppDispatch();
  const { currentUser, isLoading, error } = useAppSelector((state) => state.user);

  useEffect(() => {
    // Fetch user data when component mounts
    if (!currentUser) {
      dispatch(authCheck('user-id-here'));
    }
  }, [dispatch, currentUser]);



 
//   if (isLoading) return <div>Loading...</div>;
//   if (error) return <div>Error: {error}</div>;
//   if (!currentUser) return <div>Not logged in</div>;
  return (
    <div>
      {children}
    </div>
  )
}

export default Layout
